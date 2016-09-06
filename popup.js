var links = [];

// check to see if we already have a link queue saved, if so assign it to links array

var update_links = function(){
  chrome.storage.sync.get('link_queue', function(obj){
    if(obj.link_queue != null){
      links = obj.link_queue;
      console.log(links);
      if(links.length > 0) {
        links.forEach(function(link, i, array){
          add_to_list(link);
        });        
      }

      console.log("links length: " + links.length);

    }
  });

}

update_links();


// grabbin elements
var link_input = document.getElementById('gtrf_link_to_add');
var rate_input = document.getElementById('gtrf_rate');
var import_input = document.getElementById("gtrf_import_input")
var playlist_save_input = document.getElementById('gtrf_save_playlist_input');

var add_button = document.getElementById('gtrf_add');
var fire_button = document.getElementById('gtrf_fire');
var clear_button = document.getElementById('gtrf_clear');
var clearall_button = document.getElementById('gtrf_clearall');
var export_button = document.getElementById('gtrf_export');
var import_button = document.getElementById('gtrf_import');
var import_submit_button = document.getElementById('gtrf_import_submit');
var playlist_button = document.getElementById('gtrf_playlist');
var save_playlist_button = document.getElementById('gtrf_save_playlist');


var status_div = document.getElementById('gtrf_status_message');
var add_list_div = document.getElementById('gtrf_add_list');
var import_input_div = document.getElementById("gtrf_import_input_div");
var playlist_panel_div = document.getElementById("gtrf_playlist_panel");

var playlist_list_span = document.getElementById("gtrf_playlist_list");
var playlist_save_panel_span = document.getElementById("gtrf_playlist_save_panel");


// UI setup and init

var hide_menus = function() {
  import_input_div.style.display = 'none';
  //playlist_panel_div.style.display = 'none';
  playlist_list_span.style.display = 'none';
  playlist_save_panel_span.style.display = 'none';
  
}

var show_import_menu = function() {
  import_input_div.style.display = 'inline-block';
}

var toggle_import_menu = function(){
  if(import_input_div.style.display != 'none') {
    import_input_div.style.display = 'none';
  } else {
    //import_input_div.style.display = 'block';
    show_import_menu();
  }

}

var set_import_menu_display = function(display) {
  import_input_div.style.display = display;
}

var get_import_menu_display = function() {
  return import_input_div.style.display;
}

var show_playlist_menu = function() {

  playlist_list_span.style.display = 'inline-block';
  playlist_save_panel_span.style.display = 'inline-block';
  
}

var toggle_playlist_menu = function() {
  if(playlist_list_span.style.display != 'none') {
    playlist_list_span.style.display = 'none'
    playlist_save_panel_span.style.display = 'none';
    
  } else {
    playlist_list_span.style.display = 'inline-block';
    playlist_save_panel_span.style.display = 'inline-block';
    
  }
  
}

var set_playlist_menu_display = function(display) {
  playlist_list_span.style.display = display;
  playlist_save_panel_span.style.display = display;
    
}

var get_playlist_menu_display = function() {
  return playlist_list_span.style.display;
}

hide_menus();


// gee i wonder what this does
var add_to_queue = function() {
  var link  = link_input.value;
  // validation

  if(validate_link(link) == false){
    return;
  }  

  // reads the text from the link input box and adds it to our links array
  links.push(link);

  // overwrites stored links array with new links array
  chrome.storage.sync.set({link_queue: links}, function(){
    console.log("link queue set");
  });

  // lets the user know their shit twerks
  set_status("loaded " + link);

  // add the link to the list so the user knows wtf they got goin, and
  // reset the input field
  add_to_list(link);
  link_input.value = "";

}

// weak ass validation for now
var validate_link = function(link) {
  switch(link){
    case (link == ""):
      console.log("link failed is \"\"");
      return false;
    case (link == null):
      console.log("link failed null link");
      return false;
    //case (link.substring(1,4) == "http"):
    //  return true;
    case (!link):
      return false;
    default:
      return true;
  }
}



