import Socket from 'socket.io-client'

class WS {

    constructor() {
        this._uid = 0;
        this._connections = {};
    }

    get generateUID() {
        return ++this._uid;
    }

    connect(name, params) {
        return new Promise((resolve, reject) => {
            this._connections[name] = {
                params,
                socket : Socket.connect(params.url, params.options)
            };

            this._connections[name].socket
                .on('connect', resolve)
                .on('connect_error', reject);
        });
    }

    publish({name, namespace, event, data, promise = false}) {
        console.log(arguments)
        let uid = this.generateUID;

        return new Promise((resolve, reject) => {
            if(!name || typeof name != 'string')
                reject({message: 'invalid name connect', name});

            if(!event || typeof event != 'string')
                reject({message: 'invalid event name', event});

            if(!this._connections[name].socket)
                reject({message: 'invalid connect', name, connect : this._connections[name].socket});

            // @TODO: monkey code?? or not!
            if(namespace) {
                let connectKey = `${name}:${namespace}`;

                if(!this._connections[connectKey] || !this._connections[connectKey].socket) {
                    this
                        .connect(connectKey, {
                            url     : `${this._connections[name].params.url}/${namespace}`,
                            options : this._connections[name].params.options
                        })
                        .then(
                            result => this._emit(promise, connectKey, event, uid, data, resolve, reject),
                            error => reject(error)
                        )
                } else
                    // @TODO: Hmmm...
                    this._emit(promise, connectKey, event, uid, data, resolve, reject);
            } else
                // @TODO: ¯\_(ツ)_/¯
                this._emit(promise, name, event, uid, data, resolve, reject);

        });
    }

    _emit(promise, name, event, uid, data, resolve, reject) {
        if(promise) {
            this._connections[name].socket.once(`${event}:${uid}`, message => {
                if(!message || message.error) {
                    reject(message && message.error);
                } else {
                    resolve(message.data)
                }
            });
        } else {
            resolve(name, event, data, promise, uid);
        }

        this._connections[name].socket.emit(event, {uid, data});
    }

}

export default new WS();