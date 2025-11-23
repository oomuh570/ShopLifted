document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu elements
    const menuToggle = document.querySelector("#mobile-menu-toggle");
    const mobileMenu = document.querySelector("#mobile-menu");
    const topLine = document.querySelector(".top-line");
    const middleLine = document.querySelector(".middle-line");
    const bottomLine = document.querySelector(".bottom-line");

    // Navigation system
    let currentView = document.querySelector("#home-view");
    const navBtns = document.querySelectorAll("[data-view]");
    
    navBtns.forEach(button => {
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


});

function closeMobileMenu(mobileMenu, topLine, middleLine, bottomLine) {
    mobileMenu.classList.add("hidden");
    topLine.style.transform = "none";
    middleLine.style.opacity = "1";
    bottomLine.style.transform = "none";
}