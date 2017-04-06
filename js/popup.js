var num;

function emptyList() {
  var table = document.getElementById("blocked");
  var tr = document.createElement("tr");
  var td = document.createElement("td");

  td.appendChild(document.createTextNode("No users FakeBlocked!"));
  tr.appendChild(td);
  table.appendChild(tr);
}

function unBlock(id) {
  chrome.storage.local.remove(id, function() {
    var parent = document.getElementById("blocked");
    var child = document.getElementById(id).parentElement.parentElement;
    parent.removeChild(child);
  });

  var dataObject = { "numBlocked" : num - 1 };

  chrome.storage.local.set(dataObject, function() {
    num--;
    if (num == 0) {
      emptyList();
    }
  });
}

function populateList(blockees) {
  var table = document.getElementById("blocked");
  num = blockees["numBlocked"] == undefined ? 0 : blockees["numBlocked"];

  if (num == 0) {
    emptyList();
  }
  else {
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
}

chrome.storage.local.get(null, populateList);
