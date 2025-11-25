let allProducts = [];
let filteredProducts = [];
let activeFilters = {
    gender: "",
    category: "",
    color: "",
};
let bagCount = 0;

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

    //document.querySelector("#loader").style.display = "block";
    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            //document.querySelector("#loader").style.display = "none";
            allProducts = data;
            displayProducts(data);
        })
        .catch(err => {
            //document.querySelector("#loader").style.display = "none";
            console.error("Fetch error:", err)
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

});

function closeMobileMenu(mobileMenu, topLine, middleLine, bottomLine) {
    mobileMenu.classList.add("hidden");
    topLine.style.transform = "none";
    middleLine.style.opacity = "1";
    bottomLine.style.transform = "none";
}

// Displays all the products in the browse view
function displayProducts(products){
    const resultsGrid = document.querySelector('#browse-results');
    const emptyMessage = document.querySelector('#browse-empty');

    // Clear previous results
    resultsGrid.innerHTML = "";

    if (products.length === 0) {
        emptyMessage.classList.remove('hidden');
        return;
    }

    emptyMessage.classList.add('hidden');
    
    products.forEach(product => {
        // Product card container
        const card = document.createElement("div");
        card.classList.add("group", "cursor-pointer");
        card.dataset.productId = product.id;

        // Placeholder for the image
        const imageDiv = document.createElement("div");
        imageDiv.classList.add("aspect-square", "bg-gray-100", "mb-3", "overflow-hidden", "flex", "items-center", "justify-center");
        const primaryColor = product.color[0];
        imageDiv.style.backgroundColor = primaryColor.hex + '20';

        const initial = document.createElement("span");
        initial.classList.add("text-6xl", "text-gray-400");
        initial.textContent = product.name.charAt(0);
        imageDiv.appendChild(initial);

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
        price.textContent = '$' + product.price.toFixed(2);

        // Add to bag button
        const bagBtn = document.createElement("button");
        bagBtn.classList.add("w-full", "px-4", "py-2", "bg-black", "text-white", "text-xs", "uppercase", "tracking-wider", "hover:bg-gray-800", "transition-colors", "mt-4");
        bagBtn.textContent = "Add to Bag";
        //bagBtn.dataset.productId = product.id;

        // Switches to bag view
        bagBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            showToast();
            updateBagCount();
        });

        infoDiv.appendChild(name);
        infoDiv.appendChild(category);
        infoDiv.appendChild(price);
        infoDiv.appendChild(bagBtn);

        card.appendChild(imageDiv);
        card.appendChild(infoDiv);

        resultsGrid.appendChild(card);
    });
}

function showToast() {
    const toast = document.querySelector("#toast");
    
    toast.classList.remove("translate-x-full");

    setTimeout(() => {
        toast.classList.add("translate-x-full");
    }, 3000);
}

function updateBagCount() {
    bagCount++;
    document.querySelector("#bag-count").textContent = `(${bagCount})`;
}
