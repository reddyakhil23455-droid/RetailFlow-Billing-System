// ==========================================================
// SUPERBASKET BILLING
// ==========================================================


// ==========================================================
// USER LOGIN
// ==========================================================

const userData =
    localStorage.getItem("user");


if (!userData) {

    window.location.href =
        "login.html";

}


const user =
    JSON.parse(userData);


// ==========================================================
// USER INFORMATION
// ==========================================================

function loadUserDetails() {

    const username =
        user?.username || "User";

    const role =
        user?.role || "USER";


    const topUser =
        document.getElementById("topUser");

    const topRole =
        document.getElementById("topRole");

    const sideUser =
        document.getElementById("sideUser");

    const sideRole =
        document.getElementById("sideRole");

    const topAvatar =
        document.getElementById("topAvatar");

    const sideAvatar =
        document.getElementById("sideAvatar");


    if (topUser)
        topUser.textContent = username;

    if (topRole)
        topRole.textContent = role;

    if (sideUser)
        sideUser.textContent = username;

    if (sideRole)
        sideRole.textContent = role;


    const letter =
        username
            .charAt(0)
            .toUpperCase();


    if (topAvatar)
        topAvatar.textContent = letter;

    if (sideAvatar)
        sideAvatar.textContent = letter;

}


loadUserDetails();


// ==========================================================
// VARIABLES
// ==========================================================

let products = [];

let cart = [];


// ==========================================================
// DOM
// ==========================================================

const productList =
    document.getElementById(
        "productList"
    );

const productSearch =
    document.getElementById(
        "productSearch"
    );

const productCount =
    document.getElementById(
        "productCount"
    );

const cartBody =
    document.getElementById(
        "cartBody"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );

const subtotalElement =
    document.getElementById(
        "subtotal"
    );

const gstElement =
    document.getElementById(
        "gst"
    );

const grandTotalElement =
    document.getElementById(
        "grandTotal"
    );

const generateBillBtn =
    document.getElementById(
        "generateBillBtn"
    );

const clearCartBtn =
    document.getElementById(
        "clearCartBtn"
    );


// ==========================================================
// LOAD PRODUCTS
// ==========================================================

async function loadProducts() {

    productList.innerHTML = `

        <div class="billing-loading">

            <div class="billing-spinner"></div>

            <span>
                Loading products...
            </span>

        </div>

    `;


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


        productCount.textContent =
            `${products.length} products`;


        displayProducts(
            products
        );

    }

    catch (error) {

        console.error(
            "LOAD PRODUCTS ERROR:",
            error
        );


        productList.innerHTML = `

            <div class="billing-error">

                <div class="billing-error-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load products
                </h3>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    onclick="loadProducts()"
                    class="retry-btn"
                >
                    ↻ Try Again
                </button>

            </div>

        `;

    }

}


// ==========================================================
// DISPLAY PRODUCTS
// ==========================================================

function displayProducts(list) {

    productList.innerHTML = "";


    if (list.length === 0) {

        productList.innerHTML = `

            <div class="billing-no-products">

                <div>
                    🔍
                </div>

                <h3>
                    No products found
                </h3>

                <p>
                    Try another product name or category.
                </p>

            </div>

        `;

        return;

    }


    list.forEach(product => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "billing-product-card";


        const stock =
            Number(
                product.stock || 0
            );


        const existing =
            cart.find(
                item =>
                    Number(item.productId) ===
                    Number(product.id)
            );


        const cartQuantity =
            existing
                ? existing.quantity
                : 0;


        const availableStock =
            stock - cartQuantity;


        let stockClass =
            "stock-good";

        let stockText =
            `${availableStock} available`;


        if (availableStock <= 0) {

            stockClass =
                "stock-out";

            stockText =
                "Out of stock";

        }

        else if (availableStock <= 10) {

            stockClass =
                "stock-low";

            stockText =
                `${availableStock} left`;

        }


        card.innerHTML = `

            <div class="billing-product-top">

                <div class="billing-product-icon">

                    ${getEmoji(
                        product.category
                    )}

                </div>

                <span class="
                    billing-stock-badge
                    ${stockClass}
                ">

                    ${stockText}

                </span>

            </div>


            <div class="billing-product-details">

                <div class="billing-product-category">

                    ${escapeHtml(
                        product.category ||
                        "General"
                    )}

                </div>


                <h3>

                    ${escapeHtml(
                        product.name
                    )}

                </h3>


                <div class="billing-product-bottom">

                    <div>

                        <span class="billing-price-label">
                            Price
                        </span>

                        <strong class="billing-product-price">

                            ₹${Number(
                                product.price || 0
                            ).toFixed(2)}

                        </strong>

                    </div>


                    <span class="billing-gst">

                        GST ${Number(
                            product.gst || 0
                        )}%

                    </span>

                </div>

            </div>


            <button
                class="add-to-cart-btn"
                type="button"
                onclick="addToCart(${product.id})"
                ${availableStock <= 0
                    ? "disabled"
                    : ""}
            >

                <span>
                    ${availableStock <= 0
                        ? "×"
                        : "+"}
                </span>

                ${availableStock <= 0
                    ? "Out of Stock"
                    : "Add to Cart"}

            </button>

        `;


        productList.appendChild(card);

    });

}


