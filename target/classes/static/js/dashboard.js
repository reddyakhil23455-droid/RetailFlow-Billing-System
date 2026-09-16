/* ============================================================
   SUPERBASKET
   DASHBOARD JAVASCRIPT
   ============================================================ */


/* ============================================================
   USER
   ============================================================ */

const user =
    JSON.parse(
        localStorage.getItem("user")
    );


/* ============================================================
   LOGIN CHECK
   ============================================================ */

if (!user) {

    window.location.href =
        "login.html";

}


/* ============================================================
   USER INFORMATION
   ============================================================ */

const username =
    user?.username || "User";


const role =
    user?.role || "USER";


/* ============================================================
   TOP USER
   ============================================================ */

const topUser =
    document.getElementById("topUser");


const topRole =
    document.getElementById("topRole");


const sideUser =
    document.getElementById("sideUser");


const sideRole =
    document.getElementById("sideRole");


if (topUser) {

    topUser.innerText =
        username;

}


if (topRole) {

    topRole.innerText =
        role;

}


if (sideUser) {

    sideUser.innerText =
        username;

}


if (sideRole) {

    sideRole.innerText =
        role;

}


/* ============================================================
   USER AVATAR
   ============================================================ */

const avatar =
    document.querySelector(
        ".user-avatar"
    );


if (avatar && username) {

    avatar.innerText =
        username
            .charAt(0)
            .toUpperCase();

}


/* ============================================================
   GREETING
   ============================================================ */

function setGreeting() {

    const hour =
        new Date().getHours();


    let greeting;


    if (hour < 12) {

        greeting =
            "Good morning";

    }

    else if (hour < 17) {

        greeting =
            "Good afternoon";

    }

    else {

        greeting =
            "Good evening";

    }


    const welcome =
        document.getElementById(
            "welcomeMessage"
        );


    if (welcome) {

        welcome.innerText =
            `${greeting}, ${username} 👋`;

    }

}


setGreeting();


/* ============================================================
   PRODUCTS
   ============================================================ */

let products = [];


/* ============================================================
   LOAD PRODUCTS
   ============================================================ */

async function loadDashboard() {

    try {

        const response =
            await fetch(
                "/api/products"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load products"
            );

        }


        products =
            await response.json();


        updateStatistics();

        displayRecentProducts();

        displayLowStock();

    }

    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        showProductError();

    }

}


/* ============================================================
   UPDATE STATISTICS
   ============================================================ */

function updateStatistics() {


    /* TOTAL PRODUCTS */

    const totalProducts =
        products.length;


    /* TOTAL STOCK */

    const totalStock =
        products.reduce(

            (sum, product) =>

                sum +
                Number(
                    product.stock || 0
                ),

            0

        );


    /* LOW STOCK */

    const lowStockProducts =
        products.filter(

            product =>

                Number(
                    product.stock || 0
                ) <= 10

        );


    const lowStock =
        lowStockProducts.length;


    /* INVENTORY VALUE */

    const inventoryValue =
        products.reduce(

            (sum, product) =>

                sum +

                (
                    Number(
                        product.price || 0
                    )

                    *

                    Number(
                        product.stock || 0
                    )
                ),

            0

        );


    /* DISPLAY */

    const totalProductsElement =
        document.getElementById(
            "totalProducts"
        );


    const totalStockElement =
        document.getElementById(
            "totalStock"
        );


    const lowStockElement =
        document.getElementById(
            "lowStock"
        );


    const inventoryValueElement =
        document.getElementById(
            "inventoryValue"
        );


    if (totalProductsElement) {

        totalProductsElement.innerText =
            totalProducts;

    }


    if (totalStockElement) {

        totalStockElement.innerText =
            totalStock.toLocaleString(
                "en-IN"
            );

    }


    if (lowStockElement) {

        lowStockElement.innerText =
            lowStock;

    }


    if (inventoryValueElement) {

        inventoryValueElement.innerText =
            "₹" +

            inventoryValue.toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 0
                }
            );

    }

}


