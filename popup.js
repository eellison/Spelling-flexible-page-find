// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {
  registerClickEvents();
});


function sendClear() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    currentTab = tabs[0];
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'clear'},
        // ...also specifying a callback to be called 
        //    from the receiving end (content script)
        searchResult);
  });
  found = 0;
  currentIndex = 0;
  setCurrentIndexText();
}
function registerClickEvents() {
  document.getElementById("next").addEventListener('click', nextRes);
  document.getElementById("prev").addEventListener('click', prevRes);
  document.getElementById("plus").addEventListener('click', incrementValue);
  document.getElementById("minus").addEventListener('click', decrementValue);
  document.getElementById("bar").addEventListener('keyup', search);
}

var maxDist = 5;

function parseDistValue() {
  var value = document.getElementById('number').value;
  value = parseInt(value.split(":")[1]);
  value = isNaN(value) ? 0 : value;
  return value;
}

function incrementValue()
{
    var value = parseDistValue();
    value++;
    document.getElementById('number').value = "Dist: " + value;
    search();
    if (value == 1) {
        reactivate(document.getElementById('minus'));
    }
    if (value == maxDist) {
        deactivate(document.getElementById('plus'));
    }  
}

function deactivateScrollers() {
    deactivate(document.getElementById('next'));
    deactivate(document.getElementById('prev'));
}

function reactivateScrollers() {
  reactivate(document.getElementById('next'));
  reactivate(document.getElementById('prev'));
}

function decrementValue()
{
    var value = parseDistValue();
    value--;
    document.getElementById('number').value = "Dist: " + value;
    search();
    if (value == maxDist - 1) {
        reactivate(document.getElementById('plus'));
    }
    if (value == 0) {
        deactivate(document.getElementById('minus'));
    }  
}

function deactivate(btn) {
  btn.disabled = true;
  btn.className = "btn-default";
}

function reactivate(btn) {
  btn.removeAttribute("disabled");
  btn.className = "btn-primary";
}

var found = 0;  

function searchResult(result) {
}
function recordFound(result) {
  found = result;
  currentIndex = 0;
  setCurrentIndexText();
  if (found) {
    reactivateScrollers();
  } else {
    deactivateScrollers();
  }
}

function setCurrentIndexText() {
  var element = document.getElementById("currentIndex");
  if (found) {
    var newText = (currentIndex + 1) + " | " + found;
  } else {
    var newText = (currentIndex) + " | " + found;
    deactivateScrollers();
  }
  element.value = newText;
} 


var currentTab;
function search(event) {
  var searchValue = document.getElementById("bar").value;
  if (!searchValue) {
    sendClear();
    return;
  }
  if (event && event.keyCode == 13) {
    if (!event.shiftKey) {
      if (found) nextRes();
    } else {
      if (found) prevRes();
    }
    return;
  } 
  var distance = parseDistValue();
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'new_search', searchValue: searchValue, distance: distance},
        // ...also specifying a callback to be called 
        //    from the receiving end (content script)
        recordFound);
  });
}
var currentIndex = 0;


function sendScrollMessage(index) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'go_to_result', index: index},
        // ...also specifying a callback to be called 
        //    from the receiving end (content script)
        searchResult);
  });
}

function nextRes() {
  currentIndex = currentIndex + 1; 
  currentIndex = currentIndex % (found || 0);
  sendScrollMessage(currentIndex);
  setCurrentIndexText()
}

function prevRes() {
  currentIndex = currentIndex -1 + found; 
  currentIndex = currentIndex % (found || 0);
  sendScrollMessage(currentIndex);
  setCurrentIndexText()
}
