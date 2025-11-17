# CLAUDE.md - AI Assistant Development Guide

## Project Overview

**Project Name:** ZenPay Payment Form URL Generator
**Purpose:** A web-based form that generates customized payment URLs for ZenPay's payment processing platform
**Type:** Static single-page application
**Deployment:** Netlify

This application allows users to input customer and payment details, which are then used to generate a pre-filled URL for the ZenPay payment portal. The form includes features for email integration, data persistence, and form downloading.

## Repository Structure

```
URLGenerator/
├── .git/                  # Git version control
├── .gitignore            # Git ignore patterns
├── netlify.toml          # Netlify deployment configuration
├── public/               # Public web assets
│   └── index.html       # Main application (single-page app)
└── CLAUDE.md            # This file - AI assistant guide
```

### Key Files

- **`public/index.html`** (1575 lines): The entire application in a single HTML file containing:
  - Embedded CSS styles (lines 8-619)
  - HTML form structure (lines 622-815)
  - Multiple JavaScript modules (lines 816-1572)

## Technologies & Architecture

### Frontend Stack

- **HTML5**: Semantic markup with form validation
- **CSS3**:
  - CSS Grid for responsive layouts
  - Flexbox for component alignment
  - CSS transitions and animations
  - Mobile-first responsive design
- **Vanilla JavaScript**: No frameworks or libraries
  - ES6+ features (async/await, arrow functions, template literals)
  - DOM manipulation
  - Event-driven architecture

### Data Persistence

The application uses a **triple-redundancy storage strategy** for merchant codes:

1. **IndexedDB** (`settingsDB` database, `config` object store)
2. **LocalStorage** (key: `merchantCode`)
3. **Cookies** (10-year expiration)

**Storage Functions** (lines 845-921):
- `ensurePersistence()`: Requests persistent storage permissions
- `openSettingsDB()`: Opens/creates IndexedDB database
- `idbPut(key, value)`: Stores data in IndexedDB
- `idbGet(key)`: Retrieves data from IndexedDB
- `setCookie(key, value)`: Stores data in cookies
- `getCookie(key)`: Retrieves data from cookies
- `saveToStores(val)`: Saves to all three storage mechanisms
- `loadFromStores()`: Loads from all three, syncing if inconsistent
- `saveMerchantCode({merchantcode})`: High-level save function
- `loadMerchantCode()`: High-level load function

### Special Features

**Secret Storage Clear Command** (lines 1006-1011):
- Keyboard shortcut: `Ctrl + Alt + Shift + C`
- Clears all stored merchant codes from all storage mechanisms

## Code Patterns & Conventions

### 1. Form Structure

The form is organized into **sections** with consistent styling:

```html
<div class="section full-width">
    <h2 class="section-title">
        <i class="icon">👤</i>
        Section Title
    </h2>
    <div class="section-grid" style="grid-template-columns: repeat(3, 1fr)">
        <!-- Field containers -->
    </div>
</div>
```

### 2. Field Container Pattern

Each input field uses a **floating label pattern**:

```html
<div class="field-container">
    <input type="text" id="fieldId" name="FieldName" placeholder=" " required />
    <label for="fieldId">Field Label</label>
</div>
```

The label floats up when the input is focused or filled (CSS transitions lines 88-109).

### 3. Validation Pattern

**Email Validation** (lines 924-959):
- Real-time validation on input and blur events
- Regex pattern: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
- Visual feedback with border color changes
- Custom validation messages

**Numeric-Only Fields** (lines 1016-1059):
- Postcode and Mobile fields
- Prevents non-numeric input via keypress event
- Input sanitization on blur

### 4. Date Formatting

**Two Date Format Functions**:
- `formatDate(date)`: Returns "DD-Mon-YYYY" (e.g., "17-Nov-2025")
- `formatDisplayDate(date)`: Returns "DD-Month-YYYY" (e.g., "17-November-2025")

### 5. Calculation Logic

**Payment Calculations** (lines 1082-1126):
- `calculateInstallmentAmount(totalAmount, installments)`: Divides total by installments
- `calculateEndDate(frequency, startDate, installments)`: Calculates end date based on:
  - Monthly: Adds months
  - Fortnightly: Adds 14-day intervals
  - Weekly: Adds 7-day intervals

**Auto-Update System** (lines 1172-1203):
- `updateCalculations()`: Central function that updates:
  - Installment amount
  - Payment end date
  - Generated URL
  - Button states

### 6. URL Generation

**URL Structure** (lines 1128-1164):
```
https://pay.zenpay.com.au/setup/{merchantCode}?param1=value1&param2=value2...
```

**Excluded from URL**:
- TotalAmount
- NumberOfInstallments
- InstallmentAmount
- MerchantCode

**Included in URL**:
- All form fields except excluded ones
- PaymentEndDate (calculated)
- PaymentAmount (installment amount)

**URL Truncation** (lines 1166-1170):
- Displayed URL is truncated to 100 characters with "..." suffix
- Full URL shown in tooltip on hover

### 7. Form Download Feature

