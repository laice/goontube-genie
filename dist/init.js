var Genie = chrome.extension.getBackgroundPage().Genie;
var GTRF = Genie.GTRF;

// run first time extension is opened
if(!Genie.run_once) {
  // initial actions
  Genie.GTRF.hidden = true;



  Genie.run_once = true;
}


// run each time extension is opened

Genie.vm.authenticate(function(response){
  GTRF.update_links();
});

if(Genie.GTRF.hidden){
  Genie.hide_gtrf();
} else {
  Genie.show_gtrf();
}
console.log("GTRF in init: ");
console.log(GTRF);
GTRF.hide_menus();

Genie.is_goontube(function(igt){
  console.log("is goontube? " + igt);
});
