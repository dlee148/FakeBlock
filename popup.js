function populateList(blockees) {
  var list = document.getElementById("blocked-list");
  for (var key in blockees) {
    if (key != "numBlocked") {
      var li = document.createElement("li");
      li.setAttribute("id", key);
      li.appendChild(document.createTextNode(blockees[key]));
      list.appendChild(li);
    }
  }
}

chrome.storage.local.get(null, populateList);
