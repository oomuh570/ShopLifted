/************************************************************
 * GLOBALS
 ************************************************************/
let allProducts = [];
let currentView;
let COLOR_MAP = {}; // global map for colorName → hex

/************************************************************
 * DOM READY
 ************************************************************/
document.addEventListener("DOMContentLoaded", () => {
  /******************** NAVIGATION ********************/
  const menuToggle = document.querySelector("#mobile-menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  const topLine = document.querySelector(".top-line");
  const middleLine = document.querySelector(".middle-line");
  const bottomLine = document.querySelector(".bottom-line");

  currentView = document.querySelector("#home-view");

  document.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    if (!mobileMenu.classList.contains("hidden")) {
      topLine.style.transform = "rotate(45deg) translateY(4px)";
      middleLine.style.opacity = "0";
      bottomLine.style.transform = "rotate(-45deg) translateY(-4px)";
    } else {
      closeMobileMenu(mobileMenu, topLine, middleLine, bottomLine);
    }
  });

  /******************** FETCH PRODUCTS ********************/
  const url =
    "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";

  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      allProducts = data;

      buildColorMap(allProducts);
      buildDynamicFilters(allProducts);
      applyBrowseFilters();
      initCollapsibleFilters(); // <--- NEW interactive filters
    })
    .catch((err) => console.error(err));

  /******************** ABOUT DIALOG ********************/
  const aboutDialog = document.querySelector("#about-dialog");
  ["nav-about", "mobile-nav-about", "footer-about"].forEach((id) => {
    document
      .querySelector(`#${id}`)
      .addEventListener("click", () => aboutDialog.showModal());
  });
  document
    .querySelector("#close-dialog")
    .addEventListener("click", () => aboutDialog.close());
  document
    .querySelector("#close-dialog-btn")
    .addEventListener("click", () => aboutDialog.close());
  aboutDialog.addEventListener("click", (e) => {
    if (e.target === aboutDialog) aboutDialog.close();
  });

  /******************** BREADCRUMB EVENTS ********************/
  const bcHome = document.querySelector("#breadcrumb-home");
  const bcGender = document.querySelector("#breadcrumb-gender");
  const bcCategory = document.querySelector("#breadcrumb-category");

  bcHome.addEventListener("click", () => switchView("home-view"));

  bcGender.addEventListener("click", () => {
    const g = bcGender.textContent.trim().toLowerCase();
    if (g === "mens") switchView("men-view");
    if (g === "womens") switchView("women-view");
  });

  bcCategory.addEventListener("click", () => {
    const category = bcCategory.textContent.trim();
    const gender = bcGender.textContent.trim().toLowerCase();

    switchView("browse-view");

    document
      .querySelectorAll(".gender-checkbox")
      .forEach((cb) => (cb.checked = cb.value === gender));
    document
      .querySelectorAll(".category-checkbox")
      .forEach((cb) => (cb.checked = cb.value === category));

    applyBrowseFilters();
  });

  /******************** SORT LISTENER ********************/
  document
    .querySelector("#sort")
    .addEventListener("change", applyBrowseFilters);

  /******************** CLEAR ALL ********************/
  document.querySelector("#clear-all-btn").addEventListener("click", () => {
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach((cb) => (cb.checked = false));
    document.querySelector("#sort").value = "nameAZ";
    applyBrowseFilters();
  });

  /******************** MEN/WOMEN TILE FILTERING ********************/
  document.querySelectorAll(".product-card").forEach((tile) => {
    tile.addEventListener("click", () => {
      const tag = tile.dataset.product;
      if (!tag) return;

      const [gender, rawCat] = tag.split("-");
      const category = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);

      openBrowseWithFilters(gender, category);
    });
  });
});

/************************************************************
 * VIEW SWITCHING
 ************************************************************/
function switchView(id) {
  const newView = document.querySelector("#" + id);
  if (!newView || currentView === newView) return;

  currentView.classList.add("hidden");
  newView.classList.remove("hidden");
  currentView = newView;

  window.scrollTo(0, 0);

  if (id === "browse-view") applyBrowseFilters();
}

function closeMobileMenu(menu, a, b, c) {
  menu.classList.add("hidden");
  a.style.transform = "none";
  b.style.opacity = "1";
  c.style.transform = "none";
}

/************************************************************
 * BUILD COLOR MAP
 ************************************************************/
function buildColorMap(products) {
  COLOR_MAP = {};
  products.forEach((prod) => {
    prod.color.forEach((c) => {
      if (!COLOR_MAP[c.name]) COLOR_MAP[c.name] = c.hex;
    });
  });
}

/************************************************************
 * BUILD FILTERS (Dynamic)
 ************************************************************/