// ==========================================================
// GET EMOJI
// ==========================================================

function getEmoji(category) {

    const value =
        String(
            category || ""
        ).toLowerCase();


    if (value.includes("dairy"))
        return "🥛";


    if (value.includes("snack"))
        return "🍪";


    if (value.includes("fruit"))
        return "🍎";


    if (value.includes("vegetable"))
        return "🥦";


    if (
        value.includes("drink") ||
        value.includes("beverage")
    )
        return "🥤";


    if (
        value.includes("grocery") ||
        value.includes("food")
    )
        return "🍚";


    if (value.includes("personal"))
        return "🧴";


    if (value.includes("clean"))
        return "🧹";


    return "📦";

}


// ==========================================================
// ADD TO CART
// ==========================================================

function addToCart(productId) {

    const product =
        products.find(
            p =>
                Number(p.id) ===
                Number(productId)
        );


    if (!product) {

        showBillingToast(
            "Error",
            "Product not found.",
            "error"
        );

        return;

    }


    const stock =
        Number(
            product.stock || 0
        );


    const existing =
        cart.find(
            item =>
                Number(item.productId) ===
                Number(productId)
        );


    if (existing) {

        if (
            existing.quantity >=
            stock
        ) {

            showBillingToast(
                "Stock Limit",
                "You cannot add more than available stock.",
                "error"
            );

            return;

        }


        existing.quantity++;

    }

    else {

        cart.push({

            productId:
                Number(product.id),

            name:
                product.name,

            price:
                Number(product.price || 0),

            gst:
                Number(product.gst || 0),

            quantity: 1

        });

    }


    displayCart();


    displayProducts(
        getFilteredProducts()
    );


    showBillingToast(
        "Added to Cart",
        `${product.name} added successfully.`,
        "success"
    );

}


// ==========================================================
// DISPLAY CART
// ==========================================================

function displayCart() {

    cartBody.innerHTML = "";


    if (cart.length === 0) {

        cartBody.innerHTML = `

            <div class="cart-empty">

                <div class="cart-empty-icon">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Select products from the left
                    to start billing.
                </p>

            </div>

        `;


        updateSummary();

        return;

    }


    cart.forEach(item => {

        const itemTotal =
            item.price *
            item.quantity;


        const div =
            document.createElement(
                "div"
            );


        div.className =
            "cart-item";


        div.innerHTML = `

            <div class="cart-item-main">

                <div class="cart-item-icon">
                    ${getEmoji("")}
                </div>


                <div class="cart-item-info">

                    <strong>
                        ${escapeHtml(
                            item.name
                        )}
                    </strong>

                    <small>
                        ₹${item.price.toFixed(2)}
                        each
                    </small>

                </div>

            </div>


            <div class="cart-item-right">

                <strong class="cart-item-total">

                    ₹${itemTotal.toFixed(2)}

                </strong>


                <div class="quantity-control">

                    <button
                        type="button"
                        onclick="decreaseQuantity(${item.productId})"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        onclick="increaseQuantity(${item.productId})"
                    >
                        +
                    </button>

                </div>


                <button
                    type="button"
                    class="remove-item"
                    onclick="removeFromCart(${item.productId})"
                >
                    Remove
                </button>

            </div>

        `;


        cartBody.appendChild(div);

    });


    updateSummary();

}


// ==========================================================
// INCREASE QUANTITY
// ==========================================================

function increaseQuantity(productId) {

    const item =
        cart.find(
            item =>
                Number(item.productId) ===
                Number(productId)
        );


    const product =
        products.find(
            product =>
                Number(product.id) ===
                Number(productId)
        );


    if (!item || !product)
        return;


    if (
        item.quantity >=
        Number(product.stock)
    ) {

        showBillingToast(
            "Stock Limit",
            "Maximum available stock reached.",
            "error"
        );

        return;

    }


    item.quantity++;


    displayCart();


    displayProducts(
        getFilteredProducts()
    );

}


// ==========================================================
// DECREASE QUANTITY
// ==========================================================

function decreaseQuantity(productId) {

    const item =
        cart.find(
            item =>
                Number(item.productId) ===
                Number(productId)
        );


    if (!item)
        return;


    item.quantity--;


    if (item.quantity <= 0) {

        removeFromCart(
            productId
        );

        return;

    }


    displayCart();


    displayProducts(
        getFilteredProducts()
    );

}


