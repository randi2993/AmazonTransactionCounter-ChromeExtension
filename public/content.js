const defaultText = "[page] amazon extension counter says: ";
let total = []; // Global variable to track the total

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'nextPage') {
        const className = message.classN;
        const buttonText = message.btnTextNext;
        const buttonSelector = message.btnNextValueSelector;
        const closestElement = message.closestElement;
        const closestSelector = message.closestSelector;

        // console.log(`${defaultText} ***** addListener nextPage ***** `);
        waitForElement(buttonSelector, (element) => {
            const response = Execute(className, buttonText, buttonSelector, closestElement, closestSelector);
            sendResponse(response);
        });
    }

    return true; // Required for async responses
});

function Execute(className, buttonText, buttonSelector, closestElement, closestSelector) {
    try {
        const pageTotal = calculateTotalPage(className);

        if (pageTotal !== 0) {
            const buttons = document.querySelectorAll(buttonSelector);
            // Filter the button with associated text "Next Page"
            const nextPageButton = Array.from(buttons).find(button => {
                const span = button.closest(closestElement)?.querySelector(closestSelector);
                return span && span.textContent.trim() === buttonText;
            });

            if (nextPageButton) {
                const nextPageButtonDisabledValidation = Array.from(buttons).find(button => {
                    const span = button.closest(closestElement)?.querySelector(closestSelector);
                    return span && span.textContent.trim() === buttonText && !button.disabled;
                });

                total.push(pageTotal);
                console.log(`${defaultText} Current page total: ${pageTotal}`);

                if (nextPageButtonDisabledValidation) {
                    nextPageButton.focus();
                    nextPageButton.click();
                    console.log(`${defaultText} **************COMPLETED**************** `);
                    return { status: 'success', message: { done: false, total: total, pageTotal: pageTotal } };
                } else {
                    console.log(`${defaultText} Total acumulated: ${total}`);
                    console.log(`${defaultText} [${buttonText}] Finished`);
                    console.log(`${defaultText} **************COMPLETED**************** `);
                    return { status: 'success', message: { done: true, total: total, pageTotal: pageTotal } };
                }
            } else {
                console.error(`${defaultText} [${buttonText}] Button not found on the page`);
                console.log(`${defaultText} **************COMPLETED**************** `);
                return { status: 'error', message: `[${buttonText}] Button not found ` };
            }
        } else {
            return { status: 'success', message: { done: false, total: 0, pageTotal: 0 } };
        }
    } catch (error) {
        console.error(error.message);
    }
}

function waitForElement(selector, callback) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            callback(element);
        }
    }, 100); // Check every 3s
}

// Function to calculate the total on the current page
function calculateTotalPage(className) {
    let totals = 0;

    try {
        const elements = document.getElementsByClassName(className);

        if (!elements || elements.length === 0) {
            console.error(`${defaultText} Class "${className}" not found on the page.`);
            return totals;
        }

        // Extract and sum the values from matching elements
        Array.from(elements).forEach((element) => {
            const flag = 'data-marked-as-done';

            if (!element.hasAttribute(flag)) {
                const text = element.innerText.trim();
                const value = parseFloat(text.replace(/[^\d.-]/g, '')) || 0; // Remove non-numeric chars and parse
                console.log(`${defaultText} Current page value: ${value}`);
                totals += value;
                element.setAttribute(flag, true); // Add a custom attribute
                element.style.color = "red";
            }
            // else {
            //     console.log(`${defaultText} Element already marked: ${element.getAttribute(flag)}`);
            // }
        });
    } catch (error) {
        console.error(`${defaultText} Error in calculateTotalPage ${error.message}`);
    }

    return totals;
}
