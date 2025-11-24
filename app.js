// ======================================
// GLOBAL PRODUCT DATA (PHASE 1 SUBSET)
// ======================================



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



  /*const url = https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json/

  fetch(url);




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



