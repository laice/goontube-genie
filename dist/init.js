var Genie = chrome.extension.getBackgroundPage().Genie;

// run first time extension is opened
if(!Genie.run_once) {
  // initial actions
  Genie.GTRF.hidden = true;



  Genie.run_once = true;
}

// run each time extension is opened

if(Genie.GTRF.hidden){
  Genie.hide_gtrf();
} else {
  Genie.show_gtrf();
}

GTRF.update_links();
GTRF.hide_menus();

Genie.is_goontube(function(igt){
  console.log("is goontube? " + igt);
});
