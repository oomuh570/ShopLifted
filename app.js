document.addEventListener("DOMContentLoaded", () => {

    let currentView = document.querySelector("#view-home");

    const navBtn = document.querySelectorAll("nav button");

    navBtn.forEach(button => {
        button.addEventListener("click", () => {
            const view = button.dataset.view;
            const newView = document.querySelector("#" + view);

            if (newView && (newView !== currentView)) {
                currentView.classList.add("hidden");
                newView.classList.remove("hidden");

                currentView = newView;
            }
        });
    });
    



});

