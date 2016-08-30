// Inform the background page that 
// this tab should have a page-action
chrome.runtime.sendMessage({
  from:    'content',
  subject: 'showPageAction'
});


//GLOBAL VARIABLES::: content.js exists in its own javascript environment, so no need to use closure
//green blue orange red purple pink 
//selected is yellow 
var colors = ['rgba(0, 255, 0, .5)', 'rgba(0, 0, 255, .5)', 'rgba(255, 165, 0, .5)', 'rgba(255, 0, 0, .5)', 'rgba(128, 0, 128, .5)',  'rgba(255, 192, 203, .5)'];
var selectedColor = 'rgba(255, 255, 0, .9)';
var instance;
var prevSelected;
var prevColor;
var numFound = 0;
function searchText(searchValue, distance) {
    instance && instance.revert();
    numFound = 0;
    var called = false;
    try {
      instance = findAndReplaceDOMText(document.body, {
        preset: 'prose',
        find: searchValue,
        replace: function(portion, match) {
          called = true;
          var el = document.createElement('span');
          el.className += "flexible-search-find"
          el.id = "find result" + numFound++
          el.style.backgroundColor = colors[match.distance % colors.length];
          el.innerHTML = portion.text;
          return el;
        },
        maxDist: distance,
        forceContext: findAndReplaceDOMText.NON_INLINE_PROSE
      });
    } catch(e) {
      warning.innerHTML = 'Error: ' + e;
      warning.style.display = 'inline';
      throw e;
      return;
    }
    if (called) {
      goToResult(0);
    }
}

//http://stackoverflow.com/questions/985272/selecting-text-in-an-element-akin-to-highlighting-with-your-mouse
function selectText(element) {
    if (prevSelected) {
      prevSelected.style.backgroundColor = prevColor;
    }
    prevSelected = element;
    prevColor = element.style.backgroundColor;
    element.style.backgroundColor = "yellow";
    var doc = document
        , range, selection
    ;    
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function goToResult(index) {
  var id = "find result" + index;
  var element = document.getElementById(id);
  selectText(element);
  element.scrollIntoViewIfNeeded() 
}

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
   if ((msg.from === 'popup') && (msg.subject === 'new_search')) {
    searchText(msg.searchValue, msg.distance);
    response(numFound);
  } else if ((msg.from === 'popup') && (msg.subject === 'clear')) {
    instance && instance.revert();
    response("cleared");
  } else if ((msg.from === 'popup') && (msg.subject === 'go_to_result')) {
    goToResult(msg.index);
  }
});














