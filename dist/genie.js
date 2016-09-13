var Genie = chrome.extension.getBackgroundPage().Genie;

// Genie Extension
Genie.get_current_tab = function(callback) {
  chrome.tabs.query(
    {currentWindow: true, active: true},
    function(tabArray) {
      var current_tab = tabArray[0];
      console.log(tabArray[0]);
      callback(current_tab);
  });
}

Genie.is_goontube = function(callback) {
  Genie.get_current_tab(function(tab){
    switch(tab.url){
      case "https://goontu.be":
        callback(true);
        break;
      case "https://goontu.be/":
        callback(true);
        break;
      case "https://goontu.be/alpha":
        callback(true);
        break;
      case "https://goontu.be/alpha/":
        callback(true);
        break;
      case "https://goontu.be/alpha_client":
        callback(true);
        break;
      case "https://goontu.be/alpha_client/":
        callback(true);
        break;
      default:
        callback(false);
        break;
    }
  });
}
Genie.vm = {};
Genie.vm.authenticate = function(callback) {
  console.log("authenticating vimeo...");
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.vimeo.com/oauth/authorize/client?grant_type=client_credentials");
  //console.log(Genie.GTRF.settings.vimeo_id);
  //console.log(Genie.GTRF.settings.vimeo_secret);
  var secret = TP.Base64.encode(Genie.GTRF.settings.vimeo_id + ":" + Genie.GTRF.settings.vimeo_secret);
  xhr.setRequestHeader("Authorization", "Basic " + secret );
  xhr.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.2");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function(e){
    console.log('loaded vimeo auth response');
    if (xhr.readyState === 4){
      if (xhr.status === 200){
        console.log('vimeo creds: ');
        console.log(xhr.responseText);
        Genie.vm.creds = JSON.parse(xhr.responseText);
        callback(xhr.responseText);

      } else {
        console.error(xhr.statusText);
        console.log(xhr.responseText);

      }
    }
  }
  xhr.send();
}

Genie.vm.retrieve_info = function(id, callback){
  console.log('retrieving vimeo info for: ' + id);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.vimeo.com/videos/"+id);
  xhr.setRequestHeader("Authorization", "Bearer " + Genie.vm.creds.access_token);
  xhr.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.2");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function(e) {
    if(xhr.readyState===4){
      if(xhr.status===200){
        console.log("vimeo info:");
        console.log(xhr.responseText);
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr.statusText);
        console.log(xhr.responseText);
      }
    }
  }

  xhr.send();

}

Genie.yt = {};
Genie.yt.retrieve_info = function(id, callback) {
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

Genie.dm = {};
Genie.dm.retrieve_info = function(id, callback){
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

Genie.dm.short_to_long = function(url, callback) {
  var nurl = Genie.parse_vid_url(url);

  Genie.dm.retrieve_info(nurl.id, function(video){
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



Genie.parse_vid_url = function(url) {
  var url_obj = {};

  console.log(url.substring(0,13));
  switch(url.substring(0, 13)){
    case "https://youtu":
      url_obj = {
        id: url.slice(-11),
        prefix: "yt",
        url: url
      };
      break;
    case "http://dai.ly":
      url_obj = {
        id: url.slice(-7),
        prefix: "dm",
        url: url
      };
      break;
    case "http://www.da":
      url_obj = {
        id: url.replace("http://www.dailymotion.com/video/", ""),
        prefix: "dml",
        url: url
      }
      break;
    case "https://vimeo":
      url_obj = {
        id: url.slice(-9),
        prefix: "vm",
        url: url
      }
      break;
    default:
      url_obj = false;
      break;
  }

  url_obj.url = url;

  return url_obj;
}
// test area
var tabs = chrome.tabs.query({}, function(tabs){
  console.log('tabs:');
  console.log(tabs);
});
