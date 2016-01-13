import Socket from 'socket.io-client'

class WS {

    constructor() {
        this._id = 0;
        this._connects = {};

        return {
            connect : this.connect.bind(this),
            publish : this.publish.bind(this),
            off     : this.off.bind(this),
            on      : this.on.bind(this),
            once    : this.once.bind(this),
            getConnect : this.getConnect.bind(this)
        }
    }

    get generateID() {
        return ++this._id;
    }

    getConnect(key) {
        return this._connects[key];
    }

    connect(key, params) {
        return new Promise((resolve, reject) => {
            this._connects[key] = Socket.connect(params.url, params.options);
            this._connects[key]._params = params;

            this._connects[key]
                .on('connect', this._connectResolve.bind(this, key, resolve))
                .on('connect_error', this._connectResolve.bind(this, key, reject));
        });
    }

    _connectResolve(key, cb) {
        if(typeof key == 'string') {
            this._connects[key]
                .off('connect')
                .off('connect_error');

            cb && cb(this._connects[key]);
        }

        return this;
    }

    publish(connect = '', data = {}) {
        let error = [];

        if(typeof connect != 'string') {
            error.push({
                message: 'argument connect not string',
                connect
            });
        }

        connect = connect.split('.');
        data.id = this.generateID;

        if(typeof data.method != 'string') {
            error.push({
                message : 'invalid method name',
                method  : data.method
            });
        }

        if(!this._connects[connect[0]]) {
            error.push({
                message: 'invalid connect',
                connect : this._connects[connect[0]]
            });
        }

        return new Promise((resolve, reject) => {
            let key = connect[1] ? `${connect[0]}.${connect[1]}` : connect[0];

            if(error.length) {
                reject(error);
            }

            if(!this._connects[key]) {
                this
                    .connect(key, {
                        url     : `${this._connects[connect[0]]._params.url}.${connect[1]}`,
                        options : this._connects[connect[0]]._params.options
                    })
                    .then(
                        result => this._emit(key, data, resolve, reject),
                        reject
                    )
            } else {
                this._emit(key, data, resolve, reject);
            }
        });
    }

    _emit(key, data, resolve, reject) {
        this._connects[key].once(`message:${data.id}`, message => {
            if(!message || message.error) {
                reject(message && message.error);
            } else {
                resolve(message);
            }
        });

        this._connects[key].emit('message', data);
    }

    _alias(method, key, event, fn) {
        if(!this._connects[key]) {
            this
                .connect(key, {
                    url     : `${this._connects[connect[0]]._params.url}.${connect[1]}`,
                    options : this._connects[connect[0]]._params.options
                })
                .then(
                    result => this._connects[key][method](event, fn),
                    reject
                )
        } else {
            this._connects[key][method](event, fn);
        }

        return this;
    }

    off(key, event, fn) {
        this._alias('off', key, event, fn);

        return this;
    }

    on(key, event, fn) {
        this._alias('on', key, event, fn);

        return this;
    }

    once(key, event, fn) {
        this._alias('once', key, event, fn);

        return this;
    }

}

export default new WS();
