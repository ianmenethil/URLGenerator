/**
 * Main Entry Point
 * Orchestrates all modules and initializes the application
 */

import { loadMerchantCode, saveMerchantCode, clearMerchantStorage } from './storage.js';
import { setupFormValidation } from './validation.js';
import {
    cacheDOMReferences,
    setupFormListeners,
    initializeTodayDate,
    emailLink,
    resetForm
} from './ui.js';
import { setupDownloadButton } from './download.js';

/**
 * Initialize merchant code functionality
 */
async function initializeMerchantCode() {
    const merchantField = document.getElementById('merchantCode');
    if (!merchantField) return;

    try {
        // Load saved merchant code
        const savedData = await loadMerchantCode();
        if (savedData.merchantcode) {
            merchantField.value = savedData.merchantcode;
        }

        // Save on blur
        merchantField.addEventListener('blur', async function() {
            try {
                await saveMerchantCode(merchantField.value);
            } catch (error) {
                console.error('Failed to save merchant code:', error);
            }
        });
    } catch (error) {
        console.error('Failed to initialize merchant code:', error);
    }
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Ctrl+Alt+Shift+C: Clear merchant storage
        if (event.ctrlKey && event.altKey && event.shiftKey && event.key === 'C') {
            clearMerchantStorage();
            const merchantField = document.getElementById('merchantCode');
            if (merchantField) {
                merchantField.value = '';
            }
            event.preventDefault();
        }
    });
}

/**
 * Setup global button handlers
 */
function setupGlobalHandlers() {
    // Email button
    const emailBtn = document.querySelector('.action-button:not(.reset)');
    if (emailBtn) {
        emailBtn.addEventListener('click', emailLink);
    }

    // Reset button
    const resetBtn = document.querySelector('.action-button.reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetForm);
    }

    // Download button
    setupDownloadButton();
}

/**
 * Main initialization function
 */
async function init() {
    try {
        console.log('🚀 Initializing ZenPay Payment Form...');

        // Cache DOM references first
        cacheDOMReferences();

        // Initialize merchant code storage
        await initializeMerchantCode();

        // Setup validation
        setupFormValidation();

        // Initialize today's date
        initializeTodayDate();

        // Setup form listeners and calculations
        setupFormListeners();

        // Setup keyboard shortcuts
        setupKeyboardShortcuts();

        // Setup global button handlers
        setupGlobalHandlers();

        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        alert('An error occurred while loading the form. Please refresh the page.');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already ready
    init();
}

// Export for testing
export { init };
