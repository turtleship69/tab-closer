async function moveTabs(tabs, delay) {
    if (tabs.length === 0) {
        setTimeout(function() {
            closeWindows(tabs, delay);
        }, 3000);
        return;
    }
    await chrome.windows.create({tabId: tabs[0].id, state: "maximized", focused: true});
    setTimeout(function() {
        moveTabs(tabs.slice(1), delay);
    }, 100);
}

async function closeWindows(tabs, delay) {
    let windows = await chrome.windows.getAll({});
    windows.sort(function(a, b) {
        return a.top - b.top;
    });
    let closeWindow = async function(i) {
        if (i >= windows.length) return;
        await chrome.windows.update(windows[i].id, {focused: true});
        setTimeout(async function() {
            await chrome.windows.remove(windows[i].id);
            setTimeout(function() {
                closeWindow(i + 1);
            }, delay);
        }, delay);
    };
    closeWindow(0);
}

chrome.runtime.onMessage.addListener(async function(message) {
    if (message.moveTabs) {
        let delay = message.delay || 1000;
        let windows = await chrome.windows.getAll({populate: true});
        let tabs = [];
        windows.forEach(function(window) {
            tabs = tabs.concat(window.tabs);
        });
        moveTabs(tabs, delay);
    }
});