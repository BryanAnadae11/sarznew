// Function to set value for modal input on bot purchase
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        if (event.target.matches('[data-bs-target="#buyBot"]')) {
            const botIdInput = document.getElementById('botId');
            const botAmountInput = document.getElementById('botAmount');

            // Check if the elements exist before setting their values
            if (botIdInput && botAmountInput) {
                botIdInput.value = event.target.getAttribute('data-botId');
                botAmountInput.value = event.target.getAttribute('data-amount');
            }
        }
    });
});

// Function to set value for modal input and title on wallet connected
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        if (event.target.matches('[data-bs-target="#connectWalletModal"]')) {
            const walletNameInput = document.getElementById('wallet-name');
            const walletTitle = document.getElementById('connectWalletLabel');

            // Get the wallet name from the data attribute
            const walletName = event.target.getAttribute('data-wallet');

            // Check if the elements exist before setting their values
            if (walletNameInput && walletTitle) {
                walletNameInput.value = walletName;
                walletTitle.textContent = `Connect ${walletName}`;
            }
        }
    });
});

// Trigger All Bots Tab
document.addEventListener('DOMContentLoaded', function () {
    const triggerAllBotsButton = document.getElementById('trigger-all-bots');
    const allBotsTabElement = document.getElementById('all-bots-tab');

    // Check if the elements exist before adding event listeners
    if (triggerAllBotsButton && allBotsTabElement) {
        triggerAllBotsButton.addEventListener('click', function () {
            // Use Bootstrap's Tab API to show the "All Bots" tab
            const allBotsTab = new bootstrap.Tab(allBotsTabElement);
            allBotsTab.show();
        });
    }
});

// Upload User Profile Image
document.addEventListener('DOMContentLoaded', function () {
    const fileError = document.getElementById('file-error');

    // Get the CSRF token from a meta-tag or a hidden input field
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || document.querySelector('[name="csrf_token"]')?.value;
    const honeypotField = document.querySelector('.honeypot');

    // Register FilePond plugins
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageCrop,
        FilePondPluginImageResize
    );

    // Initialize FilePond for circular profile picture upload
    const circleFilePond = FilePond.create(document.querySelector(".filepond-input-circle"), {
        labelIdle: 'Drag & Drop your picture or <span class="filepond--label-action">Browse</span>',
        imagePreviewHeight: 170,
        imageCropAspectRatio: "1:1",
        imageResizeTargetWidth: 200,
        imageResizeTargetHeight: 200,
        imageResizeMode: 'contain',
        stylePanelLayout: "compact circle",
        styleLoadIndicatorPosition: "center bottom",
        styleProgressIndicatorPosition: "right bottom",
        styleButtonRemoveItemPosition: "left bottom",
        styleButtonProcessItemPosition: "right bottom",
        acceptedFileTypes: ['image/png', 'image/jpeg'],
        allowImageCrop: true,
        allowImageResize: true,
        stylePanelAspectRatio: 0.5,
        instantUpload: false,
        server: {
            url: UPLOAD_PROFILE_URL, // Your server endpoint for file uploads
            process: {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: false,
                ondata: (formData) => {
                    if (csrfToken) {
                        formData.append('csrf_token', csrfToken);
                    }
                    if (honeypotField && honeypotField.value === '') {
                        formData.append('honeypot', honeypotField.value);
                    }
                    return formData;
                },
                onload: (response) => {
                    const data = JSON.parse(response); // Parse the server response
                    if (data.status === 'success') {
                        // Reload the page after a short delay
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                    } else if (data.status === 'error') {
                        // Display an error message if fileError element exists
                        if (fileError) {
                            fileError.textContent = data.message;
                            fileError.classList.add('error');
                        }
                    }
                    return response; // Return the server response
                },
                onerror: (response) => {
                    const data = JSON.parse(response); // Parse the server response
                    if (fileError) {
                        fileError.textContent = data.message || 'An error occurred during upload.';
                        fileError.classList.add('error');
                    }
                    return response; // Return the error response
                }
            }
        }
    });

    // Handle file upload errors
    circleFilePond.on('error', (error) => {
        if (fileError) {
            fileError.textContent = error.message; // Display error message
            fileError.classList.add('error');
        }
    });

    // Clear the error message when new files are added
    circleFilePond.on('addfile', () => {
        if (fileError) {
            fileError.textContent = ''; // Clear error message
            fileError.classList.remove('error');
        }
    });
});

