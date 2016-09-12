
// this whole shit is about finding the newtubes add button
/*
var buttons = document.getElementsByClassName("_-75080867");
//console.log(buttons);
var add_button;
for (variable in buttons){
  //console.log(variable);

  if(buttons[variable].textContent) {
    console.log(buttons[variable].textContent);
  }

  if(buttons[variable].textContent == "Add") {
    add_button = buttons[variable];
    break;
  }
}
*/

// old tubes add button
var add_button = document.getElementById('addvid');

var runCounter = 0;


// once injected code receives the link list it needs to start adding, we do dis
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){

  var link = message.link;
  console.log("link in content js: ");
  console.log(link);


  // we found add button rite
  if(add_button != null) {
    
    // this is a hack because for some reason the messages duplicate
    // and im too dumb to figure out why

    runCounter += 1;
    if(runCounter == 1){
      // here is where we start adding things to the playlist
        
        // we grab dat text field
        // new tubes text field
        //var add_input = document.getElementsByClassName("")[0].getElementsByTagName('input')[0];

        // old tubes text field
        //var add_input = document.getElementById("vidsubmit").getElementsByTagName('input')[0];

        // line 1330 goontube.js
        var sendNewVideoMessage = {
            "type": 10,
            "new_vid": link
        };
        console.log("message for sending: ");
        console.log(sendNewVideoMessage);

        // voodoo magic
        //location.href="javascript:ws.send("+JSON.stringify(sendNewVideoMessage)+"); void 0";
        var injection_code = `
          var msg = ${JSON.stringify(sendNewVideoMessage)}
          console.log("injection: " + JSON.stringify(msg));
          ws.send(JSON.stringify(msg));

        `;

        var injection_tag = document.createElement('script');
        injection_tag.textContent = injection_code;
        //(document.head||document.documentElement).appendChild(injection_tag);
        document.body.appendChild(injection_tag);
        //console.log("local_link:");
        //console.log(local_link);      

        console.log(runCounter);
      }

    }



});
