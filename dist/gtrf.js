var Genie = chrome.extension.getBackgroundPage().Genie;
var GTRF = Genie.GTRF
GTRF.links = [];
var links = GTRF.links;

// check to see if we already have a link queue saved, if so assign it to links array

var update_links = GTRF.update_links = function(){
  chrome.storage.sync.get('link_queue', function(obj){
    if(obj.link_queue != null){
      links = obj.link_queue;
      console.log(links);
      if(links.length > 0) {
        links.forEach(function(link, i, array){
          var vid = parse_vid_url(link);
          console.log("update links vid: ");
          console.log(vid);
          if(vid.prefix == "dm"){
            console.log('adding dm to list');
            dm_short_to_long(link, function(url){
              add_to_list(url);
            });
          } else {
            add_to_list(link);
          }
        });
      }

      console.log("links length: " + links.length);

      update_addlist_titles();

    }
  });

}





// grabbin elements and assign to global/local scope
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

var hide_menus = GTRF.hide_menus = function() {
  import_input_div.style.display = 'none';
  //playlist_panel_div.style.display = 'none';
  playlist_list_span.style.display = 'none';
  playlist_save_panel_span.style.display = 'none';

}

var show_import_menu = GTRF.show_import_menu = function() {
  import_input_div.style.display = 'inline-block';
}

var toggle_import_menu = GTRF.toggle_import_menu = function(){
  if(import_input_div.style.display != 'none') {
    import_input_div.style.display = 'none';
  } else {
    //import_input_div.style.display = 'block';
    show_import_menu();
  }

}

var set_import_menu_display = GTRF.set_import_menu_display = function(display) {
  import_input_div.style.display = display;
}

var get_import_menu_display = GTRF.get_import_menu_display = function() {
  return import_input_div.style.display;
}

var show_playlist_menu = GTRF.show_playlist_menu = function() {

  playlist_list_span.style.display = 'inline-block';
  playlist_save_panel_span.style.display = 'inline-block';

}

var toggle_playlist_menu = GTRF.toggle_playlist_menu = function() {
  if(playlist_list_span.style.display != 'none') {
    playlist_list_span.style.display = 'none'
    playlist_save_panel_span.style.display = 'none';

  } else {
    playlist_list_span.style.display = 'inline-block';
    playlist_save_panel_span.style.display = 'inline-block';

  }

}

var set_playlist_menu_display = GTRF.set_playlist_menu_display = function(display) {
  playlist_list_span.style.display = display;
  playlist_save_panel_span.style.display = display;

}


var save_video_sync = GTRF.save_video_sync = function(video_info, prefix) {
  var vid_obj = {};
  vid_obj[prefix+video_info.id] = video_info;
  chrome.storage.sync.set(vid_obj, function(){

  });
}

var get_video_sync = GTRF.get_video_sync = function(id, prefix, callback, params){
  chrome.storage.sync.get(""+prefix+id, function(obj){

    if(obj[""+prefix+id]) {
      console.log('found video');
      callback(obj[""+prefix+id], params, id, prefix);
    } else {
      console.log("prefix + id not found");
      callback(false, params, id, prefix);
    }

  });
}


var get_playlist_menu_display = GTRF.get_playlist_menu_display = function() {
  return playlist_list_span.style.display;
}