// ==========================================================
// REMOVE
// ==========================================================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                Number(item.productId) !==
                Number(productId)
        );


    displayCart();


    displayProducts(
        getFilteredProducts()
    );

}


// ==========================================================
// SUMMARY
// ==========================================================

function updateSummary() {

    let subtotal = 0;

    let gstAmount = 0;

    let itemCount = 0;


    cart.forEach(item => {

        const itemSubtotal =
            item.price *
            item.quantity;


        const itemGST =
            itemSubtotal *
            (
                item.gst / 100
            );


        subtotal +=
            itemSubtotal;


        gstAmount +=
            itemGST;


        itemCount +=
            item.quantity;

    });


    const grandTotal =
        subtotal +
        gstAmount;


    subtotalElement.textContent =
        subtotal.toFixed(2);


    gstElement.textContent =
        gstAmount.toFixed(2);


    grandTotalElement.textContent =
        grandTotal.toFixed(2);


    cartCount.textContent =
        itemCount +
        (
            itemCount === 1
                ? " item"
                : " items"
        );


    generateBillBtn.disabled =
        cart.length === 0;

}


// ==========================================================
// SEARCH
// ==========================================================

productSearch.addEventListener(
    "input",
    function () {

        displayProducts(
            getFilteredProducts()
        );

    }
);


function getFilteredProducts() {

    const text =
        productSearch.value
            .toLowerCase()
            .trim();


    return products.filter(
        product => {

            const name =
                String(
                    product.name || ""
                ).toLowerCase();


            const category =
                String(
                    product.category || ""
                ).toLowerCase();


            return (
                name.includes(text) ||
                category.includes(text)
            );

        }
    );

}


// ==========================================================
// GENERATE BILL
// ==========================================================

async function generateBill() {

    if (cart.length === 0) {

        showBillingToast(
            "Empty Cart",
            "Please add at least one product.",
            "error"
        );

        return;

    }


    const button =
        generateBillBtn;


    button.disabled = true;

    button.innerHTML =
        `<span class="billing-spinner-small"></span>
         Generating...`;


    try {

        const billData = {

            userId:
                user.id,

            items:

                cart.map(
                    item => ({

                        productId:
                            item.productId,

                        quantity:
                            item.quantity

                    })
                )

        };


        const response =
            await fetch(
                "/api/bills",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            billData
                        )

                }
            );


        const result =
            await response.text();


        if (!response.ok) {

            throw new Error(
                result ||
                "Failed to generate bill"
            );

        }


        showBillingToast(
            "Bill Generated",
            "Customer bill created successfully.",
            "success"
        );


        cart = [];


        displayCart();


        await loadProducts();

    }

    catch (error) {

        console.error(
            "GENERATE BILL ERROR:",
            error
        );


        showBillingToast(
            "Bill Failed",
            error.message ||
            "Unable to generate bill.",
            "error"
        );

    }

    finally {

        button.disabled =
            cart.length === 0;


        button.innerHTML =
            `<span>✓</span>
             Generate Bill`;

    }

}


// ==========================================================
// CLEAR CART
// ==========================================================

function clearCart() {

    if (cart.length === 0)
        return;


    const confirmed =
        confirm(
            "Clear all items from the cart?"
        );


    if (!confirmed)
        return;


    cart = [];


    displayCart();


    displayProducts(
        getFilteredProducts()
    );


    showBillingToast(
        "Cart Cleared",
        "All items were removed from the bill.",
        "success"
    );

}


// ==========================================================
// CLEAR BUTTON
// ==========================================================

clearCartBtn.addEventListener(
    "click",
    clearCart
);


// ==========================================================
// LOGOUT
// ==========================================================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "login.html";

        }
    );


// ==========================================================
// MOBILE MENU
// ==========================================================

document
    .getElementById("mobileMenuBtn")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("sidebar")
                .classList.toggle(
                    "open"
                );

        }
    );


// ==========================================================
// TOAST
// ==========================================================

function showBillingToast(
    title,
    message,
    type
) {

    const toast =
        document.getElementById(
            "billingToast"
        );


    const icon =
        document.getElementById(
            "billingToastIcon"
        );


    document.getElementById(
        "billingToastTitle"
    ).textContent =
        title;


    document.getElementById(
        "billingToastMessage"
    ).textContent =
        message;


    toast.classList.remove(
        "error"
    );


    if (type === "error") {

        icon.textContent =
            "⚠";

        toast.classList.add(
            "error"
        );

    }

    else {

        icon.textContent =
            "✓";

    }


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


// ==========================================================
// HTML SAFETY
// ==========================================================

function escapeHtml(value) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================================
// START
// ==========================================================

loadProducts();

displayCart();