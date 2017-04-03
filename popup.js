function unBlock(id) {
  chrome.storage.local.remove(id, function() {
    var parent = document.getElementById("blocked");
    var child = document.getElementById(id).parentElement.parentElement;
    parent.removeChild(child);
  });
}

function populateList(blockees) {
  var table = document.getElementById("blocked");
  for (var key in blockees) {
    if (key != "numBlocked") {
      var tr = document.createElement("tr");
      var tdName = document.createElement("td");
      var tdButton = document.createElement("td");
      var button = document.createElement("button");

      tdName.appendChild(document.createTextNode(blockees[key]));

      button.onclick = function() { unBlock(this.id); };
      button.setAttribute("id", key);
      button.appendChild(document.createTextNode("x"));
      tdButton.appendChild(button);

      tr.appendChild(tdName);
      tr.appendChild(tdButton);
      table.appendChild(tr);
    }
  }
}

chrome.storage.local.get(null, populateList);
