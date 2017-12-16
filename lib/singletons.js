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

var idFunc = function idFunc(args) {
  return args;
};

var SingletonFactory = exports.SingletonFactory = function SingletonFactory(Type) {
  var defaultKeyfunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (obj) {
    return obj.toString();
  };
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    preprocess: idFunc,
    postprocess: idFunc
  };

  var madeSingleton = function (_Type, _keyfunc, _options) {
    var preprocess = _options.preprocess || idFunc;
    var postprocess = _options.postprocess || idFunc;
    var customArgs = _options.customArgs && new Map(_options.customArgs);

    var reduceableTypes = customArgs ? new Set(Array.from(customArgs.keys()).filter(function (key) {
      return customArgs.get(key).reduce;
    })) : null;

    var instances = new Map();
    var keySymb = Symbol();
    var Singleton = function Singleton() {
      var extractedArgs = void 0;
      var convertedArgs = void 0;
      var unreduceableArgs = void 0;

      for (var _len = arguments.length, _args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
        _args[_key2] = arguments[_key2];
      }

      if (customArgs) {
        extractedArgs = _args.filter(function (arg) {
          return customArgs.has(Object.getPrototypeOf(arg).constructor);
        });

        convertedArgs = _args.map(function (arg) {
          var type = Object.getPrototypeOf(arg).constructor;

          if (customArgs.has(type)) {
            var _customArgs$get = customArgs.get(type),
                convert = _customArgs$get.convert;

            return convert ? convert(arg) : null;
          }

          return arg;
        }).filter(function (arg) {
          return arg !== null;
        });

        unreduceableArgs = extractedArgs.filter(function (arg) {
          var type = Object.getPrototypeOf(arg).constructor;
          return !reduceableTypes.has(type);
        });
      }

      var args = preprocess(convertedArgs || _args);

      var key = Singleton.key.apply(Singleton, _toConsumableArray(args));
      var instance = instances.get(key);

      if (!instance) {
        instance = new (Function.prototype.bind.apply(_Type, [null].concat(_toConsumableArray(args))))();
        instance[keySymb] = key;
        instances.set(key, instance);
      }

      if (customArgs) {
        reduceableTypes.forEach(function (type) {
          var _customArgs$get2 = customArgs.get(type),
              reduce = _customArgs$get2.reduce,
              postprocess = _customArgs$get2.postprocess;

          postprocess.call(instance, reduce(extractedArgs.filter(function (arg) {
            return arg instanceof type;
          })));
        });

        unreduceableArgs.forEach(function (arg) {
          var type = Object.getPrototypeOf(arg).constructor;

          var _customArgs$get3 = customArgs.get(type),
              postprocess = _customArgs$get3.postprocess;

          if (postprocess) {
            postprocess.call(instance, arg);
          }
        });
      }

      postprocess.call(instance, args);

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
    Singleton.singleton = function (_key) {
      return instances.get(_key);
    };
    Singleton.get = function () {
      return instances.get(Singleton.key.apply(Singleton, arguments));
    };

    return Singleton;
  }(Type, getKeyFunc(defaultKeyfunc), options);

  return madeSingleton;
};