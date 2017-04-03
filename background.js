var contextMenuIsVisible = false;

function profileSubstring(profileUrl) {
  startingIndex = (profileUrl[4] == ':' ? 7 : 8);
  endingIndex = profileUrl.indexOf("?");
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
}

function loadContextMenu() {
  if (!contextMenuIsVisible) {
    chrome.contextMenus.create({
      title: "FakeBlock %s",
      contexts: ["link"],
      onclick: block,
      documentUrlPatterns: [
        "https://www.facebook.com/*",
        "http://www.facebook.com/*"
      ],
      targetUrlPatterns: [
        "https://www.facebook.com/*",
        "http://www.facebook.com/*"
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

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.message) {
      case "loadContextMenu":
        loadContextMenu();
        break;
      case "removeContextMenu":
        removeContextMenu();
        break;
    }
  }
);
