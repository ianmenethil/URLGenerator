/**
 * UI Module
 * Handles all user interface interactions and DOM updates
 */

import { CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from './config.js';
import {
    formatAmount,
    formatDisplayDate,
    calculateInstallmentAmount,
    calculateEndDate
} from './calculations.js';
import { generateURL, truncateUrl, validatePaymentURL } from './url-generator.js';
import { sanitizeInput } from './validation.js';

// DOM element cache
let DOM = {};

/**
 * Cache DOM references for better performance
 */
export function cacheDOMReferences() {
    DOM = {
        form: document.getElementById('paymentForm'),
        frequency: document.getElementById('frequency'),
        installments: document.getElementById('numberOfInstallments'),
        startDate: document.getElementById('paymentStartDate'),
        totalAmount: document.getElementById('totalAmount'),
        endDate: document.getElementById('paymentEndDate'),
        installmentAmount: document.getElementById('installmentAmount'),
        url: document.getElementById('url'),
        urlTooltip: document.getElementById('url-tooltip'),
        merchantCode: document.getElementById('merchantCode'),
        openBtn: document.getElementById('openUrlBtn'),
        copyBtn: document.getElementById('copyUrlBtn'),
        copyTooltip: document.getElementById('copyTooltip'),
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email')
    };
}

/**
 * Debounce function for performance optimization
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Update all calculations and URL
 */
export function updateCalculations() {
    try {
        const frequency = DOM.frequency?.value;
        const installments = DOM.installments?.value;
        const startDate = DOM.startDate?.value;
        const totalAmount = DOM.totalAmount?.value;

        // Calculate installment amount
        if (totalAmount && installments) {
            const installmentAmt = calculateInstallmentAmount(totalAmount, installments);
            if (DOM.installmentAmount) {
                DOM.installmentAmount.value = installmentAmt;
            }
        }

        // Calculate end date and generate URL
        if (frequency && installments && startDate) {
            const endDate = calculateEndDate(frequency, startDate, installments);
            if (DOM.endDate) {
                DOM.endDate.value = endDate;
            }

            // Format start date for tooltip
            if (startDate) {
                const startDateObj = new Date(startDate);
                const formattedStartDate = formatDisplayDate(startDateObj);
                DOM.startDate?.setAttribute('title', formattedStartDate);
            }

            // Generate and display URL
            const merchantCode = DOM.merchantCode?.value || '';
            if (merchantCode) {
                const fullUrl = generateURL(DOM.form, merchantCode);
                if (DOM.url && DOM.urlTooltip) {
                    DOM.url.value = truncateUrl(fullUrl);
                    DOM.urlTooltip.textContent = fullUrl;
                }
                if (DOM.openBtn) {
                    DOM.openBtn.disabled = !fullUrl;
                }
            }
        }
    } catch (error) {
        console.error(ERROR_MESSAGES.CALCULATION_ERROR, error);
    }
}

// Create debounced version for input events
export const debouncedUpdateCalculations = debounce(updateCalculations, CONFIG.DEBOUNCE_DELAY);

/**
 * Handle amount field blur (format to 2 decimal places)
 */
export function handleAmountBlur() {
    if (DOM.totalAmount?.value) {
        DOM.totalAmount.value = formatAmount(DOM.totalAmount.value);
    }
}

/**
 * Open the generated URL in a new tab
 */
export function openUrl() {
    try {
        const fullUrl = DOM.urlTooltip?.textContent;

        if (!fullUrl || fullUrl === 'Full URL will appear here on hover') {
            alert('Please complete the form first to generate a payment URL.');
            return;
        }

        // Validate URL before opening
        if (!validatePaymentURL(fullUrl)) {
            alert(ERROR_MESSAGES.URL_INVALID);
            return;
        }

        window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
        console.error('Error opening URL:', error);
        alert(ERROR_MESSAGES.URL_INVALID);
    }
}

/**
 * Email payment link to customer
 */
export function emailLink() {
    try {
        const fullUrl = DOM.urlTooltip?.textContent;
        if (!fullUrl || fullUrl === 'Full URL will appear here on hover') {
            alert('Please complete the form first to generate a payment URL.');
            return;
        }

        // Sanitize inputs to prevent XSS
        const firstName = sanitizeInput(DOM.firstName?.value || 'Customer');
        const lastName = sanitizeInput(DOM.lastName?.value || '');
        const fullName = firstName + (lastName ? ' ' + lastName : '');
        const email = DOM.email?.value;
        const endDate = DOM.endDate?.value;
        const totalAmount = DOM.totalAmount?.value;
        const installmentAmount = DOM.installmentAmount?.value;
        const numberOfInstallments = DOM.installments?.value;
        const frequency = DOM.frequency?.value;

        const emailTemplate = `Dear ${fullName},

Thank you for choosing Zenith Payments for your payment solution.

Your payment plan has been set up with the following details:

- Total Amount: $${totalAmount}
- Payment Frequency: ${frequency}
- Number of Installments: ${numberOfInstallments}
- Each Installment Amount: $${installmentAmount}
- End Date: ${endDate}

To complete your payment setup, please:

1. Click here to access your secure payment portal:
   ${fullUrl}

2. Verify your information is correct
3. Enter your payment details
4. Confirm your payment schedule

If you have any questions, our support team is here to help.

Thank you for your business!

Regards,
Zenith Payments Team`;

        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent('Your Zenith Payment Plan')}&body=${encodeURIComponent(emailTemplate)}`;

        // Create hidden link to avoid navigation
        const link = document.createElement('a');
        link.href = mailtoLink;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error creating email link:', error);
        alert('Error creating email link. Please try again.');
    }
}

/**
 * Reset the form to initial state
 */
export function resetForm() {
    try {
        DOM.form?.reset();

        // Clear calculated fields
        if (DOM.endDate) DOM.endDate.value = '';
        if (DOM.installmentAmount) DOM.installmentAmount.value = '';
        if (DOM.url) DOM.url.value = '';
        if (DOM.urlTooltip) DOM.urlTooltip.textContent = 'Full URL will appear here on hover';
        if (DOM.openBtn) DOM.openBtn.disabled = true;

        // Reset to today's date
        const today = new Date();
        const formattedDate = today.toISOString().substring(0, 10);
        if (DOM.startDate) DOM.startDate.value = formattedDate;

        // Clear validation styles
        const inputs = DOM.form?.querySelectorAll('input');
        inputs?.forEach(input => {
            input.style.borderColor = '';
            input.setCustomValidity('');
            input.setAttribute('aria-invalid', 'false');
        });

        const emailValidation = document.getElementById('emailValidation');
        if (emailValidation) emailValidation.textContent = '';

        updateCalculations();
    } catch (error) {
        console.error('Error resetting form:', error);
    }
}

/**
 * Setup copy URL button functionality
 */
export function setupCopyButton() {
    if (!DOM.copyBtn) return;

    DOM.copyBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        event.stopPropagation();

        try {
            const textToCopy = DOM.urlTooltip?.textContent !== 'Full URL will appear here on hover'
                ? DOM.urlTooltip?.textContent
                : DOM.url?.value;

            if (textToCopy && textToCopy !== 'Full URL will appear here on hover') {
                await navigator.clipboard.writeText(textToCopy);

                // Show tooltip
                if (DOM.copyTooltip) {
                    DOM.copyTooltip.classList.add('visible');
                    setTimeout(() => {
                        DOM.copyTooltip.classList.remove('visible');
                    }, CONFIG.TOOLTIP_DURATION);
                }
            }
        } catch (error) {
            console.error('Could not copy text:', error);
            alert('Failed to copy URL. Please try again.');
        }

        return false;
    });
}

/**
 * Setup all form event listeners
 */
export function setupFormListeners() {
    if (!DOM.form) return;

    // Get all inputs except disabled and totalAmount
    const inputs = DOM.form.querySelectorAll('input:not([disabled]):not(#totalAmount), select');

    inputs.forEach(input => {
        input.addEventListener('change', updateCalculations);
        input.addEventListener('input', debouncedUpdateCalculations);
    });

    // Special handling for amount field
    if (DOM.totalAmount) {
        DOM.totalAmount.addEventListener('change', updateCalculations);
        DOM.totalAmount.addEventListener('blur', handleAmountBlur);
    }

    // Merchant field listeners
    if (DOM.merchantCode) {
        DOM.merchantCode.addEventListener('change', updateCalculations);
        DOM.merchantCode.addEventListener('input', debouncedUpdateCalculations);
    }

    // Open button
    if (DOM.openBtn) {
        DOM.openBtn.addEventListener('click', openUrl);
    }

    // Setup copy button
    setupCopyButton();

    // Initial calculation
    updateCalculations();
}

/**
 * Initialize today's date
 */
export function initializeTodayDate() {
    if (!DOM.startDate) return;

    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    DOM.startDate.value = formattedDate;

    const formattedDisplayDate = formatDisplayDate(today);
    DOM.startDate.setAttribute('title', formattedDisplayDate);
}
