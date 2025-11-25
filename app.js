/********** Globals **********/

let allProducts = [];
let currentView;
let COLOR_MAP = {}; // global map for colorName to hex

let cart = [];

function loadCart() {
  const saved = localStorage.getItem("cart");
  cart = saved ? JSON.parse(saved) : [];
}

function updateBagCount() {
  const badge = document.querySelector("#bag-count");
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  if (totalQty > 0) {
    badge.textContent = totalQty;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.querySelector("p").textContent = message;

  // Slide in
  toast.classList.remove("translate-x-full");

  // Slide out after 1.5s
  setTimeout(() => {
    toast.classList.add("translate-x-full");
  }, 1500);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

loadCart();
updateBagCount();


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
      
      // Add event listeners to gender checkboxes
      document.querySelectorAll(".gender-checkbox").forEach((cb) => {
        cb.addEventListener("change", applyBrowseFilters);
      });
      
      applyBrowseFilters();
      initCollapsibleFilters();
    })
    .catch((err) => console.error(err));

  /******************** ABOUT DIALOG ********************/
  
  const aboutDialog = document.querySelector("#about-dialog");
  ["nav-about", "mobile-nav-about", "footer-about"].forEach((id) => {
    document.querySelector(`#${id}`).addEventListener("click", () => aboutDialog.showModal())
  });
  document.querySelector("#close-dialog").addEventListener("click", () => aboutDialog.close());
  document.querySelector("#close-dialog-btn").addEventListener("click", () => aboutDialog.close());
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

    document.querySelectorAll(".gender-checkbox").forEach((cb) => (cb.checked = cb.value === gender));
    document.querySelectorAll(".category-checkbox").forEach((cb) => (cb.checked = cb.value === category));

    applyBrowseFilters();
  });

  /******************** SORT LISTENER ********************/

  document.querySelector("#sort").addEventListener("change", applyBrowseFilters);

  /******************** CLEAR ALL ********************/

  document.querySelector("#clear-all-btn").addEventListener("click", () => {
    document.querySelectorAll("input[type=checkbox]").forEach((cb) => (cb.checked = false));
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

  document.querySelector("#shipping-type").addEventListener("change", renderCart);
  document.querySelector("#shipping-destination").addEventListener("change", renderCart);

  document.querySelector("#checkout-btn").addEventListener("click", () => {
    const shipType = document.querySelector("#shipping-type").value;
    const shipDest = document.querySelector("#shipping-destination").value;

    // Validate shipping
    if (!shipType || !shipDest) {
      showToast("Please select shipping type and destination");
      return;
    }

    // Success message
    showToast("Order placed successfully!");

    // Clear cart after a small delay to let toast show
    setTimeout(() => {
      cart = [];
      saveCart();
      updateBagCount();
      switchView("home-view");
    }, 300);
  });

/********** VIEW SWITCHING **********/

function switchView(id) {
  const newView = document.querySelector("#" + id);
  if (!newView || currentView === newView) return;

  currentView.classList.add("hidden");
  newView.classList.remove("hidden");
  currentView = newView;

  window.scrollTo(0, 0);

  if (id === "browse-view") applyBrowseFilters();
  if (id === "cart-view") renderCart();
}

function closeMobileMenu(menu, a, b, c) {
  menu.classList.add("hidden");
  a.style.transform = "none";
  b.style.opacity = "1";
  c.style.transform = "none";
}

/********** BUILD COLOR MAP **********/

function buildColorMap(products) {
  COLOR_MAP = {};
  products.forEach((prod) => {
    prod.color.forEach((c) => {
      if (!COLOR_MAP[c.name]) COLOR_MAP[c.name] = c.hex;
    });
  });
}

/********** BUILD FILTERS **********/

function buildDynamicFilters(products) {
  //Category Checkboxes
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

  // Size Checkboxes
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

  // HEX Color Checkboxes
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

/********** APPLY FILTERS + SORTING **********/

function applyBrowseFilters() {
  let results = [...allProducts];

  // Gender
  const genderVals = [
    ...document.querySelectorAll(".gender-checkbox:checked"),
  ].map((cb) => cb.value);
  if (genderVals.length > 0)
    results = results.filter((p) => genderVals.includes(p.gender));

  // Category
  const catVals = [
    ...document.querySelectorAll(".category-checkbox:checked"),
  ].map((cb) => cb.value);
  if (catVals.length > 0)
    results = results.filter((p) => catVals.includes(p.category));

  // Size
  const sizeVals = [...document.querySelectorAll(".size-checkbox:checked")].map(
    (cb) => cb.value
  );
  if (sizeVals.length > 0)
    results = results.filter((p) => p.sizes.some((s) => sizeVals.includes(s)));

  // Colors
  const colorVals = [
    ...document.querySelectorAll(".color-checkbox:checked"),
  ].map((cb) => cb.value);
  if (colorVals.length > 0)
    results = results.filter((prod) =>
      prod.color.some((c) => colorVals.includes(c.name))
    );

  // Sorting
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

/********** ADD TO CART **********/

function addToCart(productId, qty, size, colorHex) {
  qty = Number(qty);

  const existing = cart.find(
    (item) =>
      item.id === productId && item.size === size && item.color === colorHex
  );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: productId,
      qty: qty,
      size: size,
      color: colorHex,
    });
  }

  saveCart();
  updateBagCount();
  showToast("Added to bag");
}

/********** FILTER CHIPS **********/

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
    x.textContent = "x";
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

/********** PRODUCT GRID **********/

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

    // Placeholder for image (color)
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

      // Default add-to-cart settings
      const qty = 1;
      const size = product.sizes[0]; // first available size
      const colorHex = product.color[0].hex; // first color

      addToCart(product.id, qty, size, colorHex);
      showToast("Added to bag");
    });

    infoDiv.appendChild(name);
    infoDiv.appendChild(category);
    infoDiv.appendChild(price);

    card.appendChild(imageDiv);
    card.appendChild(infoDiv);
    card.appendChild(bagBtn);

    card.addEventListener("click", () => showProduct(product.id));

    resultsGrid.appendChild(card);
  });
}

