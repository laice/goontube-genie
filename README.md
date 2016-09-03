# goontube-rapidfire
A Chrome Extension for saving video urls in playlists which can be automatically added to goontube

# installation
Save the gtube-rapidfire.crx file in /bin/ to your computer, open chrome://extensions and drag the file onto the browser window

# usage
Note: Due to security issues I'm still figuring out, keyboard copy+paste and pressing enter to submit aren't working yet, but the right-click menu works with paste and there are buttons for submitting everything.

Note: Currently only supports oldtubes

So, while you're browsing a gtube supported website and you see a vid you might want for gtube later, put the URL into the top text field and click Add. This will save it to a list which should sync between any chrome browser which you're logged in.

The Fire! button will, when in the goontube tab (this is required), add everything in the list you're able to add, the Rate field allows you to specify the delay between each add, measured in milliseconds. The current minimum is 500ms and may be increased if I'm told to do so. The default is 1000ms.
You can also add any individual video to the playlist by simply clicking on it in the list.

The Clear button erases your entire list.

The export button will allow you to save a .json file with your playlist, which can then be readded to the extension at any time by copying and pasting the text from the json into the text field which appears after hitting the Import button, and submitting it. (I can't directly read the file cause security, as far as I know).

# future 

* Optional automatic playlist removal of played links 
* Permanently saved playlists in sync storage 
* Management of individual playlist entries
* Gathering title data from youtube api so you dont have to remember vids by their shortcodes
* Automatic gathering relevant links from video sites, removing need for copy/paste 
* Other stuff I'm not remembering now

# :twerk:



