var Genie = chrome.extension.getBackgroundPage().Genie;
var IMG = Genie.IMG;

var imgur_text_input = IMG.text_input = document.getElementById("imgur_text_input");
var imgur_add_button = IMG.add_button = document.getElementById("imgur_add");
var imgur_div = IMG.main_div = document.getElementById("imgur");

IMG.collect_url = function() {
  var url = imgur_text_input.value;
  IMG.add(url);
}

IMG.toggle_display = function() {
  console.log('clicked');
  console.log('before: ' + IMG.main_div.style.display)
  if(IMG.main_div.style.display == "none" || IMG.main_div.style.display == null || IMG.main_div.style.display == "") {
    IMG.main_div.style.display = 'inline-block';
  } else {
    IMG.main_div.style.display = 'none';
  }
  console.log('after: ' + IMG.main_div.style.display);
}

IMG.hide = function() {
  IMG.main_div.style.display = 'none';
}

IMG.show = function() {
  IMG.main_div.style.display = 'inline-block';
}

IMG.hidden = function() {
  if(IMG.main_div.style.display == 'none'){
    return true;
  }
  return false;
}

imgur_add_button.onclick = IMG.collect_url;