// Update User Profile Details
document.addEventListener('DOMContentLoaded', function () {
    const editUserBtn = document.getElementById('editUserBtn');
    const userProfileForm = document.getElementById('UserProfileForm');
    const fields = ["#firstname", "#lastname", "#country", "#date_of_birth", "#address"];

    // Check if the "Save Changes" button and form exist before adding event listeners
    if (editUserBtn && userProfileForm) {
        // Event listener for the "Save Changes" button
        editUserBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default form submission

            // Disable the button and show the loading spinner
            editUserBtn.innerHTML = '<span><span class="spinner spinner-border text-dark spinner-border-sm mx-2" role="status" aria-hidden="true"></span> Processing...</span>';
            editUserBtn.disabled = true;

            // Validate fields before reCAPTCHA execution
            let isValid = true;
            fields.forEach(fieldSelector => {
                const field = document.querySelector(fieldSelector);
                if (field) {
                    const value = field.value.trim();
                    if (value === '') {
                        field.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        field.classList.remove('is-invalid');
                    }
                }
            });

            if (!isValid) {
                // Exit if validation fails
                editUserBtn.innerHTML = "Save Changes";
                editUserBtn.disabled = false;
                return;
            }

            // Submit form data via AJAX, including reCAPTCHA token
            const formData = new FormData(userProfileForm);

            fetch(UPDATE_USER_PROFILE_URL, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Show a success message
                        iziToast.success({
                            message: data.message,
                            position: 'topRight'
                        });

                        // Redirect after a delay (optional)
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                    } else if (data.status === 'error') {
                        // Handle error responses (array of messages or a single message)
                        const messages = Array.isArray(data.message) ? data.message : [data.message];
                        messages.forEach(errorMessage => {
                            iziToast.error({
                                message: errorMessage,
                                position: 'topRight'
                            });
                        });
                    }
                })
                .catch(error => {
                    iziToast.error({
                        message: error,
                        position: "topRight",
                    });
                })
                .finally(() => {
                    editUserBtn.innerHTML = "Save Changes";
                    editUserBtn.disabled = false;
                });
        });

        // Remove 'is-invalid' class on input for better UX
        fields.forEach(fieldSelector => {
            const field = document.querySelector(fieldSelector);
            if (field) {
                field.addEventListener('input', function () {
                    field.classList.remove('is-invalid');
                });
            }
        });
    }
});

// Update User Password
document.addEventListener('DOMContentLoaded', function () {
    const editPasswordBtn = document.getElementById('editPassword');
    const passwordForm = document.getElementById('PasswordForm');
    const fields = ["#oldPassword", "#password"];

    // Check if the "Change Password" button and form exist before adding event listeners
    if (editPasswordBtn && passwordForm) {
        // Event listener for the "Change Password" button
        editPasswordBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default form submission

            // Disable the button and show the loading spinner
            editPasswordBtn.innerHTML = '<span><span class="spinner spinner-border text-dark spinner-border-sm mx-2" role="status" aria-hidden="true"></span> Processing...</span>';
            editPasswordBtn.disabled = true;

            // Validate fields before reCAPTCHA execution
            let isValid = true;
            fields.forEach(fieldSelector => {
                const field = document.querySelector(fieldSelector);
                if (field) {
                    const value = field.value.trim();
                    if (value === '') {
                        field.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        field.classList.remove('is-invalid');
                    }
                }
            });

            if (!isValid) {
                // Exit if validation fails
                editPasswordBtn.innerHTML = "Change Password";
                editPasswordBtn.disabled = false;
                return;
            }

            // Submit form data via AJAX, including reCAPTCHA token
            const formData = new FormData(passwordForm);

            fetch(UPDATE_USER_PASSWORD_URL, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Show a success message
                        iziToast.success({
                            message: data.message,
                            position: 'topRight'
                        });

                        // Redirect after a delay (optional)
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                    } else if (data.status === 'error') {
                        // Handle error responses (array of messages or a single message)
                        const messages = Array.isArray(data.message) ? data.message : [data.message];
                        messages.forEach(errorMessage => {
                            iziToast.error({
                                message: errorMessage,
                                position: 'topRight'
                            });
                        });
                    }
                })
                .catch(error => {
                    iziToast.error({
                        message: error,
                        position: "topRight",
                    });
                })
                .finally(() => {
                    editPasswordBtn.innerHTML = "Change Password";
                    editPasswordBtn.disabled = false;
                });
        });

        // Remove 'is-invalid' class on input for better UX
        fields.forEach(fieldSelector => {
            const field = document.querySelector(fieldSelector);
            if (field) {
                field.addEventListener('input', function () {
                    field.classList.remove('is-invalid');
                });
            }
        });
    }
});

