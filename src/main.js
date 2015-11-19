import Socket from 'socket.io-client'

class WS {

    constructor() {
        this._connections = {};
    }

    connect(ns, params) {
        this._connections[ns] = Socket.connect(params.url, params.options);
    }

    publish(ns, event, data) {
        if(ns && this._connections[ns]) {
            this._connections[ns].emit(event, data);
        }
    }

}

let test = new WS();

console.log(test);

test.connect('mm', {
    url : '192.168.0.109:3000'
});

test.publish('mm', 'test', {test : 1111});



//export default new WS();