/********** PRODUCT VIEW **********/

function showProduct(productId) {
  const product = allProducts.find((p) => p.id == productId);
  if (!product) return;

  // Breadcrumbs
  document.querySelector("#breadcrumb-gender").textContent = product.gender.charAt(0).toUpperCase() + product.gender.slice(1);

  document.querySelector("#breadcrumb-category").textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);

  document.querySelector("#breadcrumb-product").textContent = product.name;

  // Title / Price / Description
  document.querySelector("#product-title").textContent = product.name;
  document.querySelector("#product-price").textContent =
    "$" + product.price.toFixed(2);
  document.querySelector("#product-description").textContent =
    product.description;

  // Material
  document.querySelector("#product-material").textContent = product.material;

  // Color Block Placeholder
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
    const qty = document.querySelector("#product-qty").value;

    const selectedSizeBtn = document.querySelector("#product-sizes .bg-black");
    const size = selectedSizeBtn ? selectedSizeBtn.dataset.size : null;

    const selectedColor = document.querySelector("#product-colors .ring-2");
    const colorHex = selectedColor
      ? selectedColor.style.backgroundColor
      : product.color[0].hex;

    document.querySelector("#add-to-cart-btn").onclick = () => {
      const qty = document.querySelector("#product-qty").value;

      // Size validation
      const selectedSizeBtn = document.querySelector(
        "#product-sizes .bg-black"
      );
      const size = selectedSizeBtn ? selectedSizeBtn.dataset.size : null;

      if (!size) {
        showToast("Please choose a size");
        return;
      }

      // Color validation
      const selectedColor = document.querySelector("#product-colors .ring-2");
      const colorHex = selectedColor
        ? selectedColor.style.backgroundColor
        : null;

      if (!colorHex) {
        showToast("Please choose a color");
        return;
      }

      addToCart(product.id, qty, size, colorHex);
      showToast("Added to bag");
    };
  };

  // Load related products
  showRelatedProducts(product);

  // Finally show product view
  switchView("product-view");
}

/********** RELATED PRODUCTS **********/

