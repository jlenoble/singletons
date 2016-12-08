'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingletonFactory = undefined;

var _keyfunc2 = require('keyfunc');

var _keyfunc3 = _interopRequireDefault(_keyfunc2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getKeyFunc = function getKeyFunc(defaultKeyfunc) {

  var keyfunc = defaultKeyfunc;

  if (typeof keyfunc !== 'function') {

    if (Array.isArray(keyfunc)) {

      keyfunc = _keyfunc3.default.apply(undefined, _toConsumableArray(keyfunc));
    } else {

      throw new TypeError('Initializing keyFunc argument should be a function generating unique\nkeys from arguments, or an array of hints');
    }
  }

  return keyfunc;
};

var SingletonFactory = exports.SingletonFactory = function SingletonFactory(Type) {
  var defaultKeyfunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (obj) {
    return obj.toString();
  };
  var preprocess = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (args) {
    return args;
  };


  var madeSingleton = function makeSingleton(_Type, _keyfunc, _preprocess) {

    var instances = new Map();
    var keySymb = Symbol();
    var Singleton = function Singleton() {
      for (var _len = arguments.length, _args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
        _args[_key2] = arguments[_key2];
      }

      var args = _preprocess(_args);

      var key = Singleton.key.apply(Singleton, _toConsumableArray(args));
      var instance = instances.get(key);

      if (instance) {

        return instance;
      }

      instance = new (Function.prototype.bind.apply(_Type, [null].concat(_toConsumableArray(args))))();
      instance[keySymb] = key;
      instances.set(key, instance);

      return instance;
    };

    Singleton.key = function (arg0) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key3 = 1; _key3 < _len2; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      if (arg0[keySymb]) {

        return arg0[keySymb];
      }

      return _keyfunc.apply(undefined, [arg0].concat(args));
    };
    Singleton.singleton = function singleton(_key) {

      return instances.get(_key);
    };
    Singleton.get = function get() {

      return instances.get(Singleton.key.apply(Singleton, arguments));
    };

    return Singleton;
  }(Type, getKeyFunc(defaultKeyfunc), preprocess);

  return madeSingleton;
};