import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging.js";

// Firebase configuration and VAPID key
const firebaseConfig = {
    apiKey: "AIzaSyDGjLZX_w9e_R2l84mYnkOgMWDomMoMp4U",
    authDomain: "gimme-cash-8e8c9.firebaseapp.com",
    projectId: "gimme-cash-8e8c9",
    storageBucket: "gimme-cash-8e8c9.firebasestorage.app",
    messagingSenderId: "405318341412",
    appId: "1:405318341412:web:74b11a1d0c407e0eaad9b1",
    measurementId: "G-X77HJ89MLV"
};

const vapidKey = "BMZIwvl10RSwgoq011sIDVn_pzNKYq-cf8T8-QemiwmvTtCvPqyn_rymg5hPvYPxqJ5PgD7xFAz4temq1WSCjNg";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Function to show the fixed bottom alert
const showFixedBottomAlert = (title, message, additionalMessage) => {
    const alertHTML = `
        <div class="alert py-2 m-0 bg-primary alert-dismissible fade show overflow-hidden position-fixed w-100 fixed-bottom-alert" role="alert" style="bottom: 0; left: 0; z-index: 1050; border-radius: 0;">
            <div class="flex-grow-1">
                <h5 class="text-white" style="font-size: 16px">${title}</h5>
                <p class="text-white mb-2">${message}</p>
            </div>
            <p class="text-white m-0" style="font-size: 13px;">
                ${additionalMessage}
            </p>
            <!-- Close button -->
            <button id="dontShowAgain" class="btn-close text-white p-3" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    // Append the alert to the body
    document.body.insertAdjacentHTML('beforeend', alertHTML);

    // Add an event listener to the close button
    const closeButton = document.querySelector('.fixed-bottom-alert .btn-close');
    closeButton.addEventListener('click', () => {
        const alertElement = document.querySelector('.fixed-bottom-alert');
        if (alertElement) {
            alertElement.remove(); // Remove the alert when the close button is clicked
        }
    });
};

// Function to check for permission changes
const checkPermissionChanges = () => {
    const lastPermission = localStorage.getItem('lastPermission'); // Get the last known permission state
    const currentPermission = Notification.permission; // Get the current permission state

    if (lastPermission !== currentPermission) {
        console.log('Permission state changed:', currentPermission);

        // If the permission was previously denied and is now reset (default or granted), clear the flag
        if (lastPermission === 'denied' && (currentPermission === 'default' || currentPermission === 'granted')) {
            localStorage.removeItem('notificationAlertDismissed'); // Clear the flag
            console.log('notificationAlertDismissed flag cleared.');
        }

        // Update the last known permission state
        localStorage.setItem('lastPermission', currentPermission);
    }
};

// Periodically check for permission changes (e.g., every 5 seconds)
setInterval(checkPermissionChanges, 5000);

// Initialize the last known permission state
if (!localStorage.getItem('lastPermission')) {
    localStorage.setItem('lastPermission', Notification.permission);
}

// Request notification permission with retry
const requestNotificationPermission = (messaging, registration) => {
    return Notification.requestPermission()
        .then(permission => {
            if (permission === 'granted') {
                return getToken(messaging, { serviceWorkerRegistration: registration, vapidKey })
                    .then(token => {
                        if (token) {
                            sendTokenToServer(token); // Send the token to the server
                        } else {
                            console.warn('No registration token available.');
                        }
                    })
                    .catch(error => {
                        console.error('Error retrieving FCM token:', error);
                    });
            } else if (permission === 'denied') {
                console.warn('User denied notification permissions.');
                // Show a fixed bottom alert for blocked notifications
                if (!localStorage.getItem('notificationAlertDismissed')) {
                    showFixedBottomAlert(
                        'Notifications Blocked',
                        'It looks like youâ€™ve blocked notifications. To receive important updates from us, youâ€™ll need to enable them.',
                        'Please go to your browser settings and allow notifications for this website.'
                    );

                    // Add a "Don't show again" button
                    const dontShowAgainButton = document.getElementById('dontShowAgain');
                    dontShowAgainButton.addEventListener('click', () => {
                        localStorage.setItem('notificationAlertDismissed', 'true');
                        document.querySelector('.fixed-bottom-alert').remove();
                    });
                }
                return null;
            } else {
                console.warn('User dismissed the permission prompt.');
                return null;
            }
        })
        .catch(error => {
            console.error('Error requesting notification permission:', error);
        });
};

// Function to send the FCM token to the server
const sendTokenToServer = (token) => {
    const requestBody = { token };

    fetch(`${BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(requestBody),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to send token to server. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
        })
        .catch(error => {
            console.error('Error sending token to server:', error.message);
        });
};

// Check if Service Worker is supported
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${BASE_URL}/notifications-sw.js`)
        .then(registration => {
            // Request notification permission
            return requestNotificationPermission(messaging, registration);
        })
        .catch(err => {
            console.error('Error during Service Worker registration:', err);
        });

    // Listen for incoming messages
    onMessage(messaging, payload => {
        if (payload.notification) {
            console.log('Notification received:', payload.notification);
            // Optionally display it using the Notification API
            new Notification(payload.notification.title, {
                body: payload.notification.body,
            });
        } else {
            console.warn('Received payload does not contain notification data:', payload);
        }
    });
} else {
    console.warn('Service Worker is not supported in this browser.');
    alert('Notifications are not supported in this browser.');
}