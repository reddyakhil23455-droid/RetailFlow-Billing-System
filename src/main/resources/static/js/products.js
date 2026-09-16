/* ============================================================
   SUPERBASKET PRODUCTS
   ============================================================ */

let products = [];

let editingProductId = null;


/* ============================================================
   USER
   ============================================================ */

const user =
    JSON.parse(
        localStorage.getItem("user")
    );


if (!user) {

    window.location.href =
        "login.html";

}


/* ============================================================
   DOM
   ============================================================ */

const addProductBtn =
    document.getElementById(
        "addProductBtn"
    );

const productModalOverlay =
    document.getElementById(
        "productModalOverlay"
    );

const closeProductModalBtn =
    document.getElementById(
        "closeProductModalBtn"
    );

const cancelProductBtn =
    document.getElementById(
        "cancelProductBtn"
    );

const productForm =
    document.getElementById(
        "productForm"
    );

const productTable =
    document.getElementById(
        "productTable"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );

const refreshProducts =
    document.getElementById(
        "refreshProducts"
    );


/* ============================================================
   USER
   ============================================================ */

function loadUserDetails() {

    const username =
        user?.username || "User";

    const role =
        user?.role || "USER";


    document.getElementById(
        "topUser"
    ).textContent =
        username;


    document.getElementById(
        "topRole"
    ).textContent =
        role;


    document.getElementById(
        "sideUser"
    ).textContent =
        username;


    document.getElementById(
        "sideRole"
    ).textContent =
        role;


    const letter =
        username
            .charAt(0)
            .toUpperCase();


    document.getElementById(
        "topAvatar"
    ).textContent =
        letter;


    document.getElementById(
        "sideAvatar"
    ).textContent =
        letter;

}


loadUserDetails();


/* ============================================================
   LOAD PRODUCTS
   ============================================================ */

async function loadProducts() {

    productTable.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="table-loading"
            >

                <div class="loading-box">

                    <div class="spinner"></div>

                    Loading products...

                </div>

            </td>

        </tr>

    `;


    try {

        const response =
            await fetch(
                "/api/products",
                {
                    method: "GET"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }


        products =
            await response.json();


        updateStatistics();

        buildCategoryFilter();

        renderProducts();

    }

    catch (error) {

        console.error(
            "LOAD PRODUCTS ERROR:",
            error
        );


        productTable.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="table-loading"
                >

                    <div class="table-error">

                        <div>⚠️</div>

                        <strong>
                            Unable to load products
                        </strong>

                        <small>
                            ${escapeHtml(
                                error.message
                            )}
                        </small>

                    </div>

                </td>

            </tr>

        `;

    }

}


/* ============================================================
   STATISTICS
   ============================================================ */

function updateStatistics() {

    const total =
        products.length;


    const stock =
        products.reduce(
            (sum, product) =>
                sum +
                Number(
                    product.stock || 0
                ),
            0
        );


    const low =
        products.filter(
            product =>
                Number(
                    product.stock || 0
                ) <= 10
        ).length;


    const value =
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


    document.getElementById(
        "totalProducts"
    ).textContent =
        total;


    document.getElementById(
        "totalStock"
    ).textContent =
        stock.toLocaleString(
            "en-IN"
        );


    document.getElementById(
        "lowStock"
    ).textContent =
        low;


    document.getElementById(
        "inventoryValue"
    ).textContent =
        "₹" +
        value.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 0
            }
        );


    document.getElementById(
        "productCount"
    ).textContent =
        total;

}


/* ============================================================
   CATEGORY FILTER
   ============================================================ */

function buildCategoryFilter() {

    const current =
        categoryFilter.value;


    const categories =
        [
            ...new Set(
                products
                    .map(
                        product =>
                            product.category
                    )
                    .filter(Boolean)
            )
        ];


    categories.sort();


    categoryFilter.innerHTML = `

        <option value="all">
            All Categories
        </option>

    `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category;


            option.textContent =
                category;


            categoryFilter.appendChild(
                option
            );

        }
    );


    if (
        categories.includes(
            current
        )
    ) {

        categoryFilter.value =
            current;

    }

}


/* ============================================================
   FILTER
   ============================================================ */

function getFilteredProducts() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const category =
        categoryFilter.value;


    return products.filter(
        product => {

            const name =
                String(
                    product.name || ""
                ).toLowerCase();


            const productCategory =
                String(
                    product.category || ""
                ).toLowerCase();


            const searchMatch =
                name.includes(search)
                ||
                productCategory.includes(search);


            const categoryMatch =
                category === "all"
                ||
                product.category === category;


            return (
                searchMatch
                &&
                categoryMatch
            );

        }
    );

}


