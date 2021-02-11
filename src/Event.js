class EventData {
    /*constructor(event, method, optional) {
        this.event = event;
        this.method = method;
        this.body = Helper.optionalData(optional);
      }*/

    static isBot(userAgent) {
        return (/bot|crawler|spider|crawling/i).test(userAgent)
    }

    static sendEvent(event, method, optional){
        if(this.isBot(Browser.userAgent()) === false){
            const headers = new Headers({
                "Content-Type": "application/json"
            });
            if(Config.id){
                headers.append("Authorization", `Bearer ${Config.id}`);
            }
            
            const init = { method: this.method,
                headers: headers,
                credentials: 'include',
            };
    
            if(method == "POST" || method=="PUT"){
                init.body = Helper.optionalData(optional);
            }
            const ref_code = Cookie.get('ref');
    
            fetch(`http://localhost:3001/api/v1/events/${event}/${ref_code}`, init)
            .then((resp) => resp.json()).then(function (data) {
                const message = 'event successfully sent';

                return message;
            });
        }
        
    }
}