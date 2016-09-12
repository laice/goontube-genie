var Genie = chrome.extension.getBackgroundPage().Genie;
var GTRF = Genie.GTRF
GTRF.links = [];
var links = GTRF.links;

// check to see if we already have a link queue saved, if so assign it to links array

GTRF.validate_links = function() {
  chrome.storage.sync.get('link_queue', function(obj){
    if(obj.link_queue) {

    }
  });
}

GTRF.update_links = function(){
  chrome.storage.sync.get('link_queue', function(obj){
    if(obj.link_queue){
      links = obj.link_queue;
      console.log(links);
      if(links.length > 0) {
        links.forEach(function(link, i, array){
          if(links[i]){
            var vid = GTRF.parse_vid_url(link);
            console.log("update links vid: ");
            console.log(vid);
            if(vid.prefix == "dm"){
              console.log('adding dm to list');
              GTRF.dm_short_to_long(link, function(url){
                GTRF.add_to_list(url);
              });
            } else {
              GTRF.add_to_list(link);
            }
          } else {
            links.splice(i, 1);
          }
        });
      }

      console.log("links length: " + links.length);

      GTRF.update_addlist_titles();

    }
  });

}




GTRF.save_video_sync = function(video_info, prefix) {
  var vid_obj = {};
  vid_obj[prefix+video_info.id] = video_info;
  chrome.storage.sync.set(vid_obj, function(){

  });
}

GTRF.get_video_sync = function(vid, callback, params){
  var prefix = vid.prefix;
  var id = vid.id;

  chrome.storage.sync.get(""+prefix+id, function(obj){

    if(obj[""+prefix+id]) {
      console.log('found video in GTRF.get_video_sync');
      callback(obj[""+prefix+id], params, vid);
    } else {
      console.log("prefix + id not found in GTRF.get_video_sync");
      callback(false, params, vid);
    }

  });
}


// adds video to current playlist
GTRF.add_to_queue = function() {
  // reads the text from the link input box and adds it to our links array
  var link  = GTRF.link_input.value;
  // validation
  console.log('in add to queue, link: ');
  console.log(link);
  if(GTRF.validate_link(link) == false){
    console.error('link failed validation in add_to_queue');
    return;
  }

  // part=fileDetails&id

  var vid = GTRF.parse_vid_url(link);


  console.log("adding to queue.. ");
  console.log(vid.id);
  var video_title = "";

  GTRF.get_video_sync(vid, function(video, params, vid){

    if(video){
      console.log('video found in sync storage');
      console.log(video);
      GTRF.push_link_queue(video.url);

    } else {
      console.log('video not found in sync storage, retrieving');
      switch(vid.prefix){
          case "yt":
            GTRF.retrieve_yt_info(vid.id, function(video){
              GTRF.save_video_sync(video, vid.prefix);
              console.log('yt link:');
              console.log(link);
              GTRF.push_link_queue(link);
            });
            break;
          case "dm": {
            console.log("dm vid found in add_to_queue");

            GTRF.retrieve_dm_info(vid.id, function(video){
              GTRF.save_video_sync(video, vid.prefix);
              GTRF.dm_short_to_long(link, function(url){
                console.log("pushing...");
                console.log(vid.url);
                GTRF.push_link_queue(vid.url);

              });
            });
            break;
          }
          case "dml": {
            console.log('dml attempting to add: ');
            console.log(video);
            //GTRF.push_link_queue(video.url);
          }
          case "vm":
            break;
          default:
            break;
      }

    }
    GTRF.link_input.value = "";

  });

}

GTRF.push_link_queue = function(link) {
  links.push(link);
  // overwrites stored links array with new links array
  console.log('pushed to links: ');
  console.log(links);
  chrome.storage.sync.set({link_queue: links}, function(){
    console.log("link queue set");
  });

  // lets the user know their shit twerks
  GTRF.set_status("loaded " + link);

  // add the link to the list so the user knows wtf they got goin, and
  // reset the input field
  GTRF.add_to_list(link);
}