function buildDynamicFilters(products) {
  /******** CATEGORY CHECKBOXES *********/
  const categoryDiv = document.querySelector("#filter-category");
  categoryDiv.innerHTML = "";

  const categories = [...new Set(products.map((p) => p.category))].sort();

  categories.forEach((cat) => {
    const label = document.createElement("label");
    label.className = "flex items-center gap-2";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = cat;
    cb.className = "category-checkbox";
    cb.addEventListener("change", applyBrowseFilters);

    label.append(cb, cat);
    categoryDiv.appendChild(label);
  });

  /******** SIZE CHECKBOXES *********/
  const sizeDiv = document.querySelector("#filter-size");
  sizeDiv.innerHTML = "";

  const sizes = [...new Set(products.flatMap((p) => p.sizes))].sort();

  sizes.forEach((size) => {
    const label = document.createElement("label");
    label.className = "flex items-center gap-2";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = size;
    cb.className = "size-checkbox";
    cb.addEventListener("change", applyBrowseFilters);

    label.append(cb, size);
    sizeDiv.appendChild(label);
  });

  /******** COLOR CHECKBOXES WITH HEX *********/
  const colorDiv = document.querySelector("#filter-color");
  colorDiv.innerHTML = "";

  const colorNames = Object.keys(COLOR_MAP).sort();

  colorNames.forEach((name) => {
    const hex = COLOR_MAP[name];

    const label = document.createElement("label");
    label.className = "flex items-center gap-2";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = name;
    cb.className = "color-checkbox";
    cb.addEventListener("change", applyBrowseFilters);

    const swatch = document.createElement("span");
    swatch.className = "inline-block w-4 h-4 border";
    swatch.style.backgroundColor = hex;

    label.append(cb, swatch, " " + name);
    colorDiv.appendChild(label);
  });
}

/************************************************************
 * APPLY FILTERS + SORTING
 ************************************************************/
function applyBrowseFilters() {
  let results = [...allProducts];

  /******** GENDER *********/
  const genderVals = [
    ...document.querySelectorAll(".gender-checkbox:checked"),
  ].map((cb) => cb.value);
  if (genderVals.length > 0)
    results = results.filter((p) => genderVals.includes(p.gender));

  /******** CATEGORY *********/
  const catVals = [
    ...document.querySelectorAll(".category-checkbox:checked"),
  ].map((cb) => cb.value);
  if (catVals.length > 0)
    results = results.filter((p) => catVals.includes(p.category));

  /******** SIZE *********/
  const sizeVals = [...document.querySelectorAll(".size-checkbox:checked")].map(
    (cb) => cb.value
  );
  if (sizeVals.length > 0)
    results = results.filter((p) => p.sizes.some((s) => sizeVals.includes(s)));

  /******** COLORS *********/
  const colorVals = [
    ...document.querySelectorAll(".color-checkbox:checked"),
  ].map((cb) => cb.value);
  if (colorVals.length > 0)
    results = results.filter((prod) =>
      prod.color.some((c) => colorVals.includes(c.name))
    );

  /******** SORTING *********/
  const sort = document.querySelector("#sort").value;

  switch (sort) {
    case "nameAZ":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "nameZA":
      results.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "priceLow":
      results.sort((a, b) => a.price - b.price);
      break;
    case "priceHigh":
      results.sort((a, b) => b.price - a.price);
      break;
    case "category":
      results.sort((a, b) => a.category.localeCompare(b.category));
      break;
  }

  displayProducts(results);
  updateActiveFiltersUI();
}

/************************************************************
 * FILTER CHIPS
 ************************************************************/
function updateActiveFiltersUI() {
  const container = document.querySelector("#active-filters-container");
  container.innerHTML = "";

  const genders = [
    ...document.querySelectorAll(".gender-checkbox:checked"),
  ].map((cb) => cb.value);
  const categories = [
    ...document.querySelectorAll(".category-checkbox:checked"),
  ].map((cb) => cb.value);
  const sizes = [...document.querySelectorAll(".size-checkbox:checked")].map(
    (cb) => cb.value
  );
  const colors = [...document.querySelectorAll(".color-checkbox:checked")].map(
    (cb) => cb.value
  );

  const filters = [];

  genders.forEach((v) => filters.push({ type: "gender", value: v }));
  categories.forEach((v) => filters.push({ type: "category", value: v }));
  sizes.forEach((v) => filters.push({ type: "size", value: v }));
  colors.forEach((v) => filters.push({ type: "color", value: v }));

  filters.forEach((f) => {
    const chip = document.createElement("span");
    chip.className =
      "inline-flex items-center gap-2 bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full";

    chip.textContent = f.value;

    const x = document.createElement("button");
    x.textContent = "×";
    x.className = "hover:text-black";

    x.addEventListener("click", () => {
      if (f.type === "gender")
        document.querySelectorAll(".gender-checkbox").forEach((cb) => {
          if (cb.value === f.value) cb.checked = false;
        });

      if (f.type === "category")
        document.querySelectorAll(".category-checkbox").forEach((cb) => {
          if (cb.value === f.value) cb.checked = false;
        });

      if (f.type === "size")
        document.querySelectorAll(".size-checkbox").forEach((cb) => {
          if (cb.value === f.value) cb.checked = false;
        });

      if (f.type === "color")
        document.querySelectorAll(".color-checkbox").forEach((cb) => {
          if (cb.value === f.value) cb.checked = false;
        });

      applyBrowseFilters();
    });

    chip.appendChild(x);
    container.appendChild(chip);
  });
}