/* ============================================================
   DISPLAY RECENT PRODUCTS
   ============================================================ */

function displayRecentProducts() {


    const table =
        document.getElementById(
            "productTable"
        );


    if (!table) {

        return;

    }


    table.innerHTML = "";


    /* SHOW FIRST 6 PRODUCTS */

    const recentProducts =
        products.slice(
            0,
            6
        );


    if (
        recentProducts.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-cell"
                >

                    No products found.

                </td>

            </tr>

        `;

        return;

    }


    recentProducts.forEach(
        product => {

            const row =
                document.createElement(
                    "tr"
                );


            /* STOCK CLASS */

            let stockClass =
                "stock-good";


            if (
                Number(
                    product.stock
                ) <= 10
            ) {

                stockClass =
                    "stock-danger";

            }

            else if (
                Number(
                    product.stock
                ) <= 30
            ) {

                stockClass =
                    "stock-warning";

            }


            row.innerHTML = `

                <td>

                    <div
                        class="dashboard-product"
                    >

                        <div
                            class="dashboard-product-icon"
                        >
                            🛒
                        </div>


                        <div>

                            <strong>
                                ${product.name}
                            </strong>

                            <small>
                                Product #${product.id}
                            </small>

                        </div>

                    </div>

                </td>


                <td>

                    <span
                        class="category-badge"
                    >
                        ${product.category}
                    </span>

                </td>


                <td>

                    <strong
                        class="dashboard-price"
                    >

                        ₹${Number(
                            product.price || 0
                        ).toFixed(2)}

                    </strong>

                </td>


                <td>

                    <span
                        class="stock-status ${stockClass}"
                    >

                        ${Number(
                            product.stock || 0
                        )}

                        units

                    </span>

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}


/* ============================================================
   DISPLAY LOW STOCK
   ============================================================ */

function displayLowStock() {


    const container =
        document.getElementById(
            "lowStockContainer"
        );


    if (!container) {

        return;

    }


    const lowStockProducts =
        products.filter(

            product =>

                Number(
                    product.stock || 0
                ) <= 10

        );


    /* NO LOW STOCK */

    if (
        lowStockProducts.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-stock">

                <div>
                    ✓
                </div>

                <strong>
                    Inventory looks healthy
                </strong>

                <p>
                    No products require immediate attention.
                </p>

            </div>

        `;

        return;

    }


    /* LOW STOCK EXISTS */

    container.innerHTML = "";


    lowStockProducts.forEach(
        product => {


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "low-stock-item";


            item.innerHTML = `

                <div
                    class="low-stock-icon"
                >
                    ⚠️
                </div>


                <div
                    class="low-stock-info"
                >

                    <strong>
                        ${product.name}
                    </strong>

                    <small>
                        ${product.category}
                    </small>

                </div>


                <div
                    class="low-stock-count"
                >

                    <strong>
                        ${product.stock}
                    </strong>

                    <small>
                        units left
                    </small>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* ============================================================
   PRODUCT ERROR
   ============================================================ */

function showProductError() {


    const table =
        document.getElementById(
            "productTable"
        );


    if (!table) {

        return;

    }


    table.innerHTML = `

        <tr>

            <td
                colspan="4"
                class="empty-cell"
            >

                Unable to load products.

                <br>

                Please check your backend.

            </td>

        </tr>

    `;

}


/* ============================================================
   LOGOUT
   ============================================================ */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {


            localStorage.removeItem(
                "user"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* ============================================================
   MOBILE SIDEBAR
   ============================================================ */

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );


const sidebar =
    document.getElementById(
        "sidebar"
    );


if (
    mobileMenuBtn &&
    sidebar
) {

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


/* ============================================================
   CLOSE SIDEBAR AFTER NAVIGATION
   ============================================================ */

if (sidebar) {

    const sidebarLinks =
        sidebar.querySelectorAll(
            "a"
        );


    sidebarLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                function () {

                    sidebar.classList.remove(
                        "open"
                    );

                }
            );

        }
    );

}


/* ============================================================
   START DASHBOARD
   ============================================================ */

loadDashboard();