GTRF.retrieve_yt_info = function(id, callback) {
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

GTRF.retrieve_dm_info = function(id, callback){
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

GTRF.update_addlist_titles = function() {
  //console.log('updating titles');
  var addlist_children = add_list_div.children;
  console.log('update addlist children:');
  console.log(addlist_children);
  //var addlist_spans = addlist_children.getElementsByClassName("add_list_elem");
  for(var i = 0; i < addlist_children.length; i++){
    if(addlist_children[i].nodeName == "SPAN") {
      var vid = GTRF.parse_vid_url(addlist_children[i].innerHTML);
      console.log(addlist_children[i].innerHTML);
      console.log(vid);
      GTRF.get_video_sync(vid, function(video, params, vid){
        var id = vid.id;
        var prefix = vid.prefix;
        var element = params.element;
        switch(prefix){
          case "yt": {
            if (video){
              //console.log("found addlist video: ");
              //console.log(video.snippet.title);
              element.innerHTML = video.snippet.title;
            } else {
              //console.log('video not found, retrieving info for ' + id);
              GTRF.retrieve_yt_info(id, function(video){
                if(video){
                  //console.log('video found:');
                  //console.log(video);
                  GTRF.save_video_sync(video, "yt");
                  element.innerHTML = video.snippet.title;
                  element.setAttribute('data-url', vid.url)
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
              GTRF.retrieve_dm_info(id, function(video){
                console.log(video);
                element.innerHTML = video.title;
                element.setAttribute('data-url', vid.url);

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
            GTRF.retrieve_dm_info(id.substring(0,7), function(video){
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
    }
    // end for loop
  }




}

GTRF.parse_vid_url = function(url) {
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

  url_obj.url = url;

  return url_obj;
}

GTRF.dm_short_to_long = function(url, callback) {
  var nurl = GTRF.parse_vid_url(url);

  GTRF.retrieve_dm_info(nurl.id, function(video){
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
GTRF.validate_link = function(link) {
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
GTRF.fire_queue = function() {
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
        if(GTRF.validate_link(temp_link)){
          console.log("temp_link: "); console.log(temp_link);
          GTRF.send_link(temp_link);
        }


      }, i*rate_input.value);
      console.log("rate:"); console.log(i*rate_input.value);
      console.log("i: "); console.log(i);

    });



  }
  // turn clear queue on to destroy list every time
  //GTRF.clear_queue();
}

GTRF.send_link = function(link){
  if(GTRF.validate_link(link) == false) { return; }

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
GTRF.clear_queue = function() {

  chrome.storage.sync.remove("link_queue", function(){
    if(chrome.runtime.lastError){
      console.log(chrome.runtime.lastError);
    } else {
      console.log("Cleared Queue Successfully");
      GTRF.set_status('Cleared Queue Successfully');
    }

    //chrome.runtime.reload();
    GTRF.update_links();
    add_list_div.innerHTML = "";

  });

}

GTRF.clear_playlist_list = function() {
  playlist_list_span.innerHTML = "";

}

GTRF.clear_all = function() {

  chrome.storage.sync.clear(function(){
    if(chrome.runtime.lastError){
      console.log(chrome.runtime.lastError);
    } else {
      console.log("Cleared All Successfully");
      GTRF.set_status('Cleared All Successfully');
    }

    chrome.runtime.reload();

    //GTRF.update_links();

  });

}

// tells user info like hay ur shit broek, does not save prior messages
GTRF.set_status = function(content) {
  while(status_div.lastChild){
    status_div.removeChild(status_div.lastChild);
  }

  var text_node = document.createTextNode(content);

  status_div.appendChild(text_node);
}




// this list collects all the vids the user adds and puts them down
// below the buttons so they dont get confused and lose their minds
GTRF.add_to_list = function(content) {

  //console.log("in add to list");
  var vid = GTRF.parse_vid_url(content);
  var list_elem = document.createElement('span');
  var br = document.createElement("br");
  // ugh code duplication im sorry
  if(vid){
    console.log('vid found in GTRF.add_to_list');
    console.log(vid);
    if(vid.prefix == "dm") {
      console.log('dm found');
      GTRF.dm_short_to_long(content, function(url){
        console.log('dm short to long in add_to_list:');
        console.log(url);
        var text_node = document.createTextNode(url);
        list_elem.setAttribute("class", "add_list_elem");

        list_elem.onclick=function(){
          var local_link = url;
          //var link_list = [local_link];
          GTRF.send_link(local_link, 500);
        }

        list_elem.appendChild(text_node);
        add_list_div.appendChild(list_elem);
        add_list_div.appendChild(br);
        GTRF.update_addlist_titles();
      });
    } else {
      var text_node = document.createTextNode(content);
      list_elem.setAttribute("class", "add_list_elem");

      list_elem.onclick=function(){
        var local_link = content;
        //var link_list = [local_link];
        GTRF.send_link(local_link, 500);
      }

      list_elem.appendChild(text_node);
      add_list_div.appendChild(list_elem);
      add_list_div.appendChild(br);
      GTRF.update_addlist_titles();
    }
  } else {
    console.error('video failed to parse');
  }

}

GTRF.export_playlists = function() {
  GTRF.get_playlists(function(playlists){
    TP.download_json('gtrf_playlists.json', JSON.stringify(playlists));
  });
}

GTRF.import_playlists = function() {
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
        GTRF.set_status("Import successful");
      }
    });
  });
}

GTRF.export_list = function(){
  GTRF.update_links();
  TP.download_json('gtrf_list.json', JSON.stringify(links));
}

GTRF.parse_import = function(){
  var data = JSON.parse(import_input.value);

  data.forEach(function(link, i, array){
    if(GTRF.validate_link(link)==true){
      link_input.value = link;
      GTRF.add_to_queue();
    }
  });

  import_input.value = "";
  //import_input_div.style.display = "none";
  GTRF.toggle_import_menu();

}

GTRF.get_playlist = function(name, callback) {

    GTRF.get_playlists(function(playlists){
      console.log(playlists);
      for (var playlist in playlists) {
        if (playlists[playlist].name == name) {
          callback(playlists[playlist]);
          break;
        }
      }
    });
}

GTRF.get_playlists = function(callback){
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

GTRF.get_playlist_count = function(callback){
  GTRF.get_playlists(function(playlists){
    var count = 0;
    for (var playlist in playlists) {
      if (playlist.name){
        count += 1;
      }
    }
    callback(count);
  });
}

GTRF.get_playlist_names = function(callback){
  GTRF.get_playlists(function(playlists){
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

GTRF.make_json_playlist = function(callback) {
  chrome.storage.sync.get('link_queue', function(obj){
    if(obj.link_queue != null){
      var playlist = obj.link_queue;
      console.log("making json playlist... ");
      callback(JSON.stringify(playlist));
    }
  });
}

GTRF.make_playlist = function(callback) {
  chrome.storage.sync.get('link_queue', function(obj){
    if(obj.link_queue != null){
      var playlist = obj.link_queue;
      console.log("making playlist... ");
      callback(playlist);
    }
  });
}


GTRF.save_playlist = function(){
  GTRF.make_playlist(function(playlist){
    GTRF.get_playlist_count(function(playlist_count){
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

      GTRF.get_playlists(function(playlists){
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
          GTRF.set_status("Playlist saved");
          GTRF.open_playlist_panel();
          playlist_save_input.value = "";
        });
      });

    });
  });

}



GTRF.set_active_playlist = function(name) {
  GTRF.clear_queue();
  GTRF.get_playlist(name, function(playlist){
    console.log("setting active playlist... ");
    console.log(playlist);
    chrome.storage.sync.set({link_queue: playlist.playlist}, function(){
      console.log('link queue updated');
      GTRF.update_links();
    });
  });
}
