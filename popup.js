let delay = 1000;

document.getElementById('move-tabs').onclick = function() {
    chrome.runtime.sendMessage({moveTabs: true, delay: delay});
};

document.getElementById('delay').oninput = function() {
    delay = this.value;
    document.getElementById('delay-value').textContent = delay;
};