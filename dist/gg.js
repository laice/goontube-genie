Genie.GTRF.main_div = document.getElementById("gtrf");
Genie.gtrf_button = document.getElementById("gg_gtrf");
console.log(Genie);

Genie.hide_menus = function() {
  this.hide_gtrf();
}

Genie.hide_gtrf = function() {
  this.GTRF.main_div.style.display = 'none';
}

Genie.show_gtrf = function() {
  this.GTRF.main_div.style.display = 'inline-block';
}

Genie.toggle_gtrf = function() {
  
  if (Genie.GTRF.main_div.style.display == 'none'){
    Genie.show_gtrf();
  } else {
    Genie.hide_gtrf();
    Genie.window_resize();
  }
}

// third party

Genie.download_json = function(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

Genie.window_resize = function() {
  var contentWidth = document.getElementById('#gg_menu').offsetWidth;
  var contentHeight = document.getElementById('#gg_menu').offsetHeight;
  window.resizeTo(contentWidth, contentHeight);
}

Genie.gtrf_button.onclick = Genie.toggle_gtrf;

Genie.hide_menus();


