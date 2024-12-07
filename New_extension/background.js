let tabTimes = {};

chrome.tabs.onActivated.addListener(activeInfo => {
  const tabId = activeInfo.tabId;
  chrome.tabs.get(tabId, tab => {
    const url = new URL(tab.url);
    chrome.storage.local.get(["tabTimes"], result => {
      tabTimes = result.tabTimes || {};
      if (!tabTimes[url.hostname]) {
        tabTimes[url.hostname] = {
          startTime: Date.now(),
          totalTime: 0
        };
      } else {
        tabTimes[url.hostname].startTime = Date.now();
      }
      chrome.storage.local.set({ tabTimes });
    });
  });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.storage.local.get(["tabTimes", "tabUrls"], result => {
    tabTimes = result.tabTimes || {};
    const tabUrls = result.tabUrls || {};
    const url = new URL(tabUrls[tabId]);
    if (tabTimes[url.hostname]) {
      tabTimes[url.hostname].totalTime += (Date.now() - tabTimes[url.hostname].startTime);
      chrome.storage.local.set({ tabTimes });
    }
  });
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const url = new URL(tab.url);
    chrome.storage.local.get(["tabTimes"], result => {
      tabTimes = result.tabTimes || {};
      if (!tabTimes[url.hostname]) {
        tabTimes[url.hostname] = {
          startTime: Date.now(),
          totalTime: 0
        };
      } else {
        tabTimes[url.hostname].startTime = Date.now();
      }
      chrome.storage.local.set({ tabTimes });
    });
  }
});
