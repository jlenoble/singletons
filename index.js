'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingletonFactory = undefined;

var _keyfunc2 = require('keyfunc');

var _keyfunc3 = _interopRequireDefault(_keyfunc2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var SingletonFactory = exports.SingletonFactory = function SingletonFactory(Type) {
  var defaultKeyfunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (obj) {
    return obj.toString();
  };


  var keyfunc = defaultKeyfunc;

  if (typeof keyfunc !== 'function') {

    if (Array.isArray(keyfunc)) {

      keyfunc = _keyfunc3.default.apply(undefined, _toConsumableArray(keyfunc));
    } else {

      throw new TypeError('Initializing argument should be a function generating unique keys ' + 'from arguments');
    }
  }

  var madeSingleton = function makeSingleton(_Type, _keyfunc) {

    var instances = new Map();
    var Singleton = function Singleton() {
      for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var key = _keyfunc.apply(undefined, args);
      var instance = instances.get(key);

      if (instance) {

        return instance;
      }

      instance = new (Function.prototype.bind.apply(_Type, [null].concat(args)))();
      instances.set(key, instance);

      return instance;
    };

    Singleton.key = keyfunc;
    Singleton.singleton = function singleton(_key) {

      return instances.get(_key);
    };

    return Singleton;
  }(Type, keyfunc);

  return madeSingleton;
};