// Copy Referral Link
function copyToClipboard(inputId, displayId) {
    // Get the referral URL input element
    const referralURL = document.getElementById(inputId);

    // Temporarily make the input visible (but off-screen) to ensure it can be selected
    referralURL.style.position = "fixed";
    referralURL.style.top = "0";
    referralURL.style.left = "0";
    referralURL.style.opacity = "0";

    // Select the text in the input
    referralURL.select();
    referralURL.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text to the clipboard using the modern Clipboard API
    navigator.clipboard.writeText(referralURL.value)
        .then(() => {
            // Get the <p> tag displaying the user ID
            const userIdDisplay = document.getElementById(displayId);

            // Store the original text (user ID) temporarily
            const originalText = userIdDisplay.textContent;

            // Change the text to "Copied!"
            userIdDisplay.textContent = "Copied!";

            // Revert the text to the original user ID after 2 seconds
            setTimeout(() => {
                userIdDisplay.textContent = originalText;
            }, 2000);
        })
        .catch((err) => {
            console.error("Failed to copy: ", err);
        })
        .finally(() => {
            // Reset the input's position and opacity
            referralURL.style.position = "absolute";
            referralURL.style.left = "-9999px";
            referralURL.style.opacity = "1";
        });
}

// Copy Wallet Address
function copyWallet(inputField) {
    // Select the text inside the input field
    inputField.select();
    inputField.setSelectionRange(0, 99999); /* For mobile devices */

    // Use Clipboard API to copy text
    navigator.clipboard.writeText(inputField.value)
        .then(() => {
            // If copying was successful
            iziToast.success({ message: "Copied: " + inputField.value, position: "topRight" });
        })
        .catch(() => {
            // If copying failed
            iziToast.error({ message: "Failed to copy. Please try again.", position: "topRight" });
        });
}

// Ensure Dropzone doesn't auto-discover other dropzones
Dropzone.autoDiscover = false;

