chrome.runtime.onInstalled.addListener(() => {
    const defaultText = "[background] amazon extension counter says: ";
    console.log(`${defaultText} Service worker installed`);

    chrome.action.setBadgeTextColor({ color: "#FFF" });
    chrome.action.setBadgeBackgroundColor({ color: "#000" });
    chrome.action.setBadgeText({ text: "off" });

    // chrome.storage.sync.set({ amazonCounterValue: 0 }, () => {
    //     console.log(`${defaultText} first time page saved counter: 0`);
    // });

    chrome.webNavigation.onCompleted.addListener(
        (details) => {
            if (details.frameId === 0) {
                console.log(`${defaultText} Navigation completed: ${details.url}`);

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0 && tabs[0].id) {
                        const tabId = tabs[0].id;
                        let counter = 0;

                        // chrome.action.setIcon({ path: "./icons/amazon-on.png" });
                        chrome.action.setBadgeBackgroundColor({ color: "#084618", tabId: tabId });
                        chrome.action.setBadgeText({ text: "on", tabId: tabId });

                        // chrome.storage.sync.get("amazonCounterValue").then(function (value) {
                        //     console.log(`${defaultText} amazonCounterValue: ${value}`);

                        //     if (value !== null && value !== undefined &&
                        //         value["amazonCounterValue"] !== null && value["amazonCounterValue"] !== undefined
                        //     ) {
                        //         counter = Number(value["amazonCounterValue"]) + 1;
                        //     }

                        //     chrome.storage.sync.set({ amazonCounterValue: counter }, () => {
                        //         console.log(`${defaultText} page saved counter: ${counter}`);
                        //     });
                        // });
                    }
                });
            }
        },
        { url: [{ urlMatches: 'amazon.com' }] }
    );
});
