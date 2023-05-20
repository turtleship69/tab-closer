function moveTabs(tabs, delay) {
    if (tabs.length === 0) {
        setTimeout(function() {
            closeWindows(tabs, delay);
        }, 3000);
        return;
    }
    chrome.windows.create({tabId: tabs[0].id, state: "maximized", focused: true}, function() {
        setTimeout(function() {
            moveTabs(tabs.slice(1), delay);
        }, 100);
    });
}

function closeWindows(tabs, delay) {
    chrome.windows.getAll({}, function(windows) {
        windows.sort(function(a, b) {
            return a.top - b.top;
        });
        let closeWindow = function(i) {
            if (i >= windows.length) return;
            chrome.windows.update(windows[i].id, {focused: true}, function() {
                setTimeout(function() {
                    chrome.windows.remove(windows[i].id, function() {
                        setTimeout(function() {
                            closeWindow(i + 1);
                        }, delay);
                    });
                }, delay);
            });
        };
        closeWindow(0);
    });
}

chrome.runtime.onMessage.addListener(function(message) {
    if (message.moveTabs) {
        let delay = message.delay || 1000;
        chrome.windows.getAll({populate: true}, function(windows) {
            let tabs = [];
            windows.forEach(function(window) {
                tabs = tabs.concat(window.tabs);
            });
            moveTabs(tabs, delay);
        });
    }
});