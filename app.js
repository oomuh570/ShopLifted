let allProducts = [];
let filteredProducts = [];
let activeFilters = {
    gender: "",
    category: "",
    color: "",
};

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
    
    navBtns.forEach(button => {
        button.addEventListener("click", () => {
            const view = button.dataset.view;
            const newView = document.querySelector("#" + view);

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

    /******************** Browse ********************/

    const url = "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";

    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            
        })
        .catch(err => console.error("Fetch error:", err));

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
