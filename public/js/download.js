/**
 * Download Module
 * Handles HTML file download functionality
 */

import { CONFIG } from './config.js';

/**
 * Get standalone script content for downloaded HTML
 * @returns {string}
 */
function getStandaloneScript() {
    return `
// Standalone ZenPay Payment Form Script
function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return \`\${day}-\${month}-\${year}\`;
}

function formatDisplayDate(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return \`\${day}-\${month}-\${year}\`;
}

function formatAmount(amount) {
    return parseFloat(amount).toFixed(2);
}

function calculateInstallmentAmount(totalAmount, installments) {
    if (!totalAmount || !installments || installments < 1) return '';
    const amount = parseFloat(totalAmount) / parseInt(installments);
    return formatAmount(amount);
}

function calculateEndDate(frequency, startDate, installments) {
    const start = new Date(startDate);
    const numInstallments = parseInt(installments);
    let end = new Date(start);

    if (frequency === 'Monthly') {
        end.setMonth(end.getMonth() + (numInstallments - 1));
    } else if (frequency === 'Fortnightly') {
        end.setDate(end.getDate() + 14 * (numInstallments - 1));
    } else if (frequency === 'Weekly') {
        end.setDate(end.getDate() + 7 * (numInstallments - 1));
    } else {
        return 'Unsupported Frequency';
    }

    end.setDate(end.getDate() + 1);
    return formatDisplayDate(end);
}

function generateURL() {
    const form = document.getElementById('paymentForm');
    const formData = new FormData(form);
    const merchantCode = document.getElementById('merchantCode').value || '';
    let url = '${CONFIG.URL_BASE}' + merchantCode + '?';
    const params = [];

    const paymentMethod = document.getElementById('paymentMethod').value;
    params.push(\`paymentMethod=\${encodeURIComponent(paymentMethod)}\`);

    formData.forEach((value, key) => {
        if (key === 'TotalAmount' || key === 'NumberOfInstallments' || key === 'InstallmentAmount' || key === 'MerchantCode') {
            return;
        }

        if (key === 'PaymentStartDate') {
            const dateValue = formatDisplayDate(new Date(value));
            params.push(\`\${key}=\${encodeURIComponent(dateValue)}\`);
        } else {
            params.push(\`\${key}=\${encodeURIComponent(value)}\`);
        }
    });

    const endDateValue = document.getElementById('paymentEndDate').value;
    if (endDateValue) {
        params.push(\`PaymentEndDate=\${encodeURIComponent(endDateValue)}\`);
    }

    const installmentAmountValue = document.getElementById('installmentAmount').value;
    if (installmentAmountValue) {
        params.push(\`PaymentAmount=\${encodeURIComponent(installmentAmountValue)}\`);
    }

    return url + params.join('&');
}

function truncateUrl(url) {
    if (!url) return '';
    if (url.length <= 100) return url;
    return url.substring(0, 97) + '...';
}

function updateCalculations() {
    const frequency = document.getElementById('frequency').value;
    const installments = document.getElementById('numberOfInstallments').value;
    const startDate = document.getElementById('paymentStartDate').value;
    const totalAmount = document.getElementById('totalAmount').value;

    if (totalAmount && installments) {
        const installmentAmt = calculateInstallmentAmount(totalAmount, installments);
        document.getElementById('installmentAmount').value = installmentAmt;
    }

    if (frequency && installments && startDate) {
        const endDate = calculateEndDate(frequency, startDate, installments);
        document.getElementById('paymentEndDate').value = endDate;

        if (startDate) {
            const startDateObj = new Date(startDate);
            const formattedStartDate = formatDisplayDate(startDateObj);
            document.getElementById('paymentStartDate').setAttribute('title', formattedStartDate);
        }

        const fullUrl = generateURL();
        const urlField = document.getElementById('url');
        const urlTooltip = document.getElementById('url-tooltip');

        urlField.value = truncateUrl(fullUrl);
        urlTooltip.textContent = fullUrl;
        document.getElementById('openUrlBtn').disabled = !fullUrl;
    }
}

function handleAmountBlur() {
    const amountField = document.getElementById('totalAmount');
    if (amountField.value) {
        amountField.value = formatAmount(amountField.value);
    }
}

function openUrl() {
    const urlTooltip = document.getElementById('url-tooltip');
    const fullUrl = urlTooltip.textContent;

    if (fullUrl && fullUrl !== 'Full URL will appear here on hover') {
        window.open(fullUrl, '_blank');
    }
}

function emailLink() {
    const urlTooltip = document.getElementById('url-tooltip');
    const fullUrl = urlTooltip.textContent;
    if (fullUrl && fullUrl !== 'Full URL will appear here on hover') {
        const firstName = document.getElementById('firstName').value || 'Customer';
        const lastName = document.getElementById('lastName').value || '';
        const fullName = firstName + (lastName ? ' ' + lastName : '');
        const email = document.getElementById('email').value;
        const endDate = document.getElementById('paymentEndDate').value;
        const totalAmount = document.getElementById('totalAmount').value;
        const installmentAmount = document.getElementById('installmentAmount').value;
        const numberOfInstallments = document.getElementById('numberOfInstallments').value;
        const frequency = document.getElementById('frequency').value;

        const emailTemplate = \`Dear \${fullName},

Thank you for choosing Zenith Payments for your payment solution.

Your payment plan has been set up with the following details:

- Total Amount: $\${totalAmount}
- Payment Frequency: \${frequency}
- Number of Installments: \${numberOfInstallments}
- Each Installment Amount: $\${installmentAmount}
- End Date: \${endDate}

To complete your payment setup, please:

1. Click here to access your secure payment portal:
   \${fullUrl}

2. Verify your information is correct
3. Enter your payment details
4. Confirm your payment schedule

If you have any questions, our support team is here to help.

Thank you for your business!

Regards,
Zenith Payments Team\`;

        const mailtoLink = \`mailto:\${email}?subject=Your Zenith Payment Plan&body=\${encodeURIComponent(emailTemplate)}\`;
        window.location.href = mailtoLink;
    } else {
        alert('Please complete the form first to generate a payment URL.');
    }
}

function resetForm() {
    const form = document.getElementById('paymentForm');
    form.reset();

    document.getElementById('paymentEndDate').value = '';
    document.getElementById('installmentAmount').value = '';
    document.getElementById('url').value = '';
    document.getElementById('url-tooltip').textContent = 'Full URL will appear here on hover';
    document.getElementById('openUrlBtn').disabled = true;

    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    document.getElementById('paymentStartDate').value = formattedDate;

    updateCalculations();
}

document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    document.getElementById('paymentStartDate').value = formattedDate;

    const form = document.getElementById('paymentForm');
    const inputs = form.querySelectorAll('input:not([disabled]):not(#totalAmount), select');

    inputs.forEach(input => {
        input.addEventListener('change', updateCalculations);
        input.addEventListener('input', updateCalculations);
    });

    const amountField = document.getElementById('totalAmount');
    amountField.addEventListener('change', updateCalculations);
    amountField.addEventListener('blur', handleAmountBlur);

    const merchantField = document.getElementById('merchantCode');
    if (merchantField) {
        merchantField.addEventListener('change', updateCalculations);
        merchantField.addEventListener('input', updateCalculations);
    }

    document.getElementById('openUrlBtn').addEventListener('click', openUrl);

    updateCalculations();
});
`;
}

