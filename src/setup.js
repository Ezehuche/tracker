
// process the queue and future incoming commands
pixelFunc.process = function(method, value, optional) {
  if (method === 'init') {
    Config.id = value;
  } else if(method === 'param') {
    Config.params[value] = () => optional
  } else if(method === 'event') {
    if(value === 'detect' && !Config.pageLoadOnce) {
      // update the cookie if it exists, if it doesn't, create a new one
      Cookie.exists('ref') ? Cookie.set('ref', Cookie.get('ref'), Helper.gCookie()) : Cookie.set('ref', Helper.gRef(), Helper.gCookie());
      Config.pageLoadOnce = true;
      new Pixel(value, pixelFunc.t, optional);
    } else if(value !== 'pageload' && value !== 'pageclose') {
      Helper.sendEvent(value, 'POST', optional);
      new Pixel(value, Helper.now(), optional);
    }
  }
}

// run the queued calls from the snippet to be processed
for (var i = 0, l = pixelFunc.queue.length; i < l; i++) {
  pixelFunc.process.apply(pixelFunc, pixelFunc.queue[i]);
}

window.addEventListener('unload', function() {
  if (!Config.pageCloseOnce) {
    Config.pageCloseOnce = true;
    new Pixel('pageclose', Helper.now(), function() {
      // if a link was clicked in the last 5 seconds that goes to an external host, pass it through as event data
      if (Helper.isPresent(Config.externalHost) && (Helper.now() - Config.externalHost.time) < 5*1000) {
        return Config.externalHost.link;
      }
    });
  }
});
window.onload = function() {
  var aTags = document.getElementsByTagName('a');
  for (var i = 0, l = aTags.length; i < l; i++) {
    aTags[i].addEventListener('click', function(_e) {
      if (Url.externalHost(this)) {
        Config.externalHost = { link: this.href, time: Helper.now() };
      }
    }.bind(aTags[i]));
  }

  var dataAttributes = document.querySelectorAll('[data-OPIX_FUNC-event]');
  for (var i = 0, l = dataAttributes.length; i < l; i++) {
    
    dataAttributes[i].addEventListener('click', function(_e) {
      var event = this.getAttribute('data-OPIX_FUNC-event');
      if (event) {
        Helper.sendEvent(event, 'POST', this.getAttribute('data-OPIX_FUNC-data'));
        new Pixel(event, Helper.now(), this.getAttribute('data-OPIX_FUNC-data'));
      }
    }.bind(dataAttributes[i]));
  }
}