// begins loading shit into the playlist
var fire_queue = function() {
  if(links) {
    console.log("fire_queue links: ");
    console.log(links);



    // get the fire rate, minimum 500ms, default 1000ms
    // if user dips below 500 we put them at default
    

    if (rate_input.value < 250) {
      rate_input.value = 1000;
    } else if (!rate_input.value) {
      rate_input.value = 1000;
    }         

    console.log("links length: " + links.length);
    links.forEach(function(link, i, array){
      setTimeout(function(){
        var temp_link = link;        
        if(validate_link(temp_link)){
          console.log("temp_link: "); console.log(temp_link);
          send_link(temp_link);  
        }   
        

      }, i*rate_input.value);
      console.log("rate:"); console.log(i*rate_input.value);
      console.log("i: "); console.log(i);

    });
  
    

  }
  // turn clear queue on to destroy list every time
  //clear_queue();
}

var send_link = function(link){
  if(validate_link(link) == false) { return; }

  console.log("send_link link:");
  console.log(link);
  // chrome needs to know what tab we're using, we only use
  // the active tab so it's always gonna be the id of tab[0] in this query
  var id;
  chrome.tabs.query(
    {currentWindow: true, active: true},
    function(tabArray) { id = tabArray[0].id; }

  );

  // send in the injected code
  chrome.tabs.executeScript({file:"/tubes_fire.js"}, function(){
    // tell injected code what our links our
    chrome.tabs.sendMessage(id, {link: link}, function(){
      console.log("link sent");
    });

  });

}



// clears out local storage of the link queue and reloads the extension
var clear_queue = function() {

  chrome.storage.sync.remove("link_queue", function(){
    if(chrome.runtime.lastError){
      console.log(chrome.runtime.lastError);
    } else {
      console.log("Cleared Queue Successfully");
      set_status('Cleared Queue Successfully');
    }

    //chrome.runtime.reload();
    update_links();
    add_list_div.innerHTML = "";

  });

}

var clear_playlist_list = function() {
  playlist_list_span.innerHTML = "";
}

var clear_all = function() {

  chrome.storage.sync.clear(function(){
    if(chrome.runtime.lastError){
      console.log(chrome.runtime.lastError);
    } else {
      console.log("Cleared All Successfully");
      set_status('Cleared All Successfully');
    }

    chrome.runtime.reload();

    //update_links();

  });

}

// tells user info like hay ur shit broek, does not save prior messages
var set_status = function(content) {
  while(status_div.lastChild){
    status_div.removeChild(status_div.lastChild);
  }

  var text_node = document.createTextNode(content);

  status_div.appendChild(text_node);
}

// this list collects all the shitty vids the user adds and puts them down
// below the buttons so they dont get confused and lose their minds
var add_to_list = function(content) {
  var list_elem = document.createElement('span');
  var text_node = document.createTextNode(content);
  var br = document.createElement("br");

  list_elem.setAttribute("class", "add_list_elem");

  list_elem.onclick=function(){
    var local_link = content;
    //var link_list = [local_link];
    send_link(local_link, 500);
  }

  list_elem.appendChild(text_node);
  add_list_div.appendChild(list_elem);
  add_list_div.appendChild(br);
}

var export_playlists = function() {
  get_playlists(function(playlists){
    download_json('gtrf_playlists.json', JSON.stringify(playlists));
  });
}

var import_playlists = function() {
  var data = JSON.parse(import_input.value);
  chrome.storage.sync.get("playlists", function(obj){
    var temp_data;
    if(obj.playlists){
      temp_data = obj.playlists;
      for (var list in data) {
        temp_data[list.name] = list;
      }
    } else{
      temp_data = data;
    }

    chrome.storage.sync.set({playlists: temp_data}, function(){
      if(chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      } else{
        console.log("Import successful");
        set_status("Import successful");
      }
    });
  });
}

var export_list = function(){
  update_links();
  download_json('gtrf_list.json', JSON.stringify(links));
}

var parse_import = function(){
  var data = JSON.parse(import_input.value);

  data.forEach(function(link, i, array){
    if(validate_link(link)==true){
      link_input.value = link;
      add_to_queue();
    }
  });

  import_input.value = "";
  //import_input_div.style.display = "none";
  toggle_import_menu();

}

var add_link_keyup = function(event){
  var key_code = event.keyCode ? event.keyCode : event.which;
  if(key_code == 13){
    add_to_queue();
  }
}

