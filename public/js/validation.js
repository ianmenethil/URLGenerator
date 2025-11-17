/**
 * Validation Module
 * Handles all form field validation and input sanitization
 */

import { CONFIG, ERROR_MESSAGES } from './config.js';

/**
 * Sanitize input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
    if (!input) return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Validate email address
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
    if (!email) return false;
    // Check for header injection attempts
    if (email.includes('\n') || email.includes('\r') ||
        email.includes('%0a') || email.includes('%0d')) {
        return false;
    }
    return CONFIG.EMAIL_REGEX.test(email);
}

/**
 * Validate Australian postcode
 * @param {string} postcode
 * @returns {boolean}
 */
export function validatePostcode(postcode) {
    if (!postcode) return false;
    if (!CONFIG.POSTCODE_REGEX.test(postcode)) return false;
    const num = parseInt(postcode);
    return num >= 200 && num <= 9999;
}

/**
 * Validate Australian mobile number
 * @param {string} mobile
 * @returns {boolean}
 */
export function validateMobile(mobile) {
    if (!mobile) return false;
    return CONFIG.MOBILE_REGEX.test(mobile) || CONFIG.MOBILE_REGEX_INTL.test(mobile);
}

/**
 * Setup email validation
 * @param {HTMLInputElement} emailInput
 * @param {HTMLElement} validationEl
 */
export function setupEmailValidation(emailInput, validationEl) {
    const validate = () => {
        if (emailInput.value.length > 0) {
            if (!validateEmail(emailInput.value)) {
                emailInput.setCustomValidity(ERROR_MESSAGES.EMAIL_INVALID);
                emailInput.style.borderColor = CONFIG.COLORS.ERROR;
                emailInput.setAttribute('aria-invalid', 'true');
                if (validationEl) {
                    validationEl.textContent = ERROR_MESSAGES.EMAIL_INVALID;
                    validationEl.style.color = CONFIG.COLORS.ERROR;
                }
            } else {
                emailInput.setCustomValidity('');
                emailInput.style.borderColor = CONFIG.COLORS.PRIMARY;
                emailInput.setAttribute('aria-invalid', 'false');
                if (validationEl) {
                    validationEl.textContent = '';
                }
            }
        } else {
            emailInput.setCustomValidity('');
            emailInput.style.borderColor = '';
            emailInput.setAttribute('aria-invalid', 'false');
            if (validationEl) {
                validationEl.textContent = '';
            }
        }
    };

    emailInput.addEventListener('blur', validate);
    emailInput.addEventListener('input', validate);
}

/**
 * Setup postcode validation
 * @param {HTMLInputElement} postcodeInput
 */
export function setupPostcodeValidation(postcodeInput) {
    // Prevent non-numeric input
    postcodeInput.addEventListener('keypress', function(event) {
        if (!/^\d$/.test(event.key) && !/^Arrow|Backspace|Delete|Tab|Enter$/.test(event.key)) {
            event.preventDefault();
        }
    });

    // Sanitize input
    postcodeInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
    });

    // Validate on blur
    postcodeInput.addEventListener('blur', function() {
        if (this.value && !validatePostcode(this.value)) {
            this.setCustomValidity(ERROR_MESSAGES.POSTCODE_INVALID);
            this.style.borderColor = CONFIG.COLORS.ERROR;
            this.setAttribute('aria-invalid', 'true');
        } else {
            this.setCustomValidity('');
            this.style.borderColor = '';
            this.setAttribute('aria-invalid', 'false');
        }
    });
}

/**
 * Setup mobile number validation
 * @param {HTMLInputElement} mobileInput
 */
export function setupMobileValidation(mobileInput) {
    // Prevent non-numeric input
    mobileInput.addEventListener('keypress', function(event) {
        if (!/^\d$/.test(event.key) && !/^Arrow|Backspace|Delete|Tab|Enter$/.test(event.key)) {
            event.preventDefault();
        }
    });

    // Sanitize input
    mobileInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
    });

    // Validate on blur
    mobileInput.addEventListener('blur', function() {
        if (this.value && !validateMobile(this.value)) {
            this.setCustomValidity(ERROR_MESSAGES.MOBILE_INVALID);
            this.style.borderColor = CONFIG.COLORS.ERROR;
            this.setAttribute('aria-invalid', 'true');
        } else {
            this.setCustomValidity('');
            this.style.borderColor = '';
            this.setAttribute('aria-invalid', 'false');
        }
    });
}

/**
 * Setup all form validations
 */
export function setupFormValidation() {
    const emailInput = document.getElementById('email');
    const emailValidation = document.getElementById('emailValidation');
    const postcodeInput = document.getElementById('postcode');
    const mobileInput = document.getElementById('mobile');

    if (emailInput) setupEmailValidation(emailInput, emailValidation);
    if (postcodeInput) setupPostcodeValidation(postcodeInput);
    if (mobileInput) setupMobileValidation(mobileInput);
}
