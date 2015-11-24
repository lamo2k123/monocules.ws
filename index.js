'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WS = (function () {
    function WS() {
        _classCallCheck(this, WS);

        this._id = 0;
        this._connects = {};

        return {
            connect: this.connect.bind(this),
            publish: this.publish.bind(this),
            off: this.off.bind(this),
            on: this.on.bind(this),
            once: this.once.bind(this)
        };
    }

    _createClass(WS, [{
        key: 'connect',
        value: function connect(key, params) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this._connects[key] = _socket2.default.connect(params.url, params.options);
                _this._connects[key]._params = params;

                _this._connects[key].on('connect', _this._connectResolve.bind(_this, key, resolve)).on('connect_error', _this._connectResolve.bind(_this, key, reject));
            });
        }
    }, {
        key: '_connectResolve',
        value: function _connectResolve(key, cb) {
            if (typeof key == 'string') {
                this._connects[key].off('connect').off('connect_error');

                cb && cb(this._connects[key]);
            }

            return this;
        }
    }, {
        key: 'publish',
        value: function publish() {
            var _this2 = this;

            var connect = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
            var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var error = [];

            if (typeof connect != 'string') {
                error.push({
                    message: 'argument connect not string',
                    connect: connect
                });
            }

            connect = connect.split('.');
            data.id = this.generateID;

            if (typeof data.method != 'string') {
                error.push({
                    message: 'invalid method name',
                    method: data.method
                });
            }

            if (!this._connects[connect[0]]) {
                error.push({
                    message: 'invalid connect',
                    connect: this._connects[connect[0]]
                });
            }

            return new Promise(function (resolve, reject) {
                var key = connect[1] ? connect[0] + '/' + connect[1] : connect[0];

                if (error.length) {
                    reject(error);
                }

                if (!_this2._connects[key]) {
                    _this2.connect(key, {
                        url: _this2._connects[connect[0]]._params.url + '/' + connect[1],
                        options: _this2._connects[connect[0]]._params.options
                    }).then(function (result) {
                        return _this2._emit(key, data, resolve, reject);
                    }, reject);
                } else {
                    _this2._emit(key, data, resolve, reject);
                }
            });
        }
    }, {
        key: '_emit',
        value: function _emit(key, data, resolve, reject) {
            this._connects[key].once('message:' + data.id, function (message) {
                if (!message || message.error) {
                    reject(message && message.error);
                } else {
                    resolve(message.data);
                }
            });

            this._connects[key].emit('message', data);
        }
    }, {
        key: '_alias',
        value: function _alias(method, key, event, fn) {
            this._connects[key][method](event, fn);

            return this;
        }
    }, {
        key: 'off',
        value: function off(key, event, fn) {
            this._alias('off', key, event, fn);

            return this;
        }
    }, {
        key: 'on',
        value: function on(key, event, fn) {
            this._alias('on', key, event, fn);

            return this;
        }
    }, {
        key: 'once',
        value: function once(key, event, fn) {
            this._alias('once', key, event, fn);

            return this;
        }
    }, {
        key: 'generateID',
        get: function get() {
            return ++this._id;
        }
    }]);

    return WS;
})();

exports.default = new WS();