var import_input_keyup = function(event){
  var key_code = event.keyCode ? event.keyCode : event.which;
  if(key_code == 13){
    parse_import(); 
  }
}

var get_playlist = function(name, callback) {
    
    get_playlists(function(playlists){
      console.log(playlists);
      for (var playlist in playlists) {             
        if (playlists[playlist].name == name) {
          callback(playlists[playlist]);
          break;
        }
      }
    });      
}

var get_playlists = function(callback){
  chrome.storage.sync.get('playlists', function(obj){
    //console.log(JSON.stringify(obj));
    if(obj.playlists){
      playlists = obj.playlists;
      console.log("got playlists: ");
      console.log(JSON.stringify(playlists));

      callback(playlists);
    } else {
      callback(null);
    }
  });
}

var get_playlist_count = function(callback){
  get_playlists(function(playlists){
    var count = 0;
    for (var playlist in playlists) {
      if (playlist.name){
        count += 1;
      }
    }
    callback(count);
  });
}

var get_playlist_names = function(callback){
  get_playlists(function(playlists){
    console.log('in playlist names');
    console.log(JSON.stringify(playlists));
    var playlist_names = [];
    for(var playlist in playlists){
      console.log(JSON.stringify(playlist));
      if(playlist){
        playlist_names.push(playlist);
      }
    }
    callback(playlist_names);
  });
}

var make_json_playlist = function(callback) {
  chrome.storage.sync.get('link_queue', function(obj){
    if(obj.link_queue != null){
      var playlist = obj.link_queue;
      console.log("making json playlist... ");      
      callback(JSON.stringify(playlist));
    }
  });
}

var make_playlist = function(callback) {
  chrome.storage.sync.get('link_queue', function(obj){
    if(obj.link_queue != null){
      var playlist = obj.link_queue;
      console.log("making playlist... ");      
      callback(playlist);
    }
  });
}


var save_playlist = function(){
  make_playlist(function(playlist){
    get_playlist_count(function(playlist_count){        
      var name = "";

      if(playlist_save_input.value) {
        name = playlist_save_input.value
        console.log("name set to " + playlist_save_input.value)
      } else {        
          var num = playlist_count+1
          name = "gtrf_playlist_" + num;
          console.log("no name provided, default " + name + " used");        
      }

      var new_playlist = {
        name: name,
        playlist: playlist
      }

      console.log("new_playlist: " + JSON.stringify(new_playlist));

      get_playlists(function(playlists){
        var temp_playlists = {};
        if(playlists) { 
          console.log('playlists found, adding');
          console.log(playlists);

          playlists[name] = new_playlist;
          temp_playlists = playlists;
        } else {
          console.log('no playlist found, making new list');
          temp_playlists[name] = new_playlist;
        }
        console.log("setting playlists:");
        console.log(JSON.stringify(temp_playlists));
        chrome.storage.sync.set({playlists: temp_playlists}, function(){
          console.log("playlist saved");
          set_status("Playlist saved");
          open_playlist_panel();
          playlist_save_input.value = "";
        });
      });

    });
  });  

}

var open_playlist_panel = function(){
  console.log('opening playlist');
  toggle_playlist_menu()
  clear_playlist_list();
  if(get_playlist_menu_display() != 'none'){
    console.log('playlist visible');
    get_playlist_names(function(playlists){

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
          set_active_playlist(temp_name);
          open_playlist_panel();
        }

        playlist_list_span.appendChild(list_elem);
        playlist_list_span.appendChild(br);
      });

    });
  } 
}

var set_active_playlist = function(name) {
  clear_queue();
  get_playlist(name, function(playlist){
    console.log("setting active playlist... ");
    console.log(playlist);
    chrome.storage.sync.set({link_queue: playlist.playlist}, function(){
      console.log('link queue updated');
      update_links();
    });
  });
}


// button click handlers

add_button.onclick = add_to_queue;
fire_button.onclick = fire_queue;
clear_button.onclick = clear_queue;
//export_button.onclick = export_list;
export_button.onclick = export_playlists;
import_button.onclick = toggle_import_menu;
//import_submit_button.onclick = parse_import;
import_submit_button.onclick = import_playlists;
playlist_button.onclick = open_playlist_panel;
save_playlist_button.onclick = save_playlist;
clearall_button.onclick = clear_all;


// third party

var download_json = function(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