function showRelatedProducts(currentProduct) {
  const grid = document.querySelector("#related-products-grid");
  grid.innerHTML = "";

  // Break product name into words (in lowercase and no short useless words)
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

    // Placeholder image
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

/********** CART RENDERER **********/

function renderCart() {
  const container = document.querySelector("#cart-items-container");
  const emptyMsg = document.querySelector("#empty-cart-msg");
  const shippingSection = document.querySelector("#shipping-section");

  const sumMerch = document.querySelector("#summary-merch");
  const sumShip = document.querySelector("#summary-shipping");
  const sumTax = document.querySelector("#summary-tax");
  const sumTotal = document.querySelector("#summary-total");

  const shipType = document.querySelector("#shipping-type");
  const shipDest = document.querySelector("#shipping-destination");

  container.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.classList.remove("hidden");
    shippingSection.classList.add("hidden");
    return;
  }

  emptyMsg.classList.add("hidden");
  shippingSection.classList.remove("hidden");

  let merchandiseTotal = 0;

  // Render each item in cart
  cart.forEach((item, index) => {
    const product = allProducts.find((p) => p.id === item.id);
    if (!product) return;

    const subtotal = product.price * item.qty;
    merchandiseTotal += subtotal;

    // Row container
    const row = document.createElement("div");
    row.classList.add("flex", "items-center", "justify-between", "border-b", "py-4");

    // Image + info wrapper
    const left = document.createElement("div");
    left.classList.add("flex", "items-center", "gap-4", "flex-1");

    // Color box
    const colorBox = document.createElement("div");
    colorBox.classList.add("w-16", "h-16", "rounded", "border");
    colorBox.style.background = item.color;

    // Info stack
    const info = document.createElement("div");

    // Product name
    const name = document.createElement("p");
    name.classList.add("font-medium", "text-sm");
    name.textContent = product.name;

    // Size
    const size = document.createElement("p");
    size.classList.add("text-xs", "text-gray-500");
    size.textContent = `Size: ${item.size}`;

    // Quantity
    const qty = document.createElement("p");
    qty.classList.add("text-xs", "text-gray-500");
    qty.textContent = `Qty: ${item.qty}`;

    info.appendChild(name);
    info.appendChild(size);
    info.appendChild(qty);

    left.appendChild(colorBox);
    left.appendChild(info);

    // Subtotal + remove button
    const right = document.createElement("div");
    right.classList.add("flex", "flex-col", "items-end", "gap-2", "w-28");

    // Subtotal
    const subtotalElem = document.createElement("p");
    subtotalElem.classList.add("text-sm", "font-medium");
    subtotalElem.textContent = `$${subtotal.toFixed(2)}`;

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("px-3", "py-1", "border", "rounded", "hover:bg-gray-200");
    removeBtn.dataset.remove = index;
    removeBtn.textContent = "Remove";

    right.appendChild(subtotalElem);
    right.appendChild(removeBtn);

    row.appendChild(left);
    row.appendChild(right);

    container.appendChild(row);
  });

  /**************** SHIPPING + TAX ****************/

  let shippingCost = 0;

  if (shipDest.value && shipType.value) {
    // Free shipping if merchandise total is over $500
    if (merchandiseTotal > 500) {
      shippingCost = 0;
    } else {
      const shipTable = {
        CA: { standard: 10, express: 25, priority: 35 },
        US: { standard: 15, express: 25, priority: 50 },
        INT: { standard: 20, express: 30, priority: 50 },
      };
      shippingCost = shipTable[shipDest.value][shipType.value];
    }
  }

  const tax = shipDest.value === "CA" ? merchandiseTotal * 0.05 : 0;

  sumMerch.textContent = "$" + merchandiseTotal.toFixed(2);
  sumShip.textContent = "$" + shippingCost.toFixed(2);
  sumTax.textContent = "$" + tax.toFixed(2);
  sumTotal.textContent =
    "$" + (merchandiseTotal + shippingCost + tax).toFixed(2);

  // Remove buttons 
  document.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.remove);
      const item = cart[index];

      // Remove only the matching item
      cart = cart.filter(
        (c) =>
          !(c.id === item.id && c.size === item.size && c.color === item.color)
      );

      saveCart();
      updateBagCount();
      renderCart();
    });
  });
}

/********** CATEGORY TILE to AUTO FILTER **********/

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

/********** COLLAPSIBLE FILTER PANEL **********/

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

});
