/**
 * Configuration and Constants
 * Contains all magic numbers, colors, and configuration values
 */

export const CONFIG = {
    // URL Configuration
    URL_BASE: 'https://pay.zenpay.com.au/setup/',
    URL_TRUNCATE_LENGTH: 100,
    URL_TRUNCATE_DISPLAY: 97,

    // Storage Keys
    STORAGE_KEY: 'merchantCode',

    // Colors
    COLORS: {
        PRIMARY: '#4a90e2',
        PRIMARY_HOVER: '#3a7cc0',
        ERROR: '#f44336',
        SUCCESS: '#4CAF50',
        SUCCESS_HOVER: '#45a049',
        TEXT: '#555',
        TEXT_LIGHT: '#777',
        BORDER: '#ddd',
        BACKGROUND: '#f5f5f5',
        CARD_BG: '#fcfcfc'
    },

    // Default Values
    DEFAULT_COUNTRY: 'Australia',
    DEFAULT_FREQUENCY: 'Monthly',
    DEFAULT_PAYMENT_METHOD: 'AutoPay',

    // Validation
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    POSTCODE_REGEX: /^\d{4}$/,
    MOBILE_REGEX: /^04\d{8}$/,
    MOBILE_REGEX_INTL: /^(\+61|0061)?4\d{8}$/,

    // Timing
    DEBOUNCE_DELAY: 300,
    TOOLTIP_DURATION: 2000,
    CACHE_DURATION: 60000, // 1 minute

    // Cookie Settings
    COOKIE_MAX_AGE: 10 * 365 * 24 * 60 * 60, // 10 years in seconds

    // Australian States
    STATES: ['NSW', 'VIC', 'QLD', 'ACT', 'NT', 'SA', 'WA', 'TAS', 'NZ']
};

// Frequency to days mapping
export const FREQUENCY_DAYS = {
    'Weekly': 7,
    'Fortnightly': 14,
    'Monthly': null // Special case - add months
};

// Error Messages
export const ERROR_MESSAGES = {
    EMAIL_INVALID: 'Please enter a valid email address',
    POSTCODE_INVALID: 'Australian postcode must be exactly 4 digits',
    MOBILE_INVALID: 'Please enter a valid Australian mobile number (e.g., 0412345678)',
    MERCHANT_CODE_REQUIRED: 'Please enter your merchant code before generating URL',
    URL_INVALID: 'Invalid payment URL',
    CALCULATION_ERROR: 'Error calculating payment details',
    STORAGE_ERROR: 'Error saving data',
    LOAD_ERROR: 'Error loading data'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    URL_COPIED: 'URL copied!',
    DATA_SAVED: 'Data saved successfully',
    DATA_CLEARED: 'All data cleared'
};
