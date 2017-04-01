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
      alert("User " + info.selectionText + " already FakeBlocked.");
    }
  });
}

function loadContextMenu() {
  chrome.storage.local.clear();
  chrome.contextMenus.create({
    title: "FakeBlock %s",
    contexts: ["link"],
    onclick: block
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "loadContextMenu") {
      loadContextMenu();
    }
  }
);
