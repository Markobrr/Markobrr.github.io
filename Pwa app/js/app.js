// Global variables
let deferredPrompt;
const installPrompt = document.getElementById('install-prompt');
const installButton = document.getElementById('install-button');
const closePromptButton = document.getElementById('close-prompt');

// Initialize the app
function initApp() {
    console.log('Initializing app...');

    // Set up install prompt
    if (installButton) {
        installButton.addEventListener('click', installApp);
    }

    if (closePromptButton) {
        closePromptButton.addEventListener('click', closeInstallPrompt);
    }

    // Add fade-in animation to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }

    // Set up icon click handlers
    setupIconHandlers();
}

// Handle the installation prompt
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();

    // Stash the event so it can be triggered later
    deferredPrompt = e;

    // Show the install prompt
    if (installPrompt) {
        installPrompt.classList.add('show');
    }
});

// Install the app
function installApp() {
    if (!deferredPrompt) {
        console.log('Installation prompt not available');
        return;
    }

    // Show the installation prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the saved prompt
        deferredPrompt = null;

        // Hide the install prompt
        if (installPrompt) {
            installPrompt.classList.remove('show');
        }
    });
}

// Close the install prompt
function closeInstallPrompt() {
    if (installPrompt) {
        installPrompt.classList.remove('show');
    }
}

// Check if the app was installed
window.addEventListener('appinstalled', () => {
    console.log('App was installed');

    // Hide the install prompt
    if (installPrompt) {
        installPrompt.classList.remove('show');
    }
});

// Set up icon click handlers
function setupIconHandlers() {
    const iconItems = document.querySelectorAll('.icon-item');

    // Set the first item as active by default
    if (iconItems.length > 0) {
        iconItems[0].classList.add('active');
    }

    iconItems.forEach(item => {
        item.addEventListener('click', () => {
            const icon = item.querySelector('.feature-icon');
            if (icon) {
                const featureId = icon.getAttribute('data-feature');
                showFeature(featureId, item);
            }
        });
    });
}

// Show a feature
function showFeature(featureId, clickedItem) {
    console.log(`Showing feature: ${featureId}`);

    // Here you would add code to show a specific feature
    const featureElement = document.getElementById(featureId);

    if (featureElement) {
        // Remove active class from all cards and menu items
        document.querySelectorAll('.feature-card').forEach(card => {
            card.classList.remove('active');
        });

        document.querySelectorAll('.icon-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to the selected card and menu item
        featureElement.classList.add('active');

        if (clickedItem) {
            clickedItem.classList.add('active');

            // Add a small animation to the clicked item
            clickedItem.style.transform = 'scale(1.05)';
            setTimeout(() => {
                clickedItem.style.transform = '';
            }, 300);
        } else {
            // If called from elsewhere (like the Learn More button), find and activate the corresponding menu item
            const correspondingItem = document.querySelector(`.icon-item .feature-icon[data-feature="${featureId}"]`);
            if (correspondingItem) {
                const parentItem = correspondingItem.closest('.icon-item');
                parentItem.classList.add('active');

                // Ensure the item is visible
                parentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        // Scroll to the feature with a small delay to allow the menu animation to complete
        setTimeout(() => {
            featureElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
