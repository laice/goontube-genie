chrome.runtime.sendMessage({action: 'imgurReady'}, function(response){
  console.log('received response');
  document.getElementById('imgur_response').innerHTML = response.code;
});
