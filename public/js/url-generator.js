/**
 * URL Generator Module
 * Handles generation and validation of payment URLs
 */

import { CONFIG, ERROR_MESSAGES } from './config.js';
import { formatDisplayDate } from './calculations.js';

/**
 * Truncate URL for display
 * @param {string} url
 * @returns {string}
 */
export function truncateUrl(url) {
    if (!url) return '';
    if (url.length <= CONFIG.URL_TRUNCATE_LENGTH) return url;
    return url.substring(0, CONFIG.URL_TRUNCATE_DISPLAY) + '...';
}

/**
 * Validate payment URL domain
 * @param {string} url
 * @returns {boolean}
 */
export function validatePaymentURL(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname === 'pay.zenpay.com.au';
    } catch (error) {
        return false;
    }
}

/**
 * Generate payment URL from form data
 * @param {HTMLFormElement} form - The payment form
 * @param {string} merchantCode - Merchant code
 * @returns {string} Generated URL
 */
export function generateURL(form, merchantCode) {
    try {
        const formData = new FormData(form);
        let url = CONFIG.URL_BASE + merchantCode + '?';
        const params = [];

        // Add payment method
        const paymentMethod = document.getElementById('paymentMethod')?.value || CONFIG.DEFAULT_PAYMENT_METHOD;
        params.push(`paymentMethod=${encodeURIComponent(paymentMethod)}`);

        // Process form data
        formData.forEach((value, key) => {
            // Skip these fields (they're calculated or merchant code)
            if (key === 'TotalAmount' ||
                key === 'NumberOfInstallments' ||
                key === 'InstallmentAmount' ||
                key === 'MerchantCode') {
                return;
            }

            // Special handling for payment start date
            if (key === 'PaymentStartDate') {
                const dateValue = formatDisplayDate(new Date(value));
                params.push(`${key}=${encodeURIComponent(dateValue)}`);
            } else if (key === 'frequency') {
                params.push(`${key}=${encodeURIComponent(value)}`);
            } else {
                params.push(`${key}=${encodeURIComponent(value)}`);
            }
        });

        // Add calculated fields
        const endDateValue = document.getElementById('paymentEndDate')?.value;
        if (endDateValue) {
            params.push(`PaymentEndDate=${encodeURIComponent(endDateValue)}`);
        }

        const installmentAmountValue = document.getElementById('installmentAmount')?.value;
        if (installmentAmountValue) {
            params.push(`PaymentAmount=${encodeURIComponent(installmentAmountValue)}`);
        }

        return url + params.join('&');
    } catch (error) {
        console.error('Error generating URL:', error);
        return '';
    }
}
