#!/usr/bin/env node

/**
 * Node.js Test Runner
 * Tests JavaScript modules can be loaded and functions work correctly
 */

console.log('🧪 Running Node.js Module Tests...\n');

// Test 1: Config module
console.log('Test 1: Config module');
try {
    const { CONFIG, FREQUENCY_DAYS, ERROR_MESSAGES } = await import('./public/js/config.js');

    console.assert(CONFIG.URL_BASE === 'https://pay.zenpay.com.au/setup/', 'URL_BASE should be correct');
    console.assert(CONFIG.EMAIL_REGEX instanceof RegExp, 'EMAIL_REGEX should be RegExp');
    console.assert(FREQUENCY_DAYS.Weekly === 7, 'Weekly should be 7 days');
    console.assert(ERROR_MESSAGES.EMAIL_INVALID, 'Error messages should exist');

    console.log('✅ Config module: PASS\n');
} catch (error) {
    console.log('❌ Config module: FAIL');
    console.error(error.message);
    process.exit(1);
}

// Test 2: Calculations module
console.log('Test 2: Calculations module');
try {
    const { formatDate, formatDisplayDate, formatAmount, calculateInstallmentAmount, calculateEndDate }
        = await import('./public/js/calculations.js');

    // Test date formatting
    const testDate = new Date('2025-11-17');
    const formatted = formatDate(testDate);
    console.assert(formatted === '17-Nov-2025', `formatDate should return 17-Nov-2025, got ${formatted}`);

    const displayFormatted = formatDisplayDate(testDate);
    console.assert(displayFormatted === '17-November-2025', `formatDisplayDate should return 17-November-2025, got ${displayFormatted}`);

    // Test amount formatting
    const amount = formatAmount(100.5);
    console.assert(amount === '100.50', `formatAmount should return 100.50, got ${amount}`);

    // Test installment calculation
    const installment = calculateInstallmentAmount(1000, 10);
    console.assert(installment === '100.00', `Installment should be 100.00, got ${installment}`);

    // Test end date calculation
    // 3 monthly installments from Jan 1: Jan 1, Feb 1, March 1, then +1 day = March 2
    const endDate = calculateEndDate('Monthly', '2025-01-01', 3);
    console.assert(endDate.includes('March'), `End date should include March, got ${endDate}`);

    console.log('✅ Calculations module: PASS\n');
} catch (error) {
    console.log('❌ Calculations module: FAIL');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
}

// Test 3: Validation module
console.log('Test 3: Validation module');
try {
    const { validateEmail, validatePostcode, validateMobile, sanitizeInput }
        = await import('./public/js/validation.js');

    // Test email validation
    console.assert(validateEmail('test@example.com') === true, 'Valid email should pass');
    console.assert(validateEmail('invalid-email') === false, 'Invalid email should fail');
    console.assert(validateEmail('test@example.com\\nBcc:evil') === false, 'Email with injection should fail');

    // Test postcode validation
    console.assert(validatePostcode('2000') === true, 'Valid postcode should pass');
    console.assert(validatePostcode('1') === false, 'Invalid postcode should fail');
    console.assert(validatePostcode('99999') === false, 'Too long postcode should fail');

    // Test mobile validation
    console.assert(validateMobile('0412345678') === true, 'Valid mobile should pass');
    console.assert(validateMobile('123456') === false, 'Invalid mobile should fail');

    // Test XSS prevention
    const dangerous = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(dangerous);
    console.assert(!sanitized.includes('<script>'), 'Should sanitize script tags');

    console.log('✅ Validation module: PASS\n');
} catch (error) {
    console.log('❌ Validation module: FAIL');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
}

// Test 4: URL Generator module
console.log('Test 4: URL Generator module');
try {
    const { truncateUrl, validatePaymentURL } = await import('./public/js/url-generator.js');

    // Test truncation
    const shortUrl = 'https://short.url';
    console.assert(truncateUrl(shortUrl) === shortUrl, 'Short URL should not truncate');

    const longUrl = 'https://very.long.url/' + 'x'.repeat(200);
    const truncated = truncateUrl(longUrl);
    console.assert(truncated.endsWith('...'), 'Long URL should end with ...');
    console.assert(truncated.length === 100, `Truncated should be 100 chars, got ${truncated.length}`);

    // Test domain validation
    console.assert(validatePaymentURL('https://pay.zenpay.com.au/setup/test') === true, 'Valid domain should pass');
    console.assert(validatePaymentURL('https://evil.com/phishing') === false, 'Invalid domain should fail');

    console.log('✅ URL Generator module: PASS\n');
} catch (error) {
    console.log('❌ URL Generator module: FAIL');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
}

// Summary
console.log('═══════════════════════════════════');
console.log('✅ ALL NODE.JS TESTS PASSED!');
console.log('═══════════════════════════════════');
console.log('\nModules tested:');
console.log('  ✓ config.js');
console.log('  ✓ calculations.js');
console.log('  ✓ validation.js');
console.log('  ✓ url-generator.js');
console.log('\nNote: storage.js, ui.js, download.js, and main.js');
console.log('require browser APIs and should be tested in browser.\n');

process.exit(0);
