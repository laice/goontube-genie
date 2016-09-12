var Genie = chrome.extension.getBackgroundPage().Genie;
var GTRF = Genie.GTRF

// grabbin elements and assign to relevant scopes
var link_input = GTRF.link_input = document.getElementById('gtrf_link_to_add');
var rate_input = GTRF.rate_input = document.getElementById('gtrf_rate');
var import_input =  GTRF.import_input = document.getElementById("gtrf_import_input")
var playlist_save_input = GTRF.playlist_save_input = document.getElementById('gtrf_save_playlist_input');

var add_button = GTRF.add_button = document.getElementById('gtrf_add');
var fire_button = GTRF.fire_button = document.getElementById('gtrf_fire');
var clear_button = GTRF.clear_button = document.getElementById('gtrf_clear');
var clearall_button = GTRF.clearall_button = document.getElementById('gtrf_clearall');
var export_button = GTRF.export_button = document.getElementById('gtrf_export');
var import_button = GTRF.import_button = document.getElementById('gtrf_import');
var import_submit_button = GTRF.import_submit_button = document.getElementById('gtrf_import_submit');
var playlist_button = GTRF.playlist_button = document.getElementById('gtrf_playlist');
var save_playlist_button = GTRF.save_playlist_button = document.getElementById('gtrf_save_playlist');


var status_div = GTRF.status_div = document.getElementById('gtrf_status_message');
var add_list_div = GTRF.add_list_div = document.getElementById('gtrf_add_list');
var import_input_div = GTRF.import_input_div = document.getElementById("gtrf_import_input_div");
var playlist_panel_div = GTRF.playlist_panel_div = document.getElementById("gtrf_playlist_panel");

var playlist_list_span = GTRF.playlist_list_span = document.getElementById("gtrf_playlist_list");
var playlist_save_panel_span = GTRF.playlist_save_panel = document.getElementById("gtrf_playlist_save_panel");

// UI setup and init

GTRF.hide_menus = function() {
  import_input_div.style.display = 'none';
  //playlist_panel_div.style.display = 'none';
  playlist_list_span.style.display = 'none';
  playlist_save_panel_span.style.display = 'none';

}

GTRF.show_import_menu = function() {
  import_input_div.style.display = 'inline-block';
}

GTRF.toggle_import_menu = function(){
  if(import_input_div.style.display != 'none') {
    import_input_div.style.display = 'none';
  } else {
    //import_input_div.style.display = 'block';
    GTRF.show_import_menu();
  }

}

GTRF.set_import_menu_display = function(display) {
  import_input_div.style.display = display;
}

GTRF.get_import_menu_display = function() {
  return import_input_div.style.display;
}

GTRF.show_playlist_menu = function() {

  playlist_list_span.style.display = 'inline-block';
  playlist_save_panel_span.style.display = 'inline-block';

}

GTRF.toggle_playlist_menu = function() {
  if(playlist_list_span.style.display != 'none') {
    playlist_list_span.style.display = 'none'
    playlist_save_panel_span.style.display = 'none';

  } else {
    playlist_list_span.style.display = 'inline-block';
    playlist_save_panel_span.style.display = 'inline-block';

  }

}

GTRF.set_playlist_menu_display = function(display) {
  playlist_list_span.style.display = display;
  playlist_save_panel_span.style.display = display;

}

GTRF.get_playlist_menu_display = function() {
  return playlist_list_span.style.display;
}

GTRF.open_playlist_panel = function(){
  console.log('opening playlist');
  GTRF.toggle_playlist_menu()
  GTRF.clear_playlist_list();
  if(GTRF.get_playlist_menu_display() != 'none'){
    console.log('playlist visible');
    GTRF.get_playlist_names(function(playlists){

      console.log(JSON.stringify(playlists));

      playlists.forEach(function(list_name, i, array){
        var list_elem = document.createElement('span');
        var entry = document.createTextNode(list_name);
        var br = document.createElement('br');

        list_elem.appendChild(entry);
        list_elem.setAttribute("class", "playlist_elem");

        list_elem.onclick = function() {
          var temp_name = list_name;
          console.log("fetching list: " + temp_name);
          GTRF.set_active_playlist(temp_name);
          GTRF.open_playlist_panel();
        }

        playlist_list_span.appendChild(list_elem);
        playlist_list_span.appendChild(br);
      });

    });
  }
}

// button click handlers

add_button.onclick = GTRF.add_to_queue;
fire_button.onclick = GTRF.fire_queue;
clear_button.onclick = GTRF.clear_queue;
//export_button.onclick = GTRF.export_list;
export_button.onclick = GTRF.export_playlists;
import_button.onclick = GTRF.toggle_import_menu;
//import_submit_button.onclick = GTRF.parse_import;
import_submit_button.onclick = GTRF.import_playlists;
playlist_button.onclick = GTRF.open_playlist_panel;
save_playlist_button.onclick = GTRF.save_playlist;
clearall_button.onclick = GTRF.clear_all;