/************************************************************
 * PRODUCT GRID
 ************************************************************/
// Displays all the products in the browse view
function displayProducts(products) {
  const resultsGrid = document.querySelector("#browse-results");
  const emptyMessage = document.querySelector("#browse-empty");

  // Clear previous results
  resultsGrid.innerHTML = "";

  if (products.length === 0) {
    emptyMessage.classList.remove("hidden");
    return;
  }

  emptyMessage.classList.add("hidden");

  products.forEach((product) => {
    // Product card container
    const card = document.createElement("div");
    card.classList.add("group", "cursor-pointer");
    card.dataset.productId = product.id;

    // --- COLOR PLACEHOLDER IMAGE ---
    const imageDiv = document.createElement("div");
    imageDiv.classList.add(
      "aspect-square",
      "mb-3",
      "overflow-hidden",
      "flex",
      "items-center",
      "justify-center"
    );

    const primaryColor = product.color[0];
    const bgHex = primaryColor?.hex || "#cccccc";

    imageDiv.style.backgroundColor = bgHex;
    imageDiv.textContent = "";

    // Container for product info
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("text-center");

    // Product name
    const name = document.createElement("h3");
    name.classList.add("text-sm", "font-light", "mb-1");
    name.textContent = product.name;

    // Product category
    const category = document.createElement("p");
    category.classList.add("text-xs", "text-gray-500", "mb-1");
    category.textContent = product.category;

    // Product price
    const price = document.createElement("p");
    price.classList.add("text-sm", "font-light");
    price.textContent = "$" + product.price.toFixed(2);

    // Add to Bag button
    const bagBtn = document.createElement("button");
    bagBtn.innerText = "Add to Bag";
    bagBtn.className = "mt-2 w-full py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition";
    bagBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelector("#nav-cart").click();
    });

    infoDiv.appendChild(name);
    infoDiv.appendChild(category);
    infoDiv.appendChild(price);

    card.appendChild(imageDiv);
    card.appendChild(infoDiv);
    card.appendChild(bagBtn);

    // ⭐ FIX — make product card clickable again
    card.addEventListener("click", () => showProduct(product.id));

    resultsGrid.appendChild(card);
  });
}



/************************************************************
 * PRODUCT VIEW
 ************************************************************/
function showProduct(productId) {
  const product = allProducts.find((p) => p.id == productId);
  if (!product) return;

  // Breadcrumbs
  document.querySelector("#breadcrumb-gender").textContent =
    product.gender.charAt(0).toUpperCase() + product.gender.slice(1);

  document.querySelector("#breadcrumb-category").textContent =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);

  document.querySelector("#breadcrumb-product").textContent = product.name;

  // Title / Price / Description
  document.querySelector("#product-title").textContent = product.name;
  document.querySelector("#product-price").textContent =
    "$" + product.price.toFixed(2);
  document.querySelector("#product-description").textContent =
    product.description;

  // Material
  document.querySelector("#product-material").textContent = product.material;

  // Main Image Placeholder (color block)
  const mainImg = document.querySelector("#product-main-image");
  const mainHex = product.color?.[0]?.hex || "#cccccc";

  mainImg.style.backgroundColor = mainHex;
  mainImg.style.borderRadius = "8px";
  mainImg.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
  mainImg.style.border = "1px solid rgba(0,0,0,0.12)";
  mainImg.style.backgroundImage =
    "linear-gradient(135deg, rgba(255,255,255,0.18) 25%, transparent 25%), " +
    "linear-gradient(135deg, transparent 75%, rgba(255,255,255,0.18) 75%)";
  mainImg.style.backgroundSize = "22px 22px";
  mainImg.style.backgroundBlendMode = "overlay";

  // Sizes
  const sizesContainer = document.querySelector("#product-sizes");
  sizesContainer.innerHTML = "";
  product.sizes.forEach((size) => {
    const btn = document.createElement("button");
    btn.textContent = size;
    btn.className =
      "px-3 py-1 text-sm border border-gray-400 rounded hover:bg-gray-100";
    btn.dataset.size = size;

    btn.addEventListener("click", () => {
      // unselect all
      document.querySelectorAll("#product-sizes button").forEach((b) => {
        b.classList.remove("bg-black", "text-white");
      });
      // select this size
      btn.classList.add("bg-black", "text-white");
    });

    sizesContainer.appendChild(btn);
  });

  // Colors
  const colorsContainer = document.querySelector("#product-colors");
  colorsContainer.innerHTML = "";
  product.color.forEach((c) => {
    const swatch = document.createElement("div");
    swatch.className = "w-6 h-6 rounded border cursor-pointer";
    swatch.style.backgroundColor = c.hex;

    swatch.addEventListener("click", () => {
      // unselect all swatches
      document
        .querySelectorAll("#product-colors div")
        .forEach((d) => d.classList.remove("ring-2", "ring-black"));

      swatch.classList.add("ring-2", "ring-black");
    });

    colorsContainer.appendChild(swatch);
  });

  // Quantity default
  document.querySelector("#product-qty").value = 1;

  // Add to Cart Handler
  document.querySelector("#add-to-cart-btn").onclick = () => {
    alert("Added to cart (cart system can be added next)");
  };

  // Load related products
  showRelatedProducts(product);

  // Finally show product view
  switchView("product-view");
}