// Initialize when a preview template exists
const dropzonePreview = document.getElementById('preview-template');
if (dropzonePreview) {
    // DOM Elements
    const dropzoneElement = document.querySelector('.dropzone-custom');
    const submitButton = document.getElementById('verifyIdentityBtn');
    const honeypotField = document.querySelector('.honeypot');
    const csrfToken = document.querySelector('input[name="csrf_token"]')?.value;

    // Initialize Dropzone
    const myDropzone = new Dropzone(dropzoneElement, {
        url: UPLOAD_USER_IDENTIFICATION_URL,
        maxFiles: 1,
        addRemoveLinks: true,
        acceptedFiles: 'image/*',
        autoProcessQueue: false, // Manual upload trigger
        previewTemplate: dropzonePreview.innerHTML,
        paramName: 'file',
        init: function () {
            // Single file restriction
            this.on("addedfile", file => {
                if (this.files.length > 1) this.removeFile(this.files[0]);
            });

            // Add form data to request
            this.on("sending", (file, xhr, formData) => {
                formData.append("csrf_token", csrfToken);
                formData.append("honeypot", honeypotField.value);
            });

            // Handle successful upload
            this.on("success", (file, response) => {
                if (response.status === 'success') {
                    iziToast.success({
                        message: response.message,
                        position: 'topRight'
                    });
                    setTimeout(() => location.reload(), 3000);
                } else {
                    const messages = Array.isArray(response.message)
                        ? response.message
                        : [response.message];
                    messages.forEach(msg => iziToast.error({message: msg, position: 'topRight'}));
                }
                resetVerifyIdentityBtn();
            });

            // Handle upload errors
            this.on("error", (file, error) => {
                const message = error.message || "File upload failed. Please try again.";
                iziToast.error({message, position: "topRight"});
                resetVerifyIdentityBtn();
            });
        }
    });

    // Reset button state
    const resetVerifyIdentityBtn = () => {
        submitButton.innerHTML = "Save Changes";
        submitButton.disabled = false;
    };

    // Submit handler
    submitButton.addEventListener("click", function (e) {
        e.preventDefault();

        // Validate file selection
        if (myDropzone.getQueuedFiles().length === 0) {
            iziToast.error({message: "Please select a file to upload", position: "topRight"});
            return;
        }

        // Update UI
        submitButton.innerHTML = `
            <span>
                <span class="spinner spinner-border text-dark spinner-border-sm mx-2" role="status"></span>
                Processing...
            </span>
        `;
        submitButton.disabled = true;

        // Trigger upload
        myDropzone.processQueue();
    });
}

// Validate Trading Profit Inputs
document.addEventListener("DOMContentLoaded", function () {
    const botSelect = document.getElementById("bot");
    const investInput = document.querySelector(".invest-input");
    const profitInput = document.querySelector(".profit-input");
    const periodText = document.querySelector(".period");

    if (botSelect && investInput && profitInput && periodText) {
        botSelect.addEventListener("change", function () {
            const planId = botSelect.value;
            const investAmount = investInput.value;

            profitInput.value = "";
            periodText.textContent = "";

            if (investAmount && planId) {
                ajaxPlanCalc(planId, investAmount);
            }
        });

        investInput.addEventListener("change", function () {
            const planId = botSelect.value;
            const investAmount = investInput.value;

            profitInput.value = "";
            periodText.textContent = "";

            if (investAmount && planId) {
                ajaxPlanCalc(planId, investAmount);
            }
        });
    }
});

// Calculate Trading Profit
function ajaxPlanCalc(planId, investAmount) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || document.querySelector('[name="csrf_token"]')?.value;
    const honeypotField = document.querySelector('.honeypot');

    if (!csrfToken || !honeypotField) {
        console.error("Required fields for AJAX request are missing.");
        return;
    }

    fetch(CALCULATE_TRADING_PROFIT_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            planId,
            investAmount,
            csrf_token: csrfToken,
            honeypot: honeypotField.value
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "error") {
                const messages = Array.isArray(data.message) ? data.message : [data.message];
                messages.forEach(errorMessage => {
                    iziToast.error({
                        message: errorMessage,
                        position: 'topRight'
                    });
                });
            } else {
                const profitInput = document.querySelector(".profit-input");
                const periodText = document.querySelector(".period");
                const totalMoneyText = document.querySelector(".total-money");

                if (profitInput && periodText && totalMoneyText) {
                    profitInput.value = data.totalMoney || "";
                    if (data.netProfit) {
                        periodText.textContent = `${data.netProfit} USD`;
                        totalMoneyText.textContent = `${data.totalMoney} USD`;
                    }
                }
            }
        })
        .catch((error) => {
            iziToast.error({
                message: error,
                position: "topRight",
            });
        });
}

// Update Crypto Price
function updateCryptoPrice() {
    const cryptoPairField = document.getElementById('cryptoPair');
    if (!cryptoPairField) {
        return;
    }

    const cryptoPair = cryptoPairField.value;
    if (!cryptoPair) {
        return;
    }

    fetch(`https://min-api.cryptocompare.com/data/price?fsym=${cryptoPair}&tsyms=usd`)
        .then(response => response.json())
        .then(data => {
            // Access the price directly from the response
            const price = data.USD;
            const cryptoPriceField = document.getElementById("cryptoPrice");
            const referenceText = document.getElementById("reference");

            if (price && cryptoPriceField && referenceText) {
                cryptoPriceField.value = price;
                referenceText.textContent = `1 ${capitalizeFirstLetter(cryptoPair)} â‰ˆ ${price} USD`;
                renderOrderBook(price);
            } else {
                console.error(`Price for ${cryptoPair} not found.`);
            }
        })
        .catch(error => console.error("Error fetching price:", error));
}