**Download Functionality** (lines 1227-1418):
1. Clones the entire document
2. Removes download button from clone
3. Sets merchant code value in HTML
4. Removes persistence-related scripts
5. Injects standalone script with all necessary functions
6. Creates and downloads as "ZenPayURLGenerator.html"

**Purpose**: Creates a portable, standalone version of the form with the merchant code pre-filled.

### 8. Email Integration

**Email Template** (lines 1491-1540):
- Uses `mailto:` links
- Pre-fills email body with payment details
- Includes personalized greeting
- Lists all payment plan details
- Includes the generated URL

## Form Fields Reference

### Personal Details Section
- `firstName` (text, required)
- `lastName` (text, required)
- `customerReference` (text, required)
- `email` (email, required, validated)
- `mobile` (tel, required, numeric only)
- `companyName` (text, optional)

### Contact Details Section
- `address1` (text, required)
- `address2` (text, required)
- `suburb` (text, required)
- `postcode` (text, required, numeric only)
- `country` (text, required, default: "Australia")
- `state` (select, required, options: NSW, VIC, QLD, ACT, NT, SA, WA, TAS, NZ)

### Payment Details Section
- `frequency` (select, required, options: Monthly/Weekly/Fortnightly, default: Monthly)
- `numberOfInstallments` (number, required, min: 1)
- `totalAmount` (number, required, step: 0.01, min: 0)
- `paymentStartDate` (date, required, default: today)
- `merchantCode` (text, optional, persisted, default: "Zenith123" on URL open)
- `paymentMethod` (select, required, default: "AutoPay")
- `paymentEndDate` (text, disabled, calculated)
- `installmentAmount` (text, disabled, calculated)

## CSS Architecture

### Design System

**Colors**:
- Primary Blue: `#4a90e2`
- Hover Blue: `#3a7cc0`
- Background: `#f5f5f5`
- Card Background: `white`, `#fcfcfc`
- Text: `#555`, `#777`
- Error: `#f44336`
- Success: `#4CAF50`

**Spacing**:
- Container padding: `15px`
- Section gaps: `10px`
- Field gaps: `5px` (within sections), `10px` (between sections)
- Border radius: `4px` (inputs), `6px` (sections), `8px` (container)

**Responsive Breakpoint**:
- Mobile: `max-width: 600px`
  - Grid changes from multi-column to single column
  - Button containers stack vertically

### Grid Layouts

- **Three-column**: `grid-template-columns: repeat(3, 1fr)`
- **Two-column**: `grid-template-columns: repeat(2, 1fr)`
- **Full-width**: `grid-column: 1 / -1`

### Button Styles

**Primary Action** (`.action-button`):
- Background: `#005baa`
- Hover: `#0078d7`
- Includes hover lift effect (`transform: translateY(-1px)`)

**Reset Button** (`.action-button.reset`):
- Background: `#f5f5f5`
- Border: `1px solid #ddd`

**Copy Button** (`.copy-icon`):
- Background: `#4CAF50`
- Positioned absolutely in URL field
- Shows tooltip on successful copy

## Development Workflows

### Making Changes to the Application

1. **Edit the HTML file**: All changes happen in `/public/index.html`
2. **Test locally**: Open the file in a browser or use Netlify Dev
3. **Commit changes**: Use descriptive commit messages
4. **Push to repository**: Changes will auto-deploy via Netlify

### Adding New Form Fields

1. Add the HTML field container following the field container pattern
2. Add the field to the appropriate section grid
3. Update `generateURL()` function to include/exclude the field as needed
4. Add any validation logic if required
5. Update `updateCalculations()` if the field affects calculations

### Adding New Calculations

1. Create a calculation function (follow naming: `calculateXxx()`)
2. Call it from `updateCalculations()`
3. Update the corresponding disabled field with the result
4. Ensure the calculation is included in URL generation if needed

### Modifying Persistence

**Storage locations** (lines 817-921):
- Modify `saveToStores()` to add new storage mechanisms
- Modify `loadFromStores()` to sync from new sources
- Ensure backwards compatibility

### Styling Changes

**Approach**:
- All styles are in the `<style>` tag (lines 8-619)
- Styles are duplicated (lines 258-512 duplicate earlier definitions)
- When making changes, update BOTH sections to maintain consistency
- Consider refactoring to remove duplication

## Deployment

### Netlify Configuration

**File**: `netlify.toml`

```toml
[build]
  command = "# no build command"
  functions = "netlify/functions"
  publish = "public"
```

**Key Points**:
- No build step required (static site)
- Publish directory: `public/`
- Auto-deploys on git push to main branch

### Testing Locally

**Option 1 - Direct File**:
```bash
# Open directly in browser
open public/index.html
```

**Option 2 - Netlify Dev**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run local dev server
netlify dev
```

## AI Assistant Guidelines

### When Adding Features

1. **Maintain single-file architecture**: Keep everything in `index.html`
2. **Follow existing patterns**: Use the field container, section, and grid patterns
3. **Update all storage mechanisms**: If adding new persisted data
4. **Test validation**: Ensure form validation still works
5. **Mobile responsiveness**: Test at 600px breakpoint
6. **Update download function**: If adding scripts, ensure they're included in the standalone download

### When Fixing Bugs

1. **Check all three storage systems**: Bugs may exist in IndexedDB, localStorage, or cookies
2. **Test calculation functions**: Ensure edge cases are handled (e.g., division by zero)
3. **Validate URL generation**: Ensure special characters are properly encoded
4. **Test date handling**: Date calculations can be tricky with month boundaries

### When Refactoring

**Current Technical Debt**:
1. **Style duplication** (lines 8-257 vs 258-512): Consider consolidating
2. **Inline styles in HTML**: Some grid definitions are inline, consider moving to CSS
3. **Script organization**: Consider separating into modules if the file grows much larger
4. **Magic numbers**: Some values like "100" for URL truncation could be constants

**Best Practices**:
- Preserve the triple-redundancy storage pattern (it's intentional for reliability)
- Keep the floating label effect (users like it)
- Maintain accessibility features (labels, required fields, validation messages)
- Preserve the tooltip functionality for full URLs

### When Adding Validation

Follow this pattern (see email validation lines 924-959):

```javascript
const fieldInput = document.getElementById('fieldId');
const regex = /your-regex-pattern/;

fieldInput.addEventListener('blur', validateField);
fieldInput.addEventListener('input', validateField);

function validateField() {
    if (fieldInput.value.length > 0) {
        if (!regex.test(fieldInput.value)) {
            fieldInput.setCustomValidity('Error message');
            fieldInput.style.borderColor = '#f44336';
            // Show validation message
        } else {
            fieldInput.setCustomValidity('');
            fieldInput.style.borderColor = '#4a90e2';
            // Hide validation message
        }
    }
}
```

### Common Pitfalls

1. **Don't remove the placeholder=" "**: The floating label CSS depends on `:placeholder-shown`
2. **Don't forget `updateCalculations()`**: Any field affecting URL/calculations needs to trigger this
3. **URL encoding**: Always use `encodeURIComponent()` for URL parameters
4. **Date formats**: Be consistent - form fields use ISO (YYYY-MM-DD), URLs use display format
5. **Disabled fields**: Remember to manually update disabled fields (they don't trigger events)

## Testing Checklist

Before committing changes:

- [ ] Form validates correctly (try submitting empty, try invalid email)
- [ ] All calculations update in real-time
- [ ] URL generates correctly and opens in new tab
- [ ] Copy URL button works
- [ ] Email button pre-fills correctly
- [ ] Download button creates standalone file
- [ ] Reset button clears everything
- [ ] Merchant code persists across page reloads
- [ ] Secret clear command (Ctrl+Alt+Shift+C) works
- [ ] Responsive design works on mobile (600px width)
- [ ] All three storage mechanisms work (check DevTools)

## Git Conventions

### Commit Message Style

Based on recent commits, follow this pattern:

- Use present tense ("Add feature" not "Added feature")
- Be descriptive but concise
- Examples:
  - "Refactor HTML structure and styles; enhance form functionality and user experience"
  - "Add download button to Personal Details section and implement download functionality"
  - "Update README to reflect correct file paths and improve URL example"

### Branch Strategy

- Main branch: Direct commits (small project)
- Feature branches: For major changes
- Current working branch: `claude/claude-md-mi2y514ycgppdhi6-01EeAavX2dZFkvDWDRSY46aR`

## Troubleshooting

### Issue: Merchant code not persisting

**Solution**: Check all three storage mechanisms
```javascript
// In browser console
localStorage.getItem('merchantCode')
document.cookie.split('; ').find(row => row.startsWith('merchantCode='))
// Check IndexedDB in DevTools Application tab
```

### Issue: URL not generating

**Solution**: Check `updateCalculations()` is being called
- Verify all required fields are filled
- Check browser console for errors
- Verify merchant code has a value

### Issue: Calculations incorrect

**Solution**: Check date/number inputs
- Dates must be valid ISO format
- Numbers must be positive
- Installments must be >= 1

### Issue: Download not working

**Solution**: Check clone logic
- Ensure merchant code field exists
- Verify script injection is complete
- Check browser console for errors

## Future Enhancement Ideas

### Potential Improvements

1. **External CSS/JS**: Split into separate files for maintainability
2. **Form validation library**: More robust validation
3. **Unit tests**: Test calculation functions
4. **Dark mode**: Add theme toggle
5. **Multi-language support**: i18n for different locales
6. **QR code generation**: Generate QR code for URL
7. **History/Saved forms**: Save multiple payment forms
8. **CSV export**: Export multiple forms as CSV
9. **Print stylesheet**: Optimize for printing
10. **Accessibility audit**: WCAG 2.1 compliance check

### Performance Optimizations

1. **Debounce input events**: Reduce calculation frequency
2. **Lazy load sections**: For very long forms
3. **Service worker**: Offline support
4. **Code minification**: Reduce file size

## Resources

### Documentation Links

- [Netlify Docs](https://docs.netlify.com/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)

### Related Files

- `.gitignore`: Excludes `.netlify/`, backup files
- `netlify.toml`: Deployment configuration

---

**Last Updated**: 2025-11-17
**Maintained By**: AI Assistant (Claude)
**Version**: 1.0
