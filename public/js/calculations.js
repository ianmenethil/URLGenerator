/**
 * Calculations Module
 * Handles date formatting and payment calculations
 */

import { FREQUENCY_DAYS } from './config.js';

/**
 * Format date as "DD-Mon-YYYY" (e.g., "17-Nov-2025")
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

/**
 * Format date as "DD-Month-YYYY" (e.g., "17-November-2025")
 * @param {Date} date
 * @returns {string}
 */
export function formatDisplayDate(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

/**
 * Format amount to 2 decimal places
 * @param {number|string} amount
 * @returns {string}
 */
export function formatAmount(amount) {
    return parseFloat(amount).toFixed(2);
}

/**
 * Calculate installment amount
 * @param {number|string} totalAmount
 * @param {number|string} installments
 * @returns {string}
 */
export function calculateInstallmentAmount(totalAmount, installments) {
    if (!totalAmount || !installments || installments < 1) return '';
    const amount = parseFloat(totalAmount) / parseInt(installments);
    return formatAmount(amount);
}

/**
 * Calculate payment end date based on frequency
 * @param {string} frequency - "Monthly", "Fortnightly", or "Weekly"
 * @param {string|Date} startDate - Start date
 * @param {number|string} installments - Number of installments
 * @returns {string} Formatted end date
 */
export function calculateEndDate(frequency, startDate, installments) {
    try {
        const start = new Date(startDate);
        const numInstallments = parseInt(installments);

        if (isNaN(start.getTime()) || numInstallments < 1) {
            return '';
        }

        let end = new Date(start);

        if (frequency === 'Monthly') {
            end.setMonth(end.getMonth() + (numInstallments - 1));
        } else if (frequency === 'Fortnightly') {
            end.setDate(end.getDate() + FREQUENCY_DAYS['Fortnightly'] * (numInstallments - 1));
        } else if (frequency === 'Weekly') {
            end.setDate(end.getDate() + FREQUENCY_DAYS['Weekly'] * (numInstallments - 1));
        } else {
            return 'Unsupported Frequency';
        }

        // Add one day
        end.setDate(end.getDate() + 1);

        return formatDisplayDate(end);
    } catch (error) {
        console.error('Error calculating end date:', error);
        return '';
    }
}

/**
 * Get current date formatted for input[type="date"]
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export function getCurrentDateForInput() {
    const today = new Date();
    return today.toISOString().substring(0, 10);
}

/**
 * Get today's date as Date object
 * @returns {Date}
 */
export function getTodayDate() {
    return new Date();
}
