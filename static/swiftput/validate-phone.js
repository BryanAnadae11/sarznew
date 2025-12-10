// Validate Phone Number
$(document).ready(function() {
    // Check if the phone input field exists
    const phoneInput = $("#phone");
    if (phoneInput.length > 0) {
        // Initialize the intl-tel-input plugin on the phone input field
        const input = document.querySelector("#phone");
        const iti = window.intlTelInput(input, {
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.12/js/utils.js",
            geoIpLookup: function(callback) {
                fetch('https://ipapi.co/json')
                    .then(response => response.json())
                    .then(data => {
                        const countryCode = data.country_code || 'us'; // Fallback to 'us' if no country code is found
                        callback(countryCode);
                    })
                    .catch(() => callback('us')); // Fallback to 'us' in case of an error
            },
            initialCountry: 'auto', // Automatically set the initial country based on geoIpLookup
        });

        // Update country name on input changes
        input.addEventListener("input", function() {
            updateCountryName();
            validatePhoneNumber();
        });

        // Listen for changes in the selected country
        input.addEventListener("countrychange", function() {
            updateHiddenInputs();
            validatePhoneNumber();
        });

        function updateHiddenInputs() {
            const countryName = iti.getSelectedCountryData().name;
            // Set the value of the hidden input field to the selected country's name
            $("#country").val(countryName);
        }

        function updateCountryName() {
            // Get the country based on the entered phone number
            const country = iti.getSelectedCountryData().name;
            // Set the value of the hidden input field to the selected country's name
            $("#country").val(country);
        }

        function validatePhoneNumber() {
            // Get the formatted international version of the phone number
            const formattedPhoneNumber = iti.getNumber(intlTelInputUtils.numberFormat.E164);
            // Set the value of the hidden input field to the formatted phone number
            $("#formattedPhone").val(formattedPhoneNumber);

            const isValid = iti.isValidNumber();
            if (!isValid) {
                // Get the selected country's name
                const countryName = iti.getSelectedCountryData().name;
                // Display an error message specific to the selected country
                $("#phone-error").text(`Please enter a valid phone number for ${countryName}.`).addClass("error");
                $(".iti").addClass("iti-margin");
            } else {
                // Clear the error message if the phone number is valid
                $("#phone-error").text("").removeClass("error");
                $(".iti").removeClass("iti-margin");
            }
            // Enable or disable the submitted button based on the validity of the phone number
            $("#registerBtn").prop("disabled", !isValid);

            const editUserBtn = $("#editUserBtn");
            if (editUserBtn.length > 0) {
                editUserBtn.prop("disabled", !isValid);
            }
        }
    }
});