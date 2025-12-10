// Function to hide the alert and set the cookie
function handleCookieAcceptance() {
    // Hide the cookie alert
    document.getElementById('cookieAlert').style.display = 'none';

    // Set a cookie to remember user acceptance
    document.cookie = "cookiesAccepted=true; path=/; max-age=" + (60 * 60 * 24 * 30); // 30 days
}

// Attach the event to the "Accept" button
document.getElementById('acceptCookies').addEventListener('click', handleCookieAcceptance);

// Attach the event to the close button
document.getElementById('closeAlert').addEventListener('click', handleCookieAcceptance);

// Function to check if a specific cookie exists
function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// On page load, check if cookiesAccepted is true
window.addEventListener('DOMContentLoaded', function () {
    if (getCookie('cookiesAccepted') !== 'true') {
        // Show the cookie alert if the cookie is not set or is not accepted
        document.getElementById('cookieAlert').style.display = 'block';
    }
});