var Genie = chrome.extension.getBackgroundPage().Genie;

Genie.GTRF.main_div = document.getElementById("gtrf");
Genie.gtrf_button = document.getElementById("gg_gtrf");
Genie.imgur_button = document.getElementById("gg_imgur");
console.log(Genie);
// Genie UI
Genie.hide_menus = function() {
  Genie.GTRF.hide();
  Genie.IMG.hide();
}

Genie.show_buttons = function() {
  Genie.gtrf_button.style = "inline-block";
  Genie.imgur_button.style = "inline-block";
}

Genie.hide_buttons = function() {
  Genie.gtrf_button.style = "none";
  Genie.imgur_button.style = "none";
}

// Genie GTRF UI


// event handlers
Genie.gtrf_button.onclick = Genie.GTRF.toggle_display;
Genie.imgur_button.onclick = Genie.IMG.toggle_display;
