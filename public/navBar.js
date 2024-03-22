//Dallin Jackson 2/24/24
// kayliescreations.biz

/**
 * if user is logged in, then the navbar has the shop and ticket links, and the login link is removed
 * if user is not, then the navbar has the login link, and the shop is replaced with a gallery page that
 * generates the shop cards without the buy button.
 */

async function loadNavBar() {
    
    const response = await fetch('/api/validate');

    let header = document.getElementsByTagName("header");
    // If the user is logged in (status code 204)
    if (response.status === 204) {
        let navBar = document.createElement("nav");
        navBar.className = "navbar sticky-top navbar-expand-xl navbar-light bg-light ";

        let container = document.createElement("div");
        container.className = "container-fluid";

        let brand = document.createElement("a");
        brand.className = "navbar-brand";
        brand.href = "index.html";
        brand.style = "font-family: 'Goblin One', cursive; color: #1b4965;";
        brand.style.fontSize = "1.2em";
        brand.textContent = "Kaylie's Creations";

        let button = document.createElement("button");
        button.className = "navbar-toggler";
        button.type = "button";
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", "#navbarSupportedContent");
        button.setAttribute("aria-controls", "navbarSupportedContent");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Toggle navigation");

        let span = document.createElement("span");
        span.className = "navbar-toggler-icon";
        button.appendChild(span);

        let div = document.createElement("div");
        div.className = "collapse navbar-collapse";
        div.id = "navbarSupportedContent";

        let ul = document.createElement("ul");
        ul.className = "navbar-nav me-auto mb-2 mb-lg-0";

        let home = document.createElement("li");
        home.className = "nav-item";
        let homeLink = document.createElement("a");
        homeLink.className = "nav-link active";
        homeLink.href = "index.html";
        homeLink.textContent = "Home";
        home.appendChild(homeLink);
        ul.appendChild(home);

        let shop = document.createElement("li");
        shop.className = "nav-item";
        let shopLink = document.createElement("a");
        shopLink.className = "nav-link";
        shopLink.href = "shop.html";
        shopLink.textContent = "Shop";
        shop.appendChild(shopLink);
        ul.appendChild(shop);

        let ticket = document.createElement("li");
        ticket.className = "nav-item";
        let ticketLink = document.createElement("a");
        ticketLink.className = "nav-link";
        ticketLink.href = "ticketpage.html";
        ticketLink.textContent = "Orders";
        ticket.appendChild(ticketLink);
        ul.appendChild(ticket);

        // let status = document.createElement("li");
        // status.className = "nav-item";
        // let statusLink = document.createElement("a");
        // statusLink.className = "nav-link";
        // statusLink.href = "orderstatus.html";
        // statusLink.textContent = "Status";
        // status.appendChild(statusLink);
        // ul.appendChild(status);

        let about = document.createElement("li");
        about.className = "nav-item";
        let aboutLink = document.createElement("a");
        aboutLink.className = "nav-link";
        aboutLink.href = "about.html";
        aboutLink.textContent = "About";
        about.appendChild(aboutLink);
        ul.appendChild(about);

        let logout = document.createElement("li");
        logout.className = "nav-item";
        let logoutLink = document.createElement("a");
        logoutLink.className = "nav-link";
        logoutLink.href = "logout.html";
        logoutLink.textContent = "Logout";
        logout.appendChild(logoutLink);
        ul.appendChild(logout);

        let admin = document.createElement("li");
        let adminLink = document.createElement("a");

        const response = await fetch(`/api/secureUser`);
        const user = await response.json();

        if (user.isAdmin) {
            admin.className = "nav-item";
            adminLink.className = "nav-link";
            adminLink.href = "kayliesPage.html";
            adminLink.textContent = "Admin";
            adminLink.style = "color: darkred;";
            admin.appendChild(adminLink);
            ul.appendChild(admin);
        }

        let name = document.createElement("li");
        name.className = "nav-item";
        let nameLink = document.createElement("a");
        nameLink.className = "nav-link";
        nameLink.href = "userpage.html";
        let personProfile = "🧶";
        nameLink.textContent = personProfile  + user["firstName"];
        name.appendChild(nameLink);
        ul.appendChild(name);

        div.appendChild(ul);
        container.appendChild(brand);
        container.appendChild(button);
        container.appendChild(div);
        navBar.appendChild(container);
        header[0].appendChild(navBar);

        let navLinks = [homeLink, aboutLink, shopLink, ticketLink, logoutLink, adminLink];
        let currentUrl = window.location.href;
        for (let link of navLinks) {
            // If the href of the nav link matches the current URL
            if (link.href === currentUrl) {
                // Add the "active" class to the nav link
                link.className = "nav-link active";
                

            }
        }

    } else { // If the user is not logged in

        let navBar = document.createElement("nav");
        navBar.className = "navbar sticky-top navbar-expand-lg navbar-light bg-light ";

        let container = document.createElement("div");
        container.className = "container-fluid";

        let brand = document.createElement("a");
        brand.className = "navbar-brand";
        brand.href = "index.html";
        brand.style = "font-family: 'Goblin One', cursive; color: #1b4965;";
        brand.style.fontSize = "1.2em";
        brand.textContent = "Kaylie's Creations";

        let button = document.createElement("button");
        button.className = "navbar-toggler";
        button.type = "button";
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", "#navbarSupportedContent");
        button.setAttribute("aria-controls", "navbarSupportedContent");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Toggle navigation");

        let span = document.createElement("span");
        span.className = "navbar-toggler-icon";
        button.appendChild(span);

        let div = document.createElement("div");
        div.className = "collapse navbar-collapse";
        div.id = "navbarSupportedContent";

        let ul = document.createElement("ul");
        ul.className = "navbar-nav me-auto mb-2 mb-lg-0";

        let home = document.createElement("li");
        home.className = "nav-item";
        let homeLink = document.createElement("a");
        homeLink.className = "nav-link";
        homeLink.href = "index.html";
        homeLink.textContent = "Home";
        home.appendChild(homeLink);
        ul.appendChild(home);

        let gallery = document.createElement("li");
        gallery.className = "nav-item";
        let galleryLink = document.createElement("a");
        galleryLink.className = "nav-link";
        galleryLink.href = "shop.html";
        galleryLink.textContent = "Gallery";
        gallery.appendChild(galleryLink);
        ul.appendChild(gallery);

        let about = document.createElement("li");
        about.className = "nav-item";
        let aboutLink = document.createElement("a");
        aboutLink.className = "nav-link";
        aboutLink.href = "about.html";
        aboutLink.textContent = "About";
        about.appendChild(aboutLink);
        ul.appendChild(about);

        let login = document.createElement("li");
        login.className = "nav-item";
        let loginLink = document.createElement("a");
        loginLink.className = "nav-link";
        loginLink.href = "login.html";
        loginLink.textContent = "Login";
        login.appendChild(loginLink);
        ul.appendChild(login);

        div.appendChild(ul);
        container.appendChild(brand);
        container.appendChild(button);
        container.appendChild(div);
        navBar.appendChild(container);
        header[0].appendChild(navBar);

        // Create an array of all nav links
        let navLinks = [homeLink, aboutLink, galleryLink, loginLink];

        // Get the current URL
        let currentUrl = window.location.href;

        // Loop through the nav links
        for (let link of navLinks) {
            // If the href of the nav link matches the current URL
            if (link.href === currentUrl) {
                // Add the "active" class to the nav link
                link.className = "nav-link active";
            
            }
        }
        
    }
    

}

loadNavBar();