/**
 * Remove download button from cloned document
 * @param {Document} doc
 */
function removeDownloadButton(doc) {
    const downloadBtn = doc.querySelector('#downloadBtn');
    if (downloadBtn) {
        downloadBtn.parentNode.removeChild(downloadBtn);
    }
}

/**
 * Restructure section header
 * @param {Document} doc
 */
function restructureSectionHeader(doc) {
    const sectionHeader = doc.querySelector('.section-header');
    if (sectionHeader) {
        const sectionTitle = sectionHeader.querySelector('.section-title');
        if (sectionTitle && sectionHeader.parentNode) {
            sectionHeader.parentNode.insertBefore(sectionTitle, sectionHeader);
            sectionHeader.parentNode.removeChild(sectionHeader);
        }
    }
}

/**
 * Set merchant code value in HTML
 * @param {Document} doc
 */
function setMerchantCodeValue(doc) {
    const currentMerchantCode = document.getElementById('merchantCode')?.value || '';
    const merchantCodeInput = doc.querySelector('#merchantCode');
    if (merchantCodeInput) {
        merchantCodeInput.value = currentMerchantCode;
        merchantCodeInput.setAttribute('value', currentMerchantCode);
    }
}

/**
 * Remove storage-related scripts
 * @param {Document} doc
 */
function removeStorageScripts(doc) {
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(script => {
        // Remove module scripts and storage-related scripts
        if (script.type === 'module' ||
            script.textContent.includes('merchantCode') ||
            script.textContent.includes('IndexedDB') ||
            script.textContent.includes('ensurePersistence') ||
            script.textContent.includes('clearMerchantStorage') ||
            script.textContent.includes('openSettingsDB')) {
            script.parentNode.removeChild(script);
        }
    });
}

/**
 * Inject standalone script
 * @param {Document} doc
 */
function injectStandaloneScript(doc) {
    const script = doc.createElement('script');
    script.textContent = getStandaloneScript();
    doc.querySelector('body').appendChild(script);
}

/**
 * Inline CSS from external files
 * @param {Document} doc
 */
function inlineCSS(doc) {
    // Remove link tags
    const linkTags = doc.querySelectorAll('link[rel="stylesheet"]');
    linkTags.forEach(link => link.parentNode.removeChild(link));

    // Create style tag with all CSS
    const style = doc.createElement('style');
    style.textContent = `
        /* Inlined CSS from external files would go here */
        /* For now, we'll need to read the CSS files */
    `;
    doc.querySelector('head').appendChild(style);
}

/**
 * Download HTML file with all necessary code embedded
 */
export async function downloadHtmlFile() {
    try {
        // Clone the document
        const documentClone = document.documentElement.cloneNode(true);

        // Process the clone
        removeDownloadButton(documentClone);
        restructureSectionHeader(documentClone);
        setMerchantCodeValue(documentClone);
        removeStorageScripts(documentClone);
        injectStandaloneScript(documentClone);

        // Create HTML content
        const htmlContent = '<!DOCTYPE html>\n' + documentClone.outerHTML;

        // Create and trigger download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'ZenPayURLGenerator.html';

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
        console.error('Error downloading HTML file:', error);
        alert('Error creating download. Please try again.');
    }
}

/**
 * Setup download button
 */
export function setupDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadHtmlFile);
    }
}
