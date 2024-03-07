# Interfaces

## The configure dialog box

The configure dialog box is generated on demamd based on an event. It displays
a dialog when the user clicks the gear icon. It displays in the center of the
dialog box and partially hides the background using a full dialog box sized
partially opaque black div. When the user closes the dialog it it destroyed.
The configure dialog box stores a lists of registries from which the tool
fetches the data.

The wireframe for the dialog looks like this:

+----------------+
| registries: [x]|
| +------------+ |
| |http://foo/ | |
| |            | |
| +------------+ |
| Add: ______[+] |
| [Remove   sel] |
+----------------+

Where brackets [] are used to denote buttons. The registry list, which is
simply an array of URLs is store in the browsers local storage so that it
accessible across multiple environments. i.e. a localhost instance will get
access the same list that acceptance gets access to.

The entire dialog, including managing the localstorage is stored as a single
browser compatible JS file and uses jquery in it's implementation. Since it
overlays the entire page, it is independent of any other code.

