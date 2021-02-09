class Helper {
  static isPresent(variable) {
    return typeof(variable) !== 'undefined' && variable !== null && variable !== '';
  }


  static now() {
    return 1 * new Date;
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

  static gCookie() {
    var ref_code = Helper.gRef();
    var minutes = 0;
    fetch(`http://localhost:3001/api/v1/click/${ref_code}`, {
    }).then((resp) => resp.json()).then(function (data) {
      alert(data);
      Cookie.setCid(data.wef_uid);
      minutes = data.cookie_life * 24 * 60;
    });
    return minutes;
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
}
