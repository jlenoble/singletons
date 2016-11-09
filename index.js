'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SingletonFactory = exports.SingletonFactory = function SingletonFactory(Type) {
  var keyFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (obj) {
    return obj.toString();
  };


  if (typeof keyFunc !== 'function') {

    throw new TypeError('Initializing argument should be a function generating unique keys' + 'from arguments');
  }

  var madeSingleton = function makeSingleton(_Type, _keyFunc) {

    var instances = new Map();

    return function Singleton() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var key = _keyFunc.apply(undefined, args);
      var instance = instances.get(key);

      if (instance) {

        return instance;
      }

      instance = new (Function.prototype.bind.apply(_Type, [null].concat(args)))();
      instances.set(key, instance);

      return instance;
    };
  }(Type, keyFunc);

  return madeSingleton;
};