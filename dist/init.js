var Genie = chrome.extension.getBackgroundPage().Genie;
var GTRF = Genie.GTRF;
var IMG = Genie.IMG;

console.log("----- STARTING INIT -----");
// run first time extension is opened
if(!Genie.run_once) {
  // initial actions
  Genie.GTRF.hidden = true;
  Genie.IMG.hidden = true;



  Genie.run_once = true;
}

Genie.hide_buttons();


// run each time extension is opened

Genie.vm.authorize(function(response){
  Genie.show_buttons();

});

/*
Genie.IMG.authorize(function(response, id){
  console.log('authorized: ');
  console.log(response);
});
*/

console.log("GTRF in init: ");
console.log(GTRF);
GTRF.hide_menus();
IMG.match_display();
GTRF.match_display()
Genie.is_goontube(function(igt){
  console.log("is goontube? " + igt);
});

console.log(IMG);

console.log("----- FINISHED INIT -----");

Genie.firstload = function(){
  console.log('document loaded');
}

Genie.onload = function(){
  console.log('document refreshed');
}

document.addEventListener('DOMContentLoaded', Genie.firstload, false);
window.onload = Genie.onload;
