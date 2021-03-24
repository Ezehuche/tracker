class Cookie {
  static prefix() {
    return  `__${pixelFuncName}_`;
  }

  static set(name, value, minutes, path = '/') {
    var expires = '';
    if (Helper.isPresent(minutes)) {
      var date = new Date();
      date.setTime(date.getTime() + (minutes * 60 * 1000));
      expires = `expires=${date.toGMTString()}; `;
    }
    document.cookie = `${this.prefix()}${name}=${value}; ${expires}path=${path}; SameSite=Lax`;
  }

  static get(name) {
    var name = `${this.prefix()}${name}=`;
    var ca = document.cookie.split(';');
    for (var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return;
  }

  static delete(name) {
    this.set(name,'',-100);
  }

  static exists(name) {
    return Helper.isPresent(this.get(name));
  }
}