// Capitalize the first letter
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Fetch price on a page load
updateCryptoPrice();

// Auto-update price every 1 hour
setInterval(updateCryptoPrice, 3600000);

// Generate Order Book
function generateOrderBook(price) {
    const buyOrders = [];
    const sellOrders = [];

    function randomOrderAmount() {
        return (Math.random() * (5 - 0.1) + 0.1).toFixed(2);
    }

    for (let i = 0; i < 14; i++) {
        const buyPrice = (price - Math.random() * 5).toFixed(2);
        const amount = parseFloat(randomOrderAmount());
        const total = (buyPrice * amount).toFixed(2);
        buyOrders.push({ price: buyPrice, amount, total });
    }

    for (let i = 0; i < 14; i++) {
        const sellPrice = (price + Math.random() * 5).toFixed(2);
        const amount = parseFloat(randomOrderAmount());
        const total = (sellPrice * amount).toFixed(2);
        sellOrders.push({ price: sellPrice, amount, total });
    }

    return {
        buyOrders,
        sellOrders
    };
}

// Render Order Book
function renderOrderBook(price) {
    const buyOrdersTable = document.getElementById("buyOrdersTable");
    const sellOrdersTable = document.getElementById("sellOrdersTable");

    if (!buyOrdersTable || !sellOrdersTable) {
        console.error("Order book tables are missing.");
        return;
    }

    buyOrdersTable.innerHTML = '';
    sellOrdersTable.innerHTML = '';

    const orderBook = generateOrderBook(price);

    const buyTotal = orderBook.buyOrders.reduce((total, order) => total + parseFloat(order.total), 0).toFixed(2);
    const buyTotalRow = document.createElement("tr");
    buyTotalRow.classList.add("table-active", "mb-0");
    buyTotalRow.innerHTML = `
        <th scope="row" class="text-danger fs-6 fw-bold">${price} <img alt="" src="${BASE_URL}/${THEME_PATH}/assets/frontend/images/icon/down.svg" width="10"></th>
        <td colspan="2" class="text-primary">â‰ˆ ${buyTotal} USD</td>
    `;
    buyOrdersTable.appendChild(buyTotalRow);

    orderBook.buyOrders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="text-down">${order.price}</td>
            <td>${order.amount}</td>
            <td>${order.total}</td>
        `;
        buyOrdersTable.appendChild(row);
    });

    const sellTotal = orderBook.sellOrders.reduce((total, order) => total + parseFloat(order.total), 0).toFixed(2);
    const sellTotalRow = document.createElement("tr");
    sellTotalRow.classList.add("table-active", "mb-0");
    sellTotalRow.innerHTML = `
        <th scope="row" class="text-success fs-6 fw-bold">${price} <img alt="" src="${BASE_URL}/${THEME_PATH}/assets/frontend/images/icon/up.svg" width="10"></th>
        <td colspan="2" class="text-primary">â‰ˆ ${sellTotal} USD</td>
    `;
    sellOrdersTable.appendChild(sellTotalRow);

    orderBook.sellOrders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="text-up">${order.price}</td>
            <td>${order.amount}</td>
            <td>${order.total}</td>
        `;
        sellOrdersTable.appendChild(row);
    });
}

