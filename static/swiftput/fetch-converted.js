// Fetch User's Balance Converted To usdt
document.addEventListener('DOMContentLoaded', function () {
    // Get the user's wallet balance in USD from a meta-tag or input field
    const walletBalance = document.querySelector('meta[name="wallet-balance"]')?.getAttribute('content') ||
        document.querySelector('[name="wallet-balance"]')?.value;

    if (!walletBalance) {
        console.error("Wallet balance not found.");
        return;
    }

    // Iterate over each item with the class "convertWallet"
    $('.convertWallet').each(function () {
        const $box = $(this);

        // Reference the converted element using the unique ID
        const $convertedElement = $box.find('.converted');

        // Add a spinner to indicate loading
        $convertedElement.html('<span class="spinner spinner-border text-white spinner-border-sm mx-2" role="status" aria-hidden="true"></span>');

        // Fetch the conversion rate from USD to USDT
        fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=USDT`)
            .then(response => response.json())
            .then(data => {
                // Access the conversion rate directly from the response
                const conversionRate = data.USDT;
                if (!conversionRate) {
                    console.error("Conversion rate not found.");
                    $convertedElement.text("Error: Conversion rate not found."); // Display error message
                    return;
                }

                // Calculate the converted value in USDT
                const convertedValue = (parseFloat(walletBalance) * conversionRate);
                const formattedValue = convertedValue.toFixed(2); // Format to 2 decimal places

                // Render the converted value to the HTML element with class 'converted'
                $convertedElement.text(`â‰ˆ ${formattedValue} USDT`);
            })
            .catch(error => {
                console.error("Error fetching conversion rate:", error);
                $convertedElement.text("Error: Unable to fetch conversion rate."); // Display error message
            });
    });
});

// Convert Amount Functionality
document.addEventListener("DOMContentLoaded", function () {
    const walletArea = document.getElementById("wallet-area");
    const methodSelect = document.getElementById("method");
    const amountInput = document.getElementById("deposit-amount");
    const convertedAmountDisplay = document.getElementById("converted");
    const abbreviationDisplay = document.getElementById("abbreviation");
    const walletAddressInput = document.getElementById("walletAddress");
    const qrCodeImage = document.querySelector(".right-qr-code img");

    walletArea.style.display = "none";

    let controller = null;

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

        if (controller) controller.abort();
        controller = new AbortController();
        const { signal } = controller;

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
        const walletAddress = selectedOption.getAttribute("data-wallet");
        const abbreviation = selectedOption.getAttribute("data-abbreviation");

        if (walletAddress) {
            walletAddressInput.value = walletAddress;
            abbreviationDisplay.innerText = abbreviation;
            qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(walletAddress)}`;
            walletArea.style.display = "block";
            fetchConvertedAmount();
        } else {
            walletArea.style.display = "none";
        }
    });

    amountInput.addEventListener("input", debouncedFetchConvertedAmount);
});

// Perform Deposit Functionality
document.addEventListener('DOMContentLoaded', function () {
    const depositBtn = document.getElementById('depositBtn');
    const depositForm = document.getElementById('depositForm');
    const convertedAmount = document.getElementById('converted');
    const fields = ["#deposit-amount"];

    // Check if the "Deposit" button and form exist before adding event listeners
    if (depositBtn && depositForm) {
        // Event listener for the "Deposit" button
        depositBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default form submission

            // Disable the button and show the loading spinner
            depositBtn.innerHTML = '<span><span class="spinner spinner-border text-dark spinner-border-sm mx-2" role="status" aria-hidden="true"></span> Processing...</span>';
            depositBtn.disabled = true;

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
                depositBtn.innerHTML = "Deposit";
                depositBtn.disabled = false;
                return;
            }

            // Submit form data via AJAX, including reCAPTCHA token
            const formData = new FormData(depositForm);

            // Get the value from the <span> and append it to FormData
            if (convertedAmount) {
                formData.append('convertedAmount', convertedAmount.textContent.trim());
            }

            fetch(DEPOSIT_URL, {
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
                    depositBtn.innerHTML = "Deposit";
                    depositBtn.disabled = false;
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