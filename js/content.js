const FACEBOOK = 0;
const TWITTER  = 1;
const SITE     = (window.location.href.indexOf('facebook.com') == -1) ? TWITTER : FACEBOOK;

var blockedPosts = {};

function contains(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == value) return true;
  }

  return false;
}

function isValidUrl(url) {
  // special cases
  var urlSpecial = url.split('/');

  if (SITE == FACEBOOK) {
    if (urlSpecial.length == 4 && urlSpecial[3] == "#") return false;
    if (urlSpecial.length == 4 && urlSpecial[3][0] == '?') return false;
    if (urlSpecial.length == 4 && urlSpecial[3].startsWith("settings")) return false;
  }

  // general case
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
        blockedPosts[key] = [];
        var queryString = "a[href*='" + key + "']";
        var matches = document.querySelectorAll(queryString);

        [].forEach.call(matches, function(el) {
          while (!contains(el.classList, SITE == FACEBOOK ? "fbUserContent" : "stream-item") && !contains(el.classList, "UFIComment")) {
            el = el.parentElement;
            if (el == null) return;
          }

          // covers redundancy
          if (el.parentElement != null && el.parentElement.parentElement != null) {
            if (SITE == FACEBOOK) {
              el = el.parentElement;
              el.parentElement.style.display = "none";
              blockedPosts[key].push(el.parentElement);
            }
            else {
              el.style.display = "none";
              blockedPosts[key].push(el);
            }
          }
        });
      }
    }
  });
}

function unblockPosts(id) {
  for (var i = 0; i < blockedPosts[id].length; i++) {
    blockedPosts[id][i].removeAttribute("style");
  }

  delete blockedPosts[id];
}

// Remove initial bad posts
removeBlockedPosts();

// Event delegation
$(document).on('mouseover', 'a', switchContextMenu);

// Remove bad posts when a new user is blocked
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message == "block") removeBlockedPosts();
  if (request.message == "unblock") unblockPosts(request.key);
});

// DOM mutation observation -- when more posts load
var target = document.getElementsByTagName("body");

var observer = new MutationObserver(function(mutations) {
  removeBlockedPosts();
});

var config = { attributes: true, childList: true, characterData: true };

observer.observe(target[0], config);

// Delete observer before navigating away
window.onbeforeunload = function() {
  observer.disconnect();
  delete observer;
}
