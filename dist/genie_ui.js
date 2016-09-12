var Genie = chrome.extension.getBackgroundPage().Genie;

Genie.GTRF.main_div = document.getElementById("gtrf");
Genie.gtrf_button = document.getElementById("gg_gtrf");
console.log(Genie);
// Genie UI
Genie.hide_menus = function() {
  Genie.hide_gtrf();
}

// Genie GTRF UI
Genie.hide_gtrf = function() {
  Genie.GTRF.main_div.style.display = 'none';
  Genie.GTRF.hidden = true;
}

Genie.show_gtrf = function() {
  Genie.GTRF.main_div.style.display = 'inline-block';
  Genie.GTRF.hidden = false;
}

Genie.toggle_gtrf = function() {

  if (Genie.GTRF.main_div.style.display == 'none'){
    Genie.show_gtrf();
  } else {
    Genie.hide_gtrf();
  }
}

// event handlers
Genie.gtrf_button.onclick = Genie.toggle_gtrf;
