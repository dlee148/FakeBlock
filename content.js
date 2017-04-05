function isValidUrl(url) {
  return ((url.match(/\//g) || []).length == 3);
}

function switchContextMenu(e) {
  var fn;

  if (e.target.href != undefined && isValidUrl(e.target.href)) {
    fn = chrome.runtime.sendMessage({ message : "loadContextMenu" }, function() {});
  }
  else {
    fn = chrome.runtime.sendMessage({ message : "removeContextMenu" }, function() {});
  }

  $.when(fn).done(function() {
    return;
  });
}

function removeBlockedPosts() {
  chrome.storage.local.get(null, function(result) {
    for (var key in result) {
      if (key !== "numBlocked") {
        var queryString = "a[href*='" + key + "']";
        var matches = document.querySelectorAll(queryString);

        [].forEach.call(matches, function(el) {
          while (el.classList[0] !== "fbUserContent") {
            el = el.parentElement;
            if (el == null) return;
          }

          // covers redundancy
          if (el.parentElement != null) {
            el.parentElement.removeChild(el);
          }
        });
      }
    }
  });
}

removeBlockedPosts();

// Event delegation
$(document).on('mouseover', 'a', switchContextMenu);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  removeBlockedPosts();
});