/* ============================================================
   RENDER
   ============================================================ */

function renderProducts() {

    const filtered =
        getFilteredProducts();


    productTable.innerHTML =
        "";


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (
        filtered.length === 0
    ) {

        emptyState.style.display =
            "flex";

    }

    else {

        emptyState.style.display =
            "none";

    }


    filtered.forEach(
        product => {

            const stock =
                Number(
                    product.stock || 0
                );


            let stockClass =
                "stock-good";


            let status =
                "In Stock";


            if (stock === 0) {

                stockClass =
                    "stock-danger";

                status =
                    "Out of Stock";

            }

            else if (stock <= 10) {

                stockClass =
                    "stock-danger";

                status =
                    "Low Stock";

            }

            else if (stock <= 30) {

                stockClass =
                    "stock-warning";

                status =
                    "Limited";

            }


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <span class="product-id">
                        #${product.id}
                    </span>

                </td>


                <td>

                    <div class="product-name-cell">

                        <div class="product-avatar">
                            ${getEmoji(
                                product.category
                            )}
                        </div>

                        <div>

                            <strong>
                                ${escapeHtml(
                                    product.name
                                )}
                            </strong>

                            <small>
                                Product ID ${product.id}
                            </small>

                        </div>

                    </div>

                </td>


                <td>

                    <span class="category-pill">

                        ${escapeHtml(
                            product.category ||
                            "General"
                        )}

                    </span>

                </td>


                <td>

                    <strong class="product-price">

                        ₹${Number(
                            product.price || 0
                        ).toFixed(2)}

                    </strong>

                </td>


                <td>

                    <span
                        class="stock-number ${stockClass}"
                    >
                        ${stock}
                    </span>

                    <span class="stock-unit">
                        units
                    </span>

                </td>


                <td>

                    <span class="gst-badge">

                        ${Number(
                            product.gst || 0
                        )}%

                    </span>

                </td>


                <td>

                    <span
                        class="status-badge ${stockClass}"
                    >

                        <span class="status-dot"></span>

                        ${status}

                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            type="button"
                            class="action-btn edit"
                            data-action="edit"
                            data-id="${product.id}"
                            title="Edit"
                        >
                            ✏️
                        </button>


                        <button
                            type="button"
                            class="action-btn delete"
                            data-action="delete"
                            data-id="${product.id}"
                            title="Delete"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            productTable.appendChild(
                row
            );

        }
    );


    document.getElementById(
        "showingText"
    ).textContent =

        `Showing ${filtered.length} of ${products.length} products`;

}


/* ============================================================
   EMOJI
   ============================================================ */

function getEmoji(category) {

    const value =
        String(
            category || ""
        ).toLowerCase();


    if (
        value.includes("dairy")
    )
        return "🥛";


    if (
        value.includes("snack")
    )
        return "🍪";


    if (
        value.includes("fruit")
    )
        return "🍎";


    if (
        value.includes("vegetable")
    )
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


    return "📦";

}


/* ============================================================
   OPEN ADD MODAL
   ============================================================ */

addProductBtn.addEventListener(
    "click",
    function () {

        editingProductId =
            null;


        document.getElementById(
            "modalTitle"
        ).textContent =
            "Add Product";


        productForm.reset();


        document.getElementById(
            "productId"
        ).value =
            "";


        document.getElementById(
            "productMessage"
        ).textContent =
            "";


        productModalOverlay.classList.add(
            "show"
        );


        setTimeout(
            () => {

                document.getElementById(
                    "name"
                ).focus();

            },
            100
        );

    }
);


/* ============================================================
   CLOSE MODAL
   ============================================================ */

function closeProductModal() {

    productModalOverlay.classList.remove(
        "show"
    );

    productForm.reset();

    editingProductId =
        null;

    document.getElementById(
        "productMessage"
    ).textContent =
        "";

}


closeProductModalBtn.addEventListener(
    "click",
    closeProductModal
);


cancelProductBtn.addEventListener(
    "click",
    closeProductModal
);


productModalOverlay.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            productModalOverlay
        ) {

            closeProductModal();

        }

    }
);


/* ============================================================
   ESC
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
            &&
            productModalOverlay.classList.contains(
                "show"
            )
        ) {

            closeProductModal();

        }

    }
);


/* ============================================================
   SAVE PRODUCT
   ============================================================ */

productForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "name"
            ).value.trim();


        const category =
            document.getElementById(
                "category"
            ).value.trim();


        const price =
            Number(
                document.getElementById(
                    "price"
                ).value
            );


        const stock =
            Number(
                document.getElementById(
                    "stock"
                ).value
            );


        const gst =
            Number(
                document.getElementById(
                    "gst"
                ).value
            );


        const message =
            document.getElementById(
                "productMessage"
            );


        if (!name) {

            message.textContent =
                "Please enter product name.";

            return;

        }


        if (!category) {

            message.textContent =
                "Please enter category.";

            return;

        }


        if (
            Number.isNaN(price)
            ||
            price < 0
        ) {

            message.textContent =
                "Please enter a valid price.";

            return;

        }


        if (
            Number.isNaN(stock)
            ||
            stock < 0
        ) {

            message.textContent =
                "Please enter valid stock.";

            return;

        }


        const product = {

            name:
                name,

            category:
                category,

            price:
                price,

            stock:
                stock,

            gst:
                gst

        };


        const saveButton =
            document.getElementById(
                "saveProductBtn"
            );


        saveButton.disabled =
            true;


        saveButton.textContent =
            "Saving...";


        try {

            let response;


            if (
                editingProductId !== null
            ) {

                response =
                    await fetch(
                        `/api/products/${editingProductId}`,
                        {

                            method:
                                "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    product
                                )

                        }
                    );

            }

            else {

                response =
                    await fetch(
                        "/api/products",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    product
                                )

                        }
                    );

            }


            const responseText =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    `HTTP ${response.status}`
                );

            }


            closeProductModal();


            await loadProducts();


            showToast(
                "Success",
                editingProductId !== null
                    ? "Product updated successfully."
                    : "Product added successfully.",
                "success"
            );

        }

        catch (error) {

            console.error(
                "SAVE PRODUCT ERROR:",
                error
            );


            message.textContent =
                error.message ||
                "Unable to save product.";

        }

        finally {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "✓ Save Product";

        }

    }
);


/* ============================================================
   EDIT / DELETE
   ============================================================ */

productTable.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button) {
            return;
        }


        const id =
            Number(
                button.dataset.id
            );


        const action =
            button.dataset.action;


        if (
            action === "edit"
        ) {

            openEditProduct(
                id
            );

        }


        if (
            action === "delete"
        ) {

            deleteProduct(
                id
            );

        }

    }
);


/* ============================================================
   EDIT
   ============================================================ */

function openEditProduct(id) {

    const product =
        products.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!product) {
        return;
    }


    editingProductId =
        id;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Product";


    document.getElementById(
        "productId"
    ).value =
        product.id;


    document.getElementById(
        "name"
    ).value =
        product.name || "";


    document.getElementById(
        "category"
    ).value =
        product.category || "";


    document.getElementById(
        "price"
    ).value =
        product.price || 0;


    document.getElementById(
        "stock"
    ).value =
        product.stock || 0;


    document.getElementById(
        "gst"
    ).value =
        product.gst || 0;


    document.getElementById(
        "productMessage"
    ).textContent =
        "";


    productModalOverlay.classList.add(
        "show"
    );

}


/* ============================================================
   DELETE
   ============================================================ */

async function deleteProduct(id) {

    const product =
        products.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!product) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${product.name}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/products/${id}`,
                {
                    method:
                        "DELETE"
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text ||
                "Delete failed"
            );

        }


        await loadProducts();


        showToast(
            "Deleted",
            "Product deleted successfully.",
            "success"
        );

    }

    catch (error) {

        console.error(
            error
        );


        showToast(
            "Error",
            error.message,
            "error"
        );

    }

}


/* ============================================================
   SEARCH
   ============================================================ */

searchInput.addEventListener(
    "input",
    renderProducts
);


categoryFilter.addEventListener(
    "change",
    renderProducts
);


refreshProducts.addEventListener(
    "click",
    loadProducts
);


/* ============================================================
   LOGOUT
   ============================================================ */

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "login.html";

    }
);


/* ============================================================
   MOBILE
   ============================================================ */

document.getElementById(
    "mobileMenuBtn"
).addEventListener(
    "click",
    function () {

        document
            .getElementById("sidebar")
            .classList.toggle(
                "open"
            );

    }
);


/* ============================================================
   ESCAPE HTML
   ============================================================ */

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


/* ============================================================
   TOAST
   ============================================================ */

function showToast(
    title,
    message,
    type
) {

    const toast =
        document.getElementById(
            "toast"
        );


    document.getElementById(
        "toastTitle"
    ).textContent =
        title;


    document.getElementById(
        "toastMessage"
    ).textContent =
        message;


    const icon =
        document.getElementById(
            "toastIcon"
        );


    if (
        type === "error"
    ) {

        icon.textContent =
            "⚠";

        toast.classList.add(
            "error"
        );

    }

    else {

        icon.textContent =
            "✓";

        toast.classList.remove(
            "error"
        );

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


/* ============================================================
   START
   ============================================================ */

loadProducts();