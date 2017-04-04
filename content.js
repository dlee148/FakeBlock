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
        var matches = document.querySelectorAll("a[href*='" + key + "'].profileLink");
        for (var i = 0; i < matches.length; i++) {
          while (matches[i].classList[0] !== "fbUserContent") matches[i] = matches[i].parentElement;
          matches[i].parentElement.removeChild(x);
        }
      }
    }
  });
}

removeBlockedPosts();

// Event delegation
$(document).on('mouseover', 'a', switchContextMenu);

window.addEventListener("scroll", function() {
  removeBlockedPosts();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  removeBlockedPosts();
});