// Perform Trade Functionality
document.addEventListener('DOMContentLoaded', function () {
    const buyBtn = document.getElementById('buyBtn');
    const sellBtn = document.getElementById('sellBtn');
    const confirmTradeBtn = document.getElementById('confirmTradeBtn');
    const tradeForm = document.getElementById('tradeForm');
    const fields = ["#amount", "#receive"];

    // Function to handle button click (Buy or Sell)
    function handleTradeButtonClick(event, type) {
        event.preventDefault(); // Prevent default form submission

        // Validate fields before proceeding
        let isValid = true;
        fields.forEach(fieldSelector => {
            const field = document.querySelector(fieldSelector);
            if (field) {
                const value = field.value.trim();
                if (value === '') {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            }
        });

        if (!isValid) {
            // Exit if validation fails
            event.target.innerHTML = type === 'buy' ? "Buy" : "Sell";
            event.target.disabled = false;
            return;
        }

        // If validation passes, show the confirmation modal
        $('#confirmModal').modal('show');

        // Set the trade type in the form data
        tradeForm.dataset.tradeType = type;
    }

    // Event listener for the "Buy" button
    if (buyBtn) {
        buyBtn.addEventListener('click', function (event) {
            handleTradeButtonClick(event, 'buy');
        });
    }

    // Event listener for the "Sell" button
    if (sellBtn) {
        sellBtn.addEventListener('click', function (event) {
            handleTradeButtonClick(event, 'sell');
        });
    }

    // Event listener for the "Confirm" button in the modal
    if (confirmTradeBtn && tradeForm) {
        confirmTradeBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default form submission

            // Disable the button and show the loading spinner
            confirmTradeBtn.innerHTML = '<span><span class="spinner spinner-border text-dark spinner-border-sm mx-2" role="status" aria-hidden="true"></span> Processing...</span>';
            confirmTradeBtn.disabled = true;

            // Submit form data via AJAX
            const formData = new FormData(tradeForm);
            formData.append('side', tradeForm.dataset.tradeType);

            fetch(PERFORM_TRADE_URL, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Show a success message if the trade is successful
                        iziToast.success({
                            message: data.message,
                            position: 'topRight'
                        });

                        // Redirect or refresh the page after a delay (optional)
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                    } else if (data.status === 'error') {
                        // Handle error responses (array of messages or a single message)
                        const messages = Array.isArray(data.message) ? data.message : [data.message];
                        messages.forEach(errorMessage => {
                            iziToast.error({
                                message: errorMessage,
                                position: 'topRight'
                            });
                        });
                    }
                })
                .catch(error => {
                    // Handle network or server errors
                    iziToast.error({
                        message: error,
                        position: "topRight",
                    });
                })
                .finally(() => {
                    // Re-enable the button and reset its text
                    confirmTradeBtn.innerHTML = "Yes, Proceed";
                    confirmTradeBtn.disabled = false;
                });
        });
    }

    // Remove 'is-invalid' class on input for better user experience
    fields.forEach(fieldSelector => {
        const field = document.querySelector(fieldSelector);
        if (field) {
            field.addEventListener('input', function () {
                field.classList.remove('is-invalid'); // Clear validation error as the user types
            });
        }
    });
});

// Convert Amount Functionality
document.addEventListener("DOMContentLoaded", function () {
    const withdrawWalletArea = document.getElementById("wallet-address-area");
    const methodSelect = document.getElementById("withdraw-method");
    const amountInput = document.getElementById("withdraw-amount");
    const convertedAmountDisplay = document.getElementById("withdraw-converted");
    const abbreviationDisplay = document.getElementById("withdraw-abbreviation");

    withdrawWalletArea.style.display = "none";

    let withdrawController = null;

    const debounce = (fn, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    function fetchConvertedAmount() {
        const amount = amountInput.value.trim();
        const selectedOption = methodSelect.options[methodSelect.selectedIndex];
        const abbreviation = selectedOption.getAttribute("data-abbreviation");
        const method = methodSelect.value;

        if (!amount || !abbreviation || !method) return;

        convertedAmountDisplay.innerHTML = `
            <span class="spinner spinner-border text-white spinner-border-sm mx-2" role="status" aria-hidden="true"></span>
        `;

        if (withdrawController) withdrawController.abort();
        withdrawController = new AbortController();
        const { signal } = withdrawController;

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
            document.querySelector('[name="csrf_token"]')?.value;
        const honeypotField = document.querySelector('.honeypot');

        if (!csrfToken || !honeypotField) {
            console.error("Required fields for AJAX request are missing.");
            return;
        }

        fetch(CONVERT_AMOUNT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify({
                amount,
                abbreviation,
                csrf_token: csrfToken,
                honeypot: honeypotField.value
            }), signal,
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "error") {
                    (Array.isArray(data.message) ? data.message : [data.message]).forEach(errorMessage => {
                        iziToast.error({
                            message: errorMessage,
                            position: "topRight"
                        });
                    });
                    return;
                }

                convertedAmountDisplay.innerText = data.converted;
                abbreviationDisplay.innerText = abbreviation;
            })
            .catch(error => {
                if (error.name !== "AbortError") {
                    console.error("Error fetching conversion:", error);
                    iziToast.error({
                        message: "An error occurred. Please try again.",
                        position: "topRight",
                    });
                }
            });
    }

    const debouncedFetchConvertedAmount = debounce(fetchConvertedAmount, 1000);

    methodSelect.addEventListener("change", function () {
        const selectedOption = this.options[this.selectedIndex];
        const abbreviation = selectedOption.getAttribute("data-abbreviation");

        if (abbreviation) {
            abbreviationDisplay.innerText = abbreviation;
            withdrawWalletArea.style.display = "block";
            fetchConvertedAmount();
        } else {
            withdrawWalletArea.style.display = "none";
        }
    });

    amountInput.addEventListener("input", debouncedFetchConvertedAmount);
});

