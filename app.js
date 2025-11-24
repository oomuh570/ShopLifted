// ======================================
// GLOBAL PRODUCT DATA (PHASE 1 SUBSET)
// ======================================

let products = [
  {
    id: "P001",
    name: "Silk Wrap Blouse",
    gender: "womens",
    category: "Tops",
    price: 89.99,
    description: "A soft silk blouse with elegant wrap styling.",
    colors: [
      { name: "Ivory", hex: "#FFFFF0" },
      { name: "Black", hex: "#000000" },
    ],
    sizes: ["XS", "S", "M", "L"],
    material: "100% Silk",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
  },
  {
    id: "P002",
    name: "Floral Summer Dress",
    gender: "womens",
    category: "Dresses",
    price: 129.99,
    description: "Lightweight floral dress perfect for warm days.",
    colors: [{ name: "Blue", hex: "#1E3A8A" }],
    sizes: ["S", "M", "L"],
    material: "Cotton Blend",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
  },
  {
    id: "P003",
    name: "Men’s Wool Overcoat",
    gender: "mens",
    category: "Outerwear",
    price: 249.99,
    description: "Classic wool overcoat for winter layering.",
    colors: [
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Black", hex: "#000000" },
    ],
    sizes: ["M", "L", "XL"],
    material: "100% Wool",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
  },
  {
    id: "P004",
    name: "Tailored Denim Jeans",
    gender: "mens",
    category: "Bottoms",
    price: 79.99,
    description: "Slim-fit jeans with a clean modern silhouette.",
    colors: [{ name: "Blue", hex: "#1E40AF" }],
    sizes: ["S", "M", "L", "XL"],
    material: "100% Cotton",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
  },
  {
    id: "P005",
    name: "Unisex Leather Sneakers",
    gender: "mens",
    category: "Shoes",
    price: 139.99,
    description: "Minimalist leather sneakers designed for comfort.",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
    ],
    sizes: ["7", "8", "9", "10", "11"],
    material: "Genuine Leather",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
  },
];


document.addEventListener("DOMContentLoaded", () => {
  /******************** Navigation ********************/

  // Mobile menu elements
  const menuToggle = document.querySelector("#mobile-menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  const topLine = document.querySelector(".top-line");
  const middleLine = document.querySelector(".middle-line");
  const bottomLine = document.querySelector(".bottom-line");

  // Nav elements
  let currentView = document.querySelector("#home-view");
  const navBtns = document.querySelectorAll("[data-view]");

  navBtns.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      const newView = document.querySelector("#" + view);

      if (newView !== currentView) {
        window.scrollTo(0, 0);

        currentView.classList.add("hidden");
        newView.classList.remove("hidden");
        currentView = newView;

        closeMobileMenu(mobileMenu, topLine, middleLine, bottomLine);
      }
    });
  });

  // Mobile menu toggle
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");

    if (!mobileMenu.classList.contains("hidden")) {
      topLine.style.transform = "rotate(45deg) translateY(4px)";
      middleLine.style.opacity = "0";
      bottomLine.style.transform = "rotate(-45deg) translateY(-4px)";
    } else {
      topLine.style.transform = "none";
      middleLine.style.opacity = "1";
      bottomLine.style.transform = "none";
    }
  });

  /******************** About ********************/

  const aboutBtn = document.querySelector("#nav-about");
  const mobileAboutBtn = document.querySelector("#mobile-nav-about");
  const aboutDialog = document.querySelector("#about-dialog");
  const footerAboutBtn = document.querySelector("#footer-about");
  const closeDialog = document.querySelector("#close-dialog");
  const closeDialogBottomBtn = document.querySelector("#close-dialog-btn");

  // Open dialog
  aboutBtn.addEventListener("click", () => {
    aboutDialog.showModal();
  });
  mobileAboutBtn.addEventListener("click", () => {
    aboutDialog.showModal();
    closeMobileMenu(mobileMenu, topLine, middleLine, bottomLine);
  });
  footerAboutBtn.addEventListener("click", () => {
    aboutDialog.showModal();
  });

  // Close dialog (x)
  closeDialog.addEventListener("click", () => {
    aboutDialog.close();
  });

  // Close dialog (close)
  closeDialogBottomBtn.addEventListener("click", () => {
    aboutDialog.close();
  });

  // Close dialog (user clicked outside dialog box)
  aboutDialog.addEventListener("click", (e) => {
    if (e.target === aboutDialog) {
      aboutDialog.close();
    }
  });

  function closeMobileMenu(mobileMenu, topLine, middleLine, bottomLine) {
    mobileMenu.classList.add("hidden");
    topLine.style.transform = "none";
    middleLine.style.opacity = "1";
    bottomLine.style.transform = "none";
  }

  /******************** Toast ********************/

  function showToast(message = "Item added to bag") {
    const toast = document.getElementById("toast");
    toast.querySelector("p").textContent = message;
    toast.classList.remove("translate-x-full");
    setTimeout(() => {
      toast.classList.add("translate-x-full");
    }, 2000);
  }





  
  // Browse view
  initBrowse();
});

