class EventData {
    constructor(event, method="GET", optional) {
        this.event = event;
        this.method = method;
        this.body = Helper.optionalData(optional);
      }

    isBot(userAgent) {

        return (/bot|crawler|spider|crawling/i).test(userAgent)
      
    }

    sendEvent(){
        if(this.isBot(Browser.userAgent()) === false){
            const headers = new Headers({
                "Content-Type": "application/json"
            });
            const init = { method: this.method,
                headers: headers,
                credentials: 'include',
            };
    
            if(this.method == "POST" || this.method=="PUT"){
                init.body = this.body;
            }
    
            fetch(`http://localhost:3001/api/v1/events/${this.event}`, init)
            .then((resp) => resp.json()).then(function (data) {
                console.log('event successfully sent')
            });
        }
        
    }
}