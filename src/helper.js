class Helper {
  static isPresent(variable) {
    return typeof(variable) !== 'undefined' && variable !== null && variable !== '';
  }


  static now() {
    return 1 * new Date();
  }

  static guid() {
    return Config.version + '-xxxxxxxx-'.replace(/[x]/g, function(c) {
        var r = Math.random()*36|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(36);
    }) + (1 * new Date()).toString(36);
  }

  static gRef() {
    var refCode = 'ref';
    var val = '';
    if (Helper.isPresent(Url.getParameterByName(refCode))) {
      val = Url.getParameterByName(refCode);
    }
    return val;
  }

  static isBot(userAgent) {
    return (/bot|crawler|spider|crawling/i).test(userAgent)
  }

  static gCookie() {
    if(this.isBot(Browser.userAgent()) === false){
      const headers = new Headers({
        "Content-Type": "application/json"
      });
      if (Config.id) {
        headers.append("Authorization", `Basic ${Config.id}`);
      }

      const init = {
        headers: headers,
      };
      var ref_code = Helper.gRef();
      var minutes = 0;
      fetch(`http://localhost:3001/api/v1/click/${ref_code}`, init)
      .then((resp) => resp.json()).then(function (data) {
        minutes = data.cookie_life * 24 * 60;
        // update the cookie if it exists, if it doesn't, create a new one
        Cookie.exists('ref') ? Cookie.set('ref', Cookie.get('ref'), minutes) : Cookie.set('ref', Helper.gRef(), minutes);
      });
      return minutes;
    }
  }

  // reduces all optional data down to a string
  static optionalData(data) {
    if (Helper.isPresent(data) === false) {
      return '';
    } else if (typeof data === 'object') {
      // runs Helper.optionalData again to reduce to string in case something else was returned
      return Helper.optionalData(JSON.stringify(data));
    } else if (typeof data === 'function') {
      // runs the function and calls Helper.optionalData again to reduce further if it isn't a string
      return Helper.optionalData(data());
    } else {
      return String(data);
    }
  }

static sendEvent(event, method, optional){
  const message = '';
    if(this.isBot(Browser.userAgent()) === false){
        const headers = new Headers({
            "Content-Type": "application/json"
        });
        if(Config.id){
            headers.append("Authorization", `Basic ${Config.id}`);
        }
        
        const init = { method: method,
            headers: headers,
        };

        if(method == "POST" || method=="PUT"){
            init.body = Helper.optionalData(optional);
        }
        const ref_code = Cookie.get('ref');

        fetch(`http://localhost:3001/api/v1/events/${event}/${ref_code}`, init)
        .then((resp) => resp.json()).then(function (data) {
            message = 'event successfully sent';

            return message;
        });
    } else {
      message = 'this is bot';
      return message;
    }
    
}
}
