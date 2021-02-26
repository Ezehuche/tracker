# Weferral Tracker
<a href="https://www.npmjs.com/package/weferral-tracker"><img src="https://img.shields.io/npm/v/openpixel.svg" /></a>
<a href="https://www.npmjs.com/package/weferral-tracker"><img src="https://img.shields.io/npm/dt/openpixel.svg" /></a>


## About
weferral-tracker is a customizable JavaScript library for building tracking pixels. weferral-tracker uses the latest technologies available with fall back support for older browsers. For example is the browser supports web beacons, weferral-tracker will send a web beacon, if it doesn't support them it will inject a 1x1 gif into the page with tracking information as part of the images get request.

At Weferral we built weferral-tracker in implementing an affiliate tracking service that our users could put on their website to track traffic and referrals coming through our platform.

weferral-tracker has two parts, the snippet (`snippet.html`), and the core (`tracker.min.js`).

### Snippet
The weferral-tracker snippet (found at `src/snippet.html`) is the HTML code that will be put onto any webpage that will be reporting analytics. For Weferral, our userrs websites put this on every page of their website so that it would load the JS to execute beacons back to a tracking server. The snippet can be placed anywhere on the page and it will load the core weferral-tracker JS asynchronously. To be accurate, the first part of the snippet gets the timestamp as soon as it is loaded, applies an ID (your referral api key).

The snippet handles things like making sure the core JavaScript will always be loaded async and is cache busted ever 24 hours so you can update the core and have customers using the updates within the next day.

### Core
The weferral-tracker core (found at `src/tracker.min.js`) is the JavaScript code that that the snippet loads asynchronously onto the clients website. The core is what does all of the heavy lifting. The core handles settings cookies, collecting clicks, conversions, etc and of course sending beacons and tracking pixels of data when events are called.

### Events
There are 2 automatic events, the `pageload` event which is sent as the main event when a page is loaded, you could consider it to be a "hit". The other event is `pageclose` and this is sent when the pages is closed or navigated away from. For example, to calculate how long a user viewed a page, you could calculate the difference between the timestamps on pageload and pageclose and those timestamps will be accurate because they are triggered on the client side when the events actually happened.

Openpixel is flexible with events though, you can make calls to any events with any data you want to be sent with the beacon. Whenever an event is called, it sends a beacon just like the other beacons that have a timestamp and everything else. Here is an example of a custom event being called. Note: In this case we are using the `wef` function name but this will be custom based on your build of openpixel.

```
wef('event', 'reservation_requested')
```
You can also pass a string or json as the third parameter to send other data with the event.

```
wef('event', 'reservation_requested', {someData: 1, otherData: 'cool'})
wef('event', 'reservation_requested', {someData: 1, otherData: 'cool'})
```
You can also add an attribute to any HTML element that will automatically fire the event on click.

```
<button data-wef-event="special-button-click">Some Special Button</button>
```

## Setup and Customize
Openpixel needs to be customized for your needs before you can start using it. Luckily for you it is really easy to do.

1. Make sure you have [node.js](https://nodejs.org/en/download/) installed on your computer.
2. Install openpixel `npm i openpixel`
3. Install the dependencies for compiling openpixel via the command line with `npm install`
4. Update the variables at the top of the `gulpfile.js` for your custom configurations. Each configuration has comments explaining it.
5. Run gulp via the command `npm run gulp`.

The core files and the snippet are located under the `src/` directory. If you are working on those files you can run `npm run watch` and that will watch for any files changed in the `src/` directory and rerun gulp to recompile these files and drop them in the `dist/` directory.

The `src/snippet.js` file is what is compiled into the `dist/snippet.html` file. All of the other files in the `src` directory are compiled into the `dist/openpixel.js` and the minified `dist/openpixel.min.js` files.

## Continuous integration
You may also need to build different versions of openpixel for different environments with custom options.
Environment variables can be used to configure the build:
```
OPIX_DESTINATION_FOLDER, OPIX_PIXEL_ENDPOINT, OPIX_JS_ENDPOINT, OPIX_VERSIONOPIX_PIXEL_FUNC_NAME, OPIX_VERSION, OPIX_HEADER_COMMENT
```

You can install openpixel as an npm module `npm i -ED openpixel` and use it from your bash or js code.
```
OPIX_DESTINATION_FOLDER=/home/ubuntu/app/dist OPIX_PIXEL_ENDPOINT=http://localhost:8000/pixel.gif OPIX_JS_ENDPOINT=http://localhost:800/pixel_script.js  OPIX_PIXEL_FUNC_NAME=track-function OPIX_VERSION=1 OPIX_HEADER_COMMENT="// My custom tracker\n" npx gulp --gulpfile ./node_modules/openpixel/gulpfile.js run
```
