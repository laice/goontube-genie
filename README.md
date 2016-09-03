# goontube-rapidfire
A Chrome Extension for saving video urls in playlists which can be automatically added to goontube

# installation
Navigate to the /bin folder above, and click the highest numbered goontube-rapidfire-XX.crx file. This will take you to a page with a download button to save the file to your computer (right click save as... will not get you the right file). After doing so, navigate chrome to chrome://extensions and drag the file onto the browser window.

# usage
Note: keyboard copy+paste and pressing enter to submit aren't working yet, but the right-click menu works with paste and there are buttons for submitting everything. need to change how I'm interacting with the DOM and this should be available soon (api integration will make this irrelevant soon enough)

Note: Currently only supports oldtubes, but jskz is gonna hook that shit up yo

So, while you're browsing a gtube supported website and you see a vid you might want for gtube later, put the URL into the top text field and click Add. This will save it to a list. The list will sync across browsers once I get the app uploaded to the chrome store.

The Fire! button will, when in the goontube tab (this is required), add everything in the list you're able to add, the Rate field allows you to specify the delay between each add, measured in milliseconds. The current minimum is 500ms and may be increased if I'm told to do so. The default is 1000ms.
You can also add any individual video to the playlist by clicking on it in the list.

The Clear button erases your current list. The Wipe button erases your current list as well as your playlists.

The export button will allow you to save a .json file (just an array of links as strings atm) with your current playlist, which can then be imported back to the extension at any time by copying and pasting the text from the json into the text field which appears after hitting the Import button, and submitting it. (I can't directly read the file cause security, as far as I know). ~~This is the ghetto way of saving until I can get playlists saved in storage.~~

Playlists can now be saved! Using the Lists button, you can name your current playlist and save it for later. Saved playlists appear below save dialog, in the List menu, and can be loaded by clicking on them. Currently there is a bug with adding a playlist with only 1 item, but multiple item playlists should be fine. If you add a playlist with the same name as a previous one, it will overwrite it, allowing you to update playlists by loading them, adding to them, and re-saving them.

# future 

* Optional automatic playlist removal of played links 
* Permanently saved playlists in sync storage 
* Management of individual playlist entries
* Gathering title data from api's so you dont have to remember vids by their shortcodes
* Automatic gathering relevant links from video sites, removing need for copy/paste 
* imgur integration for easily saving and adding gifs and images to chat, with optional support for automatic viewing them inline in chat (like extended emotes)
* Other stuff I'm not remembering now

# :twerk:



