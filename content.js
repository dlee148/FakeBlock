// Event delegation
$(document).on('mouseover', 'a', switchContextMenu);

function isValidUrl(url) {
  return ((url.match(/\//g) || []).length == 3);
}

function switchContextMenu(e) {
  var fn;

  if (e.target.href != undefined && isValidUrl(e.target.href)) {
    fn = chrome.runtime.sendMessage({ message : "loadContextMenu" });
  }
  else {
    fn = chrome.runtime.sendMessage({ message : "removeContextMenu" });
  }

  $.when(fn).done(function() {
    return;
  });
}