// gee i wonder what this does
var add_to_queue = GTRF.add_to_queue = function() {
  var link  = link_input.value;
  // validation

  if(validate_link(link) == false){
    return;
  }

  // part=fileDetails&id

  var vid = parse_vid_url(link);


  console.log("adding to queue.. ");
  console.log(vid.id);
  var video_title = "";

  get_video_sync(vid.id, vid.prefix, function(video){

    if(video){
      console.log('video found in sync storage');
      console.log(video);

    } else {
      console.log('video not found in sync storage, retrieving');
      switch(vid.prefix){
          case "yt":
            retrieve_yt_info(vid.id, function(video){
              save_video_sync(video, vid.prefix);
            });
            break;
          case "dm":
            retrieve_dm_info(vid.id, function(video){
              save_video_sync(video, vid.prefix);
            });
            break;
          case "vm":
            break;
          default:
            break;
      }

    }
  });






  // reads the text from the link input box and adds it to our links array

  if(vid.prefix =="dm"){
    dm_short_to_long(link, function(url){
      console.log("pushing...");
      console.log(url);
      links.push(url);
    });
  } else {
    links.push(link);
  }

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

var retrieve_yt_info = GTRF.retrieve_yt_info = function(id, callback) {
  var xhr = new XMLHttpRequest();

      xhr.open("GET", "https://www.googleapis.com/youtube/v3/videos?id="+id+"&part=snippet&key="+GTRF.settings.youtube_key, true);

      xhr.onload = function(e) {
        if(xhr.readyState === 4 ) {
          if (xhr.status === 200){
            //console.log(xhr.responseText);
            var results = JSON.parse(xhr.responseText);
            //console.log(results);
            callback(results.items[0]);
          } else {
            console.error(xhr.statusText);
            console.error(xhr.responseText);
            callback(false);
          }
        }
      }

      xhr.send();
}

var retrieve_dm_info = GTRF.retrieve_dm_info = function(id, callback){
  var xhr = new XMLHttpRequest();
  console.log('retrieving dm info');
  xhr.open("GET", "https://api.dailymotion.com/video/" + id +"?fields=id,title,url");

  xhr.onload = function(e){
    if(xhr.readyState === 4) {
      if(xhr.status === 200) {
        console.log(' dm results found');
        var result = JSON.parse(xhr.responseText);
        console.log(result);
        callback(result);
      } else {
        console.error(xhr.statusText);
        console.error(xhr.responseText);
        callback(false);
      }
    }
  }
  xhr.send();
}

var update_addlist_titles = GTRF.update_addlist_titles = function() {
  //console.log('updating titles');
  var addlist_children = add_list_div.children;
  for(var i = 0; i < addlist_children.length; i++){
    var vid = parse_vid_url(addlist_children[i].innerHTML);
    console.log(addlist_children[i].innerHTML);
    console.log(vid);
    get_video_sync(vid.id, vid.prefix, function(video, params, id, prefix){
      var element = params.element;
      switch(prefix){
        case "yt": {
          if (video){
            //console.log("found addlist video: ");
            //console.log(video.snippet.title);
            element.innerHTML = video.snippet.title;
          } else {
            //console.log('video not found, retrieving info for ' + id);
            retrieve_yt_info(id, function(video){
              if(video){
                //console.log('video found:');
                //console.log(video);
                save_video_sync(video, "yt");
                element.innerHTML = video.snippet.title;
              } else {
                //console.log('video not retrieved');
              }
            });
          }
          break;
        }

        case "dm": {
            if(video){
              console.log("dm video found in storage");
              console.log(video);
            }
            console.log('dm vid');
            retrieve_dm_info(id, function(video){
              console.log(video);
              element.innerHTML = video.title;
            });
          break;
        }

        case "dml": {
          if(video){
            console.log("dml video found in storage");
            console.log(video);
          }
          console.log('dml vid');
          console.log(id.substring(0,7));
          retrieve_dm_info(id.substring(0,7), function(video){
            console.log(video);
            element.innerHTML = video.title;
          });
        }

        case "vm" : {

          break;
        }

        default:
          break;
      }

    }, {"element": addlist_children[i]});

/*
    if(addlist_children[i].innerHTML.substring(0,13) == "https://youtu."){
      var id = addlist_children[i].innerHTML.slice(-11);
      //console.log(i + ": " + id);
      get_video_sync(id, "yt", function(video, params, id, prefix){
        var element = params.element;
        if (video){
          //console.log("found addlist video: ");
          //console.log(video.snippet.title);
          element.innerHTML = video.snippet.title;
        } else {
          //console.log('video not found, retrieving info for ' + id);
          retrieve_yt_info(id, function(video){
            if(video){
              //console.log('video found:');
              //console.log(video);
              save_video_sync(video, "yt");
              element.innerHTML = video.snippet.title;
            } else {
              //console.log('video not retrieved');
            }

          });
        }
      }, {"element": addlist_children[i]});
    }

    if(addlist_children[i].innerHTML.substring(0,13) == "https://dai.ly") {
      get_video_sync(id, "dm", function(video, params, id, prefix){
        var element = params.element;
        if (video) {
          console.log("dailymotion vid found: ");
          console.log(video);
        } else {
          var vid = parse_vid_url(addlist_children[i].innerHTML);
        }
      }, {"element":addlist_children[i]});
    }

    if(addlist_children[i].innerHTML.substring(0,13) == "https://vimeo.") {

    }
*/
    // end for loop
  }




}

var parse_vid_url = GTRF.parse_vid_url = function(url) {
  var url_obj = {};
  console.log(url.substring(0,13));
  switch(url.substring(0, 13)){
    case "https://youtu":
      url_obj = {
        id: url.slice(-11),
        prefix: "yt"
      };
      break;
    case "http://dai.ly":
      url_obj = {
        id: url.slice(-7),
        prefix: "dm"
      };
      break;
    case "http://www.da":
      url_obj = {
        id: url.replace("http://www.dailymotion.com/video/", ""),
        prefix: "dml"
      }
      break;
    case "https://vimeo":
      url_obj = {
        id: url.slice(-9),
        prefix: "vm"
      }
      break;
    default:
      url_obj = false;
      break;
  }

  return url_obj;
}

var dm_short_to_long = GTRF.dm_short_to_long = function(url, callback) {
  var nurl = parse_vid_url(url);

  retrieve_dm_info(nurl.id, function(video){
    console.log("short to long callback");
    console.log(video);
    if(video){
      console.log(video.url);
      callback(video.url);
    } else {
      callback(false);
    }
  });

}


// weak ass validation for now
var validate_link = GTRF.validate_link = function(link) {
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



// begins loading shit into the goontube playlist
var fire_queue = GTRF.fire_queue = function() {
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

var send_link = GTRF.send_link = function(link){
  if(validate_link(link) == false) { return; }

  console.log("send_link link:");
  console.log(link);
  // chrome needs to know what tab we're using, we only use
  // the active tab so it's always gonna be the id of tab[0] in this query

  Genie.get_current_tab(function(current_tab){
    //var current_tab = tabArray[0];
    console.log(current_tab);
    // send in the injected code
    chrome.tabs.executeScript({file:"/gtrf_fire.js"}, function(){
      // tell injected code what our links are
      chrome.tabs.sendMessage(current_tab.id, {link: link}, function(){
        console.log("link sent");
      });
    });
  });
}



// clears out local storage of the link queue and reloads the extension
var clear_queue =  GTRF.clear_queue = function() {

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

var clear_playlist_list = GTRF.clear_playlist_list = function() {
  playlist_list_span.innerHTML = "";
}

var clear_all = GTRF.clear_all = function() {

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
var set_status = GTRF.set_status = function(content) {
  while(status_div.lastChild){
    status_div.removeChild(status_div.lastChild);
  }

  var text_node = document.createTextNode(content);

  status_div.appendChild(text_node);
}




// this list collects all the vids the user adds and puts them down
// below the buttons so they dont get confused and lose their minds
var add_to_list = GTRF.add_to_list = function(content) {

  //console.log("in add to list");
  var vid = parse_vid_url(content);
  var list_elem = document.createElement('span');
  var br = document.createElement("br");
  // ugh code duplication im sorry
  if(vid){
    console.log('vid found');
    if(vid.id == "dm") {
      console.log('dm found');
      dm_short_to_long(content, function(url){

        var text_node = document.createTextNode(url);
        list_elem.setAttribute("class", "add_list_elem");

        list_elem.onclick=function(){
          var local_link = content;
          //var link_list = [local_link];
          send_link(local_link, 500);
        }

        list_elem.appendChild(text_node);
        add_list_div.appendChild(list_elem);
        add_list_div.appendChild(br);
        update_addlist_titles();
      });
    } else {
      var text_node = document.createTextNode(content);
      list_elem.setAttribute("class", "add_list_elem");

      list_elem.onclick=function(){
        var local_link = content;
        //var link_list = [local_link];
        send_link(local_link, 500);
      }

      list_elem.appendChild(text_node);
      add_list_div.appendChild(list_elem);
      add_list_div.appendChild(br);
      update_addlist_titles();
    }
  }

}

var export_playlists = GTRF.export_playlists = function() {
  get_playlists(function(playlists){
    TP.download_json('gtrf_playlists.json', JSON.stringify(playlists));
  });
}

var import_playlists = GTRF.import_playlists = function() {
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

var export_list = GTRF.export_list = function(){
  update_links();
  TP.download_json('gtrf_list.json', JSON.stringify(links));
}

var parse_import = GTRF.parse_import = function(){
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

var add_link_keyup = GTRF.add_link_keyup = function(event){
  var key_code = event.keyCode ? event.keyCode : event.which;
  if(key_code == 13){
    add_to_queue();
  }
}

var import_input_keyup = GTRF.import_input_keyup = function(event){
  var key_code = event.keyCode ? event.keyCode : event.which;
  if(key_code == 13){
    parse_import();
  }
}

var get_playlist = GTRF.get_playlist = function(name, callback) {

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

var get_playlists = GTRF.getplaylists = function(callback){
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

var get_playlist_count = GTRF.get_playlist_count = function(callback){
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

var get_playlist_names = GTRF.get_playlist_names = function(callback){
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

var make_json_playlist = GTRF.make_json_playlist = function(callback) {
  chrome.storage.sync.get('link_queue', function(obj){
    if(obj.link_queue != null){
      var playlist = obj.link_queue;
      console.log("making json playlist... ");
      callback(JSON.stringify(playlist));
    }
  });
}

var make_playlist = GTRF.make_playlist = function(callback) {
  chrome.storage.sync.get('link_queue', function(obj){
    if(obj.link_queue != null){
      var playlist = obj.link_queue;
      console.log("making playlist... ");
      callback(playlist);
    }
  });
}


var save_playlist = GTRF.save_playlist = function(){
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

var open_playlist_panel = GTRF.open_playlist_panel = function(){
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

var set_active_playlist = GTRF.set_active_playlist = function(name) {
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
