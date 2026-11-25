
// ======================================
// AQUACARE PROFESSIONAL
// Navigation Menu Functionality
// ======================================


// Get the menu button
const menuToggle = document.getElementById("menuToggle");

// Get the navigation links
const navLinks = document.getElementById("navLinks");


// Open and close mobile navigation menu
if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        // Toggle the active class
        navLinks.classList.toggle("active");

        // Check whether menu is open
        const isExpanded = navLinks.classList.contains("active");

        // Update accessibility attribute
        menuToggle.setAttribute("aria-expanded", isExpanded);

    });


    // Close menu when a navigation link is clicked
    document.querySelectorAll(".nav-links a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");

        });

    });

}
