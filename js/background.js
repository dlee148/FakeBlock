var contextMenuIsVisible = false;

function profileSubstring(profileUrl) {
  var startingIndex = (profileUrl[4] == ':' ? 7 : 8);
  var endingIndex;

  if (profileUrl.indexOf("profile.php") !== -1) {
    endingIndex = profileUrl.indexOf("&");
  }
  else {
    endingIndex = profileUrl.indexOf("?");
  }

  return profileUrl.substring(startingIndex, endingIndex);
}

function block(info, tab) {
  blockee = profileSubstring(info.linkUrl)
  dataObject = {};
  dataObject[blockee] = info.selectionText;

  chrome.storage.local.get(blockee, function(blockee_result) {
    if (Object.keys(blockee_result).length === 0 && blockee_result.constructor === Object) {
      chrome.storage.local.set(dataObject);
      chrome.storage.local.get('numBlocked', function(num_result) {
        if (Object.keys(num_result).length === 0 && num_result.constructor === Object) {
          chrome.storage.local.set({'numBlocked' : 1});
        }
        else {
          chrome.storage.local.set({'numBlocked' : num_result.numBlocked + 1});
        }
      });
    }
    else {
      alert(info.selectionText + " has already been FakeBlocked.");
    }
  });

  // send message to content to run remove fn
  chrome.tabs.query({ active : true, highlighted : true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message : "block" });
  });
}

function loadContextMenu() {
  if (!contextMenuIsVisible) {
    chrome.contextMenus.create({
      title: "FakeBlock %s",
      contexts: ["link"],
      onclick: block,
      documentUrlPatterns: [
        "https://www.facebook.com/*",
        "http://www.facebook.com/*",
        "http://twitter.com/*",
        "https://twitter.com/*"
      ],
      targetUrlPatterns: [
        "https://www.facebook.com/*",
        "http://www.facebook.com/*",
        "http://twitter.com/*",
        "https://twitter.com/*"
      ]
    }, function() {
      contextMenuIsVisible = true;
    });
  }
}

function removeContextMenu() {
  chrome.contextMenus.removeAll(function() {
    contextMenuIsVisible = false;
  });
}

function togglePageAction(tabId, changeInfo, tab) {
  console.log(tab);
  console.log(tabId);
  console.log(changeInfo);
  if (tab.url.indexOf('facebook.com') != -1 || tab.url.indexOf('twitter.com') != -1) {
    chrome.pageAction.show(tabId);
  }
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.message) {
      case "loadContextMenu":
        loadContextMenu();
        break;
      case "removeContextMenu":
        removeContextMenu();
        break;
      case "unblock":
        chrome.tabs.query({ active : true, highlighted : true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { message : "unblock", key : request.key });
        });
        break;
    }
  }
);

chrome.tabs.onUpdated.addListener(togglePageAction);
