# ZenPay Payment URL Generator

This is a simple HTML tool designed to generate pre-filled setup URLs for the ZenPay payment system (`https://pay.zenpay.com.au/setup/zenith123`).

## Features

-   Collects customer personal, contact, and payment details through a web form.
-   Automatically calculates the installment amount based on the total amount and number of installments.
-   Automatically calculates the payment end date based on the start date, frequency (Monthly/Weekly), and number of installments.
-   Generates a ZenPay setup URL with the provided details encoded as query parameters.
-   Displays a truncated version of the generated URL, with the full URL available on hover.
-   Provides an "Open" button to launch the generated URL in a new browser tab.

## How to Use

1.  Open the [`URLGenerator.html`](URLGenerator.html) file in your web browser.
2.  Fill out the form sections:
    -   Personal Details
    -   Contact Details
    -   Payment Details (Total Amount Due, Number of Installments, Payment Start Date, etc.)
3.  As you fill in the required payment details (Total Amount, Installments, Start Date), the "Each Installment Amount", "Payment End Date", and the "URL" fields will be automatically calculated and populated.
4.  Hover over the "URL" field to see the complete generated URL in a tooltip.
5.  Click the "Open" button to open the generated ZenPay setup link in a new browser tab.

## Technical Details

-   The entire tool is contained within a single HTML file ([`URLGenerator.html`](URLGenerator.html)).
-   Styling is done using embedded CSS within the `<style>` tags.
-   Functionality (calculations, URL generation, DOM manipulation) is handled by embedded JavaScript within the `<script>` tags.
