## Ninja

...
--------

###Prerequisites

To run the Ninja Application you will need the following:

-   The latest stable version of Chrome
-   Ninja can be run in either a Chrome unpacked application or packed application (.crx). Instructions below

###Setup and Run Ninja as an unpacked application

If you're already familiar with using Git, GitHub, you can clone master branch or download the source zip file.  To use the stable branch, select V0.7.0 branch.

1.  Download Ninja Local Cloud: Win: download Ninja Local Cloud app from the Ninja CRX on Chrome webstore, https://chrome.google.com/webstore/detail/jjdndclgmfdgpiccmlamlicfjmkognne
2.  Launch Ninja Local Cloud.  On Mac, click Allow when asked to accept incoming network connection.
3.  In the Chrome browser, go to chrome://chrome/extensions/
4.  Turn on Developer mode.
5.  Load unpacked extension... and browse to your cloned master branch.
6.  Copy Ninja app ID from the Extensions page under the app name.
7. On Windows:
    - Click Start menu icon and type regedit.
    - Browse to HKEY_CURRENT_USER/Software/Motorola Mobility/Ninja Local Cloud/Options.
    - Right click and select New > String value.
    - Type 'Local Ninja Origin' no quotes.
    - Double click on Local Ninja Origin and paste in the Ninja app ID copied in step 6 from the Chrome extensions page in the Value data field. 
    - Close Registry Editor.
8. On Mac:
    - Launch Finder.
    - Double click on /Users/\<user\>/Library/Preferences/com.MotorolaMobility.Ninja-Local-Cloud.plist.  Note: on Lion (10.7), user library folder is hidden by default.  To browse to it, in Finder choose Go > Go to Folder and type ~/Library, or select Go menu with Alt (Option) key down to see Library listed in Go menu or make the user library folder permanently visible by running the following command in Terminal: chflags nohidden ~/Library
    - Click on Add Child Type 'Local Ninja Origin' no quotes.
    - For value, paste in the Ninja app ID copied in step 6 from the Chrome extensions page.
    - Save (File > Save or Cmd S).
    - Close Property List Editor.
9.  Quit Ninja Local Cloud
10. Launch Ninja Local Cloud
11. Click Copy button to copy the Ninja Local Cloud URL.
12. New tab in Chrome and launch the Ninja app.
13. Paste in the Ninja Local Cloud URL that you copied in step 11 in the Cloud Service dialog in Ninja.
14. Click the TEST button, you should see the green text that said "Connected to Ninja Local Cloud".
15. Ninja is opened with no document.  You should be able to do File > New File and select Basic HTML, give it a name and click browse to the directory.  By default, files will be saved in Ninja Projects folder in user documents.  As long as Ninja Local Cloud is running, you will not see the Cloud Service Dialog next time you launch.


###Setup and Run Ninja as a packaged application (from Chrome Webstore)

1.  Get Ninja Authoring Tool from Chrome Webstore, https://chrome.google.com/webstore/detail/jjdndclgmfdgpiccmlamlicfjmkognne or search for 'Ninja Authoring'.
2.  New tab in Chrome and launch the Ninja app.
3.  In the Cloud Service dialog, download the Ninja Local Cloud app.
4.  Launch Ninja Local Cloud
5.  Click Copy button to copy the Ninja Local Cloud URL.
6.  Paste in the Ninja Local Cloud URL that you copied in step 5 in the Cloud Service dialog in Ninja.
7.  Click the TEST button, you should see the green text that said "Connected to Ninja Local Cloud".
8.  Ninja is opened with no document.  You should be able to do File > New File and select Basic HTML, give it a name and click browse to the directory.  By default, files will be saved in Ninja Projects folder in user documents.  As long as Ninja Local Cloud is running, you will not see the Cloud Service Dialog next time you launch.