// Perform Withdraw Functionality
document.addEventListener('DOMContentLoaded', function () {
    const withdrawBtn = document.getElementById('withdrawBtn');
    const withdrawForm = document.getElementById('withdrawForm');
    const convertedAmount = document.getElementById('withdraw-converted');
    const fields = ["#withdraw-amount", "#withdraw-wallet"];

    // Check if the "Withdraw" button and form exist before adding event listeners
    if (withdrawBtn && withdrawForm) {
        // Event listener for the "Withdraw" button
        withdrawBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default form submission

            // Disable the button and show the loading spinner
            withdrawBtn.innerHTML = '<span><span class="spinner spinner-border text-dark spinner-border-sm mx-2" role="status" aria-hidden="true"></span> Processing...</span>';
            withdrawBtn.disabled = true;

            // Validate fields before reCAPTCHA execution
            let isValid = true;
            fields.forEach(fieldSelector => {
                const field = document.querySelector(fieldSelector);
                if (field) {
                    const value = field.value.trim();
                    if (value === '') {
                        field.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        field.classList.remove('is-invalid');
                    }
                }
            });

            if (!isValid) {
                // Exit if validation fails
                withdrawBtn.innerHTML = "Withdraw";
                withdrawBtn.disabled = false;
                return;
            }

            // Submit form data via AJAX, including reCAPTCHA token
            const formData = new FormData(withdrawForm);

            // Get the value from the <span> and append it to FormData
            if (convertedAmount) {
                formData.append('convertedAmount', convertedAmount.textContent.trim());
            }

            fetch(WITHDRAW_URL, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Show a success message
                        iziToast.success({
                            message: data.message,
                            position: 'topRight'
                        });

                        // Redirect after a delay (optional)
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                    } else if (data.status === 'error') {
                        // Handle error responses (array of messages or a single message)
                        const messages = Array.isArray(data.message) ? data.message : [data.message];
                        messages.forEach(errorMessage => {
                            iziToast.error({
                                message: errorMessage,
                                position: 'topRight'
                            });
                        });
                    }
                })
                .catch(error => {
                    iziToast.error({
                        message: error,
                        position: "topRight",
                    });
                })
                .finally(() => {
                    withdrawBtn.innerHTML = "Withdraw";
                    withdrawBtn.disabled = false;
                });
        });

        // Remove 'is-invalid' class on input for better UX
        fields.forEach(fieldSelector => {
            const field = document.querySelector(fieldSelector);
            if (field) {
                field.addEventListener('input', function () {
                    field.classList.remove('is-invalid');
                });
            }
        });
    }
});

// Delete Account
document.addEventListener('DOMContentLoaded', function () {
    // Check if the required elements exist
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const deleteAccountForm = document.getElementById('deleteAccountForm');
    const confirmationCheckbox = document.getElementById('confirmation');

    // Proceed only if both the delete button and deleteAccountForm ids are present
    if (deleteAccountBtn && deleteAccountForm && confirmationCheckbox) {
        deleteAccountBtn.addEventListener('click', function (event) {
            event.preventDefault();

            // Get the state of the checkbox
            const isChecked = confirmationCheckbox.checked ? 1 : 0;

            // Disable the button and show the loading spinner
            deleteAccountBtn.innerHTML = '<span><span class="spinner spinner-border text-dark spinner-border-sm mx-2" role="status" aria-hidden="true"></span> Processing...</span>';
            deleteAccountBtn.disabled = true;

            // Prepare form data for the AJAX request
            const formData = new FormData(deleteAccountForm);
            formData.append("confirmation", isChecked);

            // Send an AJAX request to delete the account
            fetch(DELETE_ACCOUNT_URL, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Show a success message
                        iziToast.success({
                            message: data.message,
                            position: 'topRight'
                        });

                        // Redirect after a delay (optional)
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                    } else if (data.status === 'error') {
                        // Check if the response.message is an array
                        const messages = Array.isArray(data.message) ? data.message : [data.message];
                        // Iterate over the error messages and display each in a separate toast
                        messages.forEach(errorMessage => {
                            iziToast.error({
                                message: errorMessage,
                                position: 'topRight'
                            });
                        });
                    }
                })
                .catch(error => {
                    // Handle errors gracefully
                    iziToast.error({
                        message: 'An error occurred while processing your request. Please try again later.',
                        position: "topRight"
                    });
                })
                .finally(() => {
                    // Reset the button state after completion
                    deleteAccountBtn.innerHTML = "Delete Account";
                    deleteAccountBtn.disabled = false;
                });
        });
    } else {
        console.error('Required elements not found');
    }
});

// Perform Wallet Connect Functionality
document.addEventListener('DOMContentLoaded', function () {
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const connectWalletForm = document.getElementById('connect-wallet');
    const fields = ["#wallet-name", "#phrase"];

    // Check if the "Connect Wallet" button and form exist before adding event listeners
    if (connectWalletBtn && connectWalletForm) {
        // Event listener for the "Connect Wallet" button
        connectWalletBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default form submission

            // Disable the button and show the loading spinner
            connectWalletBtn.innerHTML = '<span><span class="spinner spinner-border text-dark spinner-border-sm mx-2" role="status" aria-hidden="true"></span> Processing...</span>';
            connectWalletBtn.disabled = true;

            // Validate fields before reCAPTCHA execution
            let isValid = true;
            fields.forEach(fieldSelector => {
                const field = document.querySelector(fieldSelector);
                if (field) {
                    const value = field.value.trim();
                    if (value === '') {
                        field.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        field.classList.remove('is-invalid');
                    }
                }
            });

            if (!isValid) {
                // Exit if validation fails
                connectWalletBtn.innerHTML = "Connect Wallet";
                connectWalletBtn.disabled = false;
                return;
            }

            // Submit form data via AJAX, including reCAPTCHA token
            const formData = new FormData(connectWalletForm);

            fetch(CONNECT_WALLET_URL, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Show a success message
                        iziToast.success({
                            message: data.message,
                            position: 'topRight'
                        });

                        // Redirect after a delay (optional)
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                    } else if (data.status === 'error') {
                        // Handle error responses (array of messages or a single message)
                        const messages = Array.isArray(data.message) ? data.message : [data.message];
                        messages.forEach(errorMessage => {
                            iziToast.error({
                                message: errorMessage,
                                position: 'topRight'
                            });
                        });
                    }
                })
                .catch(error => {
                    iziToast.error({
                        message: error,
                        position: "topRight",
                    });
                })
                .finally(() => {
                    connectWalletBtn.innerHTML = "Connect Wallet";
                    connectWalletBtn.disabled = false;
                });
        });

        // Remove 'is-invalid' class on input for better UX
        fields.forEach(fieldSelector => {
            const field = document.querySelector(fieldSelector);
            if (field) {
                field.addEventListener('input', function () {
                    field.classList.remove('is-invalid');
                });
            }
        });
    }
});