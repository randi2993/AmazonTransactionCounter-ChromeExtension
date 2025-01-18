export const environment = {
    production: false,
    data: {
        baseUrl: "amazon.com",
        defaultUrl: "https://www.amazon.com/cpe/yourpayments/transactions",
        html: {
            classWithMoneyValue: "a-size-base-plus a-text-bold",
            btnNextValueSelector: 'input.a-button-input[type="submit"]',
            closestElement: 'span.a-button-inner',
            closestSelector: 'span.a-button-text',
            btnTextValueNext: "Next Page"
        }
    }
};
