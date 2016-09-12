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

Genie.authenticate_vimeo = function() {
  console.log("authenticating vimdeo...");
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.vimeo.com/oath/authorize/client?grant_type=client_credentials");
  console.log(Genie.GTRF.settings.vimeo_id);
  console.log(Genie.GTRF.settings.vimeo_secret);
  var secret = btoa(Genie.GTRF.settings.vimeo_id + ":" + Genie.GTRF.settings.vimeo_secret);
  xhr.setRequestHeader("Authorization", "basic " + secret );
  xhr.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.2");
  xhr.onload = function(e){
    console.log('loaded vimeo auth response');
    if (xhr.readyState === 4){
      if (xhr.status === 200){
        console.log(xhr.responseText);

      } else {
        console.error(xhr.statusText);
        console.log(xhr.responseText);

      }
    }
  }
  xhr.send();
}

// test area
var tabs = chrome.tabs.query({}, function(tabs){
  console.log('tabs:');
  console.log(tabs);
});