// ======================================
// BROWSE VIEW LOGIC
// ======================================

function initBrowse() {
  const genderFilter = document.querySelector("#filter-gender");
  const categoryFilter = document.querySelector("#filter-category");
  const colorFilter = document.querySelector("#filter-color");
  const sortSelect = document.querySelector("#sort");

  genderFilter.addEventListener("change", renderBrowse);
  categoryFilter.addEventListener("change", renderBrowse);
  colorFilter.addEventListener("change", renderBrowse);
  sortSelect.addEventListener("change", renderBrowse);

  renderBrowse();
}

function renderBrowse() {
  const genderFilter = document.querySelector("#filter-gender").value;
  const categoryFilter = document.querySelector("#filter-category").value;
  const colorFilter = document.querySelector("#filter-color").value;
  const sortValue = document.querySelector("#sort").value;

  let items = [...products];

  if (genderFilter) {
    items = items.filter((p) => p.gender === genderFilter);
  }

  if (categoryFilter) {
    items = items.filter((p) => p.category === categoryFilter);
  }

  if (colorFilter) {
    items = items.filter((p) =>
      p.colors.some((c) => c.name.toLowerCase() === colorFilter.toLowerCase())
    );
  }

  if (sortValue === "az") {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "priceLow") {
    items.sort((a, b) => a.price - b.price);
  } else if (sortValue === "priceHigh") {
    items.sort((a, b) => b.price - a.price);
  }

  const results = document.querySelector("#browse-results");
  const empty = document.querySelector("#browse-empty");

  results.innerHTML = "";

  if (items.length === 0) {
    empty.classList.remove("hidden");
    return;
  } else {
    empty.classList.add("hidden");
  }

  items.forEach((p) => {
    const html = `
      <div class="group cursor-pointer browse-product" data-id="${p.id}">
        <div class="aspect-square bg-gray-100 mb-3 overflow-hidden">
          <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <h3 class="text-sm font-light mb-1">${p.name}</h3>
        <p class="text-sm text-gray-600">$${p.price}</p>
      </div>
    `;

    results.innerHTML += html;
  });

  document.querySelectorAll(".browse-product").forEach((card) =>
    card.addEventListener("click", () => {
      loadProductById(card.dataset.id);
    })
  );
}

// ======================================
// PRODUCT VIEW (PHASE 1 BASIC LOADER)
// ======================================

function loadProductById(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  document.querySelector("#product-title").textContent = product.name;
  document.querySelector("#product-price").textContent = `$${product.price}`;
  document.querySelector("#product-description").textContent =
    product.description;
  document.querySelector("#product-material").textContent = product.material;
  document.querySelector("#product-main-image").src = product.image;

  document.querySelectorAll("[data-view]").forEach((btn) => {
    if (btn.dataset.view === "product-view") btn.click();
  });
}



