# Weferral Tracker
## About
weferral-tracker is a customizable JavaScript library for building tracking pixels. weferral-tracker uses the latest technologies available with fall back support for older browsers. For example is the browser supports web beacons, weferral-tracker will send a web beacon, if it doesn't support them it will inject a 1x1 gif into the page with tracking information as part of the images get request.

At Weferral we built weferral-tracker in implementing an affiliate tracking service that our users could put on their website to track traffic and referrals coming through our platform.

weferral-tracker has two parts, the snippet (`snippet.html`), and the core (`tracker.min.js`).

### Snippet
The weferral-tracker snippet (found at `src/snippet.html`) is the HTML code that will be put onto any webpage that will be reporting analytics. For Weferral, our userrs websites put this on every page of their website so that it would load the JS to execute beacons back to a tracking server. The snippet can be placed anywhere on the page and it will load the core weferral-tracker JS asynchronously. To be accurate, the first part of the snippet gets the timestamp as soon as it is loaded, applies an ID (your referral api key).

The snippet handles things like making sure the core JavaScript will always be loaded async and is cache busted ever 24 hours so you can update the core and have customers using the updates within the next day.

### Core
The weferral-tracker core (found at `src/tracker.min.js`) is the JavaScript code that that the snippet loads asynchronously onto the clients website. The core is what does all of the heavy lifting. The core handles settings cookies, collecting clicks, conversions, etc and of course sending beacons and tracking pixels of data when events are called.

# Events
How integrate weferral javascript snippet on your website.

## init
First use this method to initialize tracker.js
```
wef("init",account id);

You can get your account id from your weferral admin account
```
## detect
This event method will scan the url for tracking parameters and will track a click, only if the proper parameters exists, that is if the user came through an affiliate referral code. If the detect method finds correct tracking parameters, a cookie will be set and when the client then gets in touch with the conversion code snippet that cookie will get triggered again, and a conversion recorded.
```
wef("event","detect");

```
## customer

Use this method track a new customer. Customers are usually tracked when a visitor, referred by an affiliate signs up for a trial or fills out a lead form. Then at a later point, one or more conversions will be created for the customer, e.g. on each successive payment of this customer.

```
wef("event","customer", {customer_id: 'ID-XXXXX',name: 'Jane Doe', email: 'jane@example.com', otherdata: 'others'});

customer_id, name & email of the customer are required, but you can add additional if you want
```
## conversion
Use this method track a conversion

This code can always safely be outputted on your thank you page. This code will only track a conversion when the current visitor was brought in by one of your affiliates, within the specified cookie time. For visitors not brought in by an affiliate, no external calls will be made.

```
wef("event","conversion", {customer_id: 'ID-XXXXX',amount: 15.50});

customer_id of the customer is required, but you can add additional if you want
```

You can also add an attribute to any HTML element that will automatically fire the event on click.

```
<button data-wef-event="customer">Some Special Button</button>
```
### Example
Example of a weferral javascript tracker event
```
    <script>
        !function(e,t,n,o,p,i,a){e[o]||((p=e[o]=function(){p.process?p.process.apply(p,arguments):p.queue.push(arguments)}).queue=[],p.t=+new Date,(i=t.createElement(n)).async=1,i.src="https://weferral-js.vercel.app/tracker.js?t="+864e5*Math.ceil(new Date/864e5),(a=t.getElementsByTagName(n)[0]).parentNode.insertBefore(i,a))}(window,document,"script","wef"),wef("init","ID-XXXXXXXX");
        wef("event","conversion", {customer_id: 'ID-XXXXX',amount: 15.50});
    </script>
```
## Setup and Customize
Weferral tracker needs to be customized for your needs before you can start using it. Luckily for you it is really easy to do.

1. Make sure you have [node.js](https://nodejs.org/en/download/) installed on your computer.
2. Install weferral-tracker `npm i weferral-tracker`
3. Install the dependencies for compiling openpixel via the command line with `npm install`
4. Update the variables at the top of the `gulpfile.js` for your custom configurations. Each configuration has comments explaining it.
5. Run gulp via the command `npm run gulp`.

The core files and the snippet are located under the `src/` directory. If you are working on those files you can run `npm run watch` and that will watch for any files changed in the `src/` directory and rerun gulp to recompile these files and drop them in the `dist/` directory.

The `src/snippet.js` file is what is compiled into the `dist/snippet.html` file. All of the other files in the `src` directory are compiled into the `dist/tracker.js` and the minified `dist/tracker.min.js` files.
