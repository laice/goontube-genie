var Genie = chrome.extension.getBackgroundPage().Genie;
var IMG = Genie.IMG;

var imgur_text_input = IMG.text_input = document.getElementById("imgur_text_input");
var imgur_add_button = IMG.add_button = document.getElementById("imgur_add");
var imgur_div = IMG.main_div = document.getElementById("imgur");
var imgur_list_div = IMG.list_div = document.getElementById("imgur_list");

// places to re-enable
// init.js IMG.match_display
// this page very bottom imgur_add_button.onclick
// genie_ui various: show_buttons, hide_buttons, onclick


IMG.init = function(callback) {

  chrome.storage.sync.get("imgur", function(obj){
    //console.log(obj.imgur);
    var imgur_links = obj.imgur;
    for (var img in imgur_links){
      console.log(imgur_links[img]);
      if(imgur_links[img].data){
        var img_entry = document.createElement("img");
        var link = imgur_links[img].data.link;
        var suffix = link.slice(-4);
        var prefix = link.slice(0, -4);
        var thumb_img = prefix + "s" + suffix;
        console.log(thumb_img);
        //img_entry.setAttribute('src', )
      }
    }
    callback()
  });

}

IMG.collect_url = function() {
  var url = imgur_text_input.value;
  console.log(url);
  IMG.add(url);
}

IMG.toggle_display = function() {
  //console.log('clicked');
  //console.log('before: ' + IMG.main_div.style.display)
  if(IMG.main_div.style.display == "none" || IMG.main_div.style.display == null || IMG.main_div.style.display == "") {

    IMG.init(IMG.show);

  } else {
    IMG.hide();

  }
  //console.log('after: ' + IMG.main_div.style.display);
}

IMG.hide = function() {
  IMG.main_div.style.display = 'none';
  IMG.hidden = true;
}

IMG.show = function() {
  IMG.main_div.style.display = 'inline-block';
  IMG.hidden = false;
}

IMG.match_display = function() {
  if(IMG.hidden || IMG.main_div.style.display == "none" || IMG.main_div.style.display == null || IMG.main_div.style.display == ""){
    IMG.hide();
  } else {
    IMG.show();
  }
}

//imgur_add_button.onclick = IMG.collect_url;