/************************************************************
 * RELATED PRODUCTS
 ************************************************************/
function showRelatedProducts(currentProduct) {
  const grid = document.querySelector("#related-products-grid");
  grid.innerHTML = "";

  // Break product name into words (lowercase, no short useless words)
  const nameWords = currentProduct.name
    .toLowerCase()
    .split(" ")
    .filter((w) => w.length > 2); // ignore: "to", "of", "by", etc.

  // Get all other products
  let others = allProducts.filter((p) => p.id !== currentProduct.id);

  // Find products whose names contain ANY of the words
  let matchedByName = others.filter((p) =>
    nameWords.some((word) => p.name.toLowerCase().includes(word))
  );

  // If fewer than 4 matches, fill the rest with closest-priced items
  if (matchedByName.length < 4) {
    const missing = 4 - matchedByName.length;

    // Sort by closest price
    const closestByPrice = others
      .filter((p) => !matchedByName.includes(p))
      .map((p) => ({
        product: p,
        diff: Math.abs(p.price - currentProduct.price),
      }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, missing)
      .map((item) => item.product);

    matchedByName = matchedByName.concat(closestByPrice);
  }

  // Only show 4 final items
  const related = matchedByName.slice(0, 4);

  // Render related product cards
  related.forEach((product) => {
    const card = document.createElement("div");
    card.className =
      "cursor-pointer border border-gray-300 rounded-md p-3 hover:shadow transition";

    // Placeholder image (colored)
    const img = document.createElement("div");
    img.className = "w-full aspect-square rounded-md mb-3";

    const hex = product.color?.[0]?.hex || "#cccccc";
    img.style.backgroundColor = hex;
    img.style.borderRadius = "6px";
    img.style.boxShadow = "0 2px 6px rgba(0,0,0,0.12)";
    img.style.border = "1px solid rgba(0,0,0,0.10)";
    img.style.backgroundImage =
      "linear-gradient(135deg, rgba(255,255,255,0.18) 25%, transparent 25%), " +
      "linear-gradient(135deg, transparent 75%, rgba(255,255,255,0.18) 75%)";
    img.style.backgroundSize = "20px 20px";
    img.style.backgroundBlendMode = "overlay";

    // Title + Price
    const title = document.createElement("p");
    title.className = "text-sm text-gray-700";
    title.textContent = product.name;

    const price = document.createElement("p");
    price.className = "text-sm text-gray-500";
    price.textContent = "$" + product.price.toFixed(2);

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(price);

    card.addEventListener("click", () => showProduct(product.id));

    grid.appendChild(card);
  });
}


/************************************************************
 * CATEGORY TILE → AUTO FILTER
 ************************************************************/
function openBrowseWithFilters(gender, category) {
  switchView("browse-view");

  document
    .querySelectorAll(".gender-checkbox")
    .forEach((cb) => (cb.checked = cb.value === gender));
  document
    .querySelectorAll(".category-checkbox")
    .forEach((cb) => (cb.checked = cb.value === category));
  document
    .querySelectorAll(".color-checkbox")
    .forEach((c) => (c.checked = false));
  document
    .querySelectorAll(".size-checkbox")
    .forEach((c) => (c.checked = false));

  applyBrowseFilters();
}

/************************************************************
 * COLLAPSIBLE FILTER PANEL (NEW)
 ************************************************************/
function initCollapsibleFilters() {
  document.querySelectorAll(".filter-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.parentElement;
      const content = section.querySelector(".filter-content");
      const icon = section.querySelector(".toggle-icon");

      content.classList.toggle("hidden");

      if (content.classList.contains("hidden")) {
        icon.textContent = "►"; // collapsed
      } else {
        icon.textContent = "▼"; // expanded
      }
    });
  });
}
