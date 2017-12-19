'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingletonFactory = undefined;

var _keyfunc = require('keyfunc');

var _keyfunc2 = _interopRequireDefault(_keyfunc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getKeyFunc = function getKeyFunc(defaultKeyfunc) {
  var keyfunc = defaultKeyfunc;

  if (typeof keyfunc !== 'function') {
    if (Array.isArray(keyfunc)) {
      keyfunc = _keyfunc2.default.apply(undefined, _toConsumableArray(keyfunc));
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
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var keyfunc = getKeyFunc(defaultKeyfunc);

  // Wholesale preprocessing (before everything except direct type conversion)
  var preprocess = options.preprocess || idFunc;

  // Wholesale postprocessing (last chance to update the current singleton)
  var postprocess = options.postprocess || idFunc;

  // If defined then this Type itself is spreadable (the singleton is some
  // kind of container)
  var spread = options.spread;
  var shallowSpread = options.shallowSpread;

  // If not undefined, some args will require special processing
  var customArgs = options.customArgs && new Map(options.customArgs) || spread || shallowSpread && new Map([Type, { spread: spread, shallowSpread: shallowSpread }]);

  if (options.customArgs && (spread || shallowSpread)) {
    // If both are true, then customArgs already exists but is still missing
    // this Type as special arg (or not! But then it's a user mistake that
    // yields here a silent override)
    customArgs.set(Type, { spread: spread, shallowSpread: shallowSpread });
  }

  // When special handling is activated, reduceableTypes will help merge
  // several args into one
  var reduceableTypes = customArgs ? new Set(Array.from(customArgs.keys()).filter(function (key) {
    return customArgs.get(key).reduce;
  })) : null;

  // When special handling is activated, spreadableTypes will help split
  // one arg into several
  var spreadableTypes = customArgs ? new Set(Array.from(customArgs.keys()).filter(function (key) {
    var customArg = customArgs.get(key);
    return customArg.spread || customArg.shallowSpread;
  })) : null;

  // Helper function to split registered containerlike args into the args
  // they contain
  var spreadArgs = function spreadArgs(array, arg) {
    var newArray = void 0;
    var type = Object.getPrototypeOf(arg).constructor;

    if (spreadableTypes.has(type)) {
      var _customArgs$get = customArgs.get(type),
          _spread = _customArgs$get.spread,
          _shallowSpread = _customArgs$get.shallowSpread;

      newArray = _spread === true ? Array.from(arg).reduce(spreadArgs, []) : _spread !== undefined ? _spread(arg).reduce(spreadArgs, []) : _shallowSpread === true ? Array.from(arg) : _shallowSpread(arg);
    } else {
      newArray = [arg];
    }

    return array.concat(newArray);
  };

  // All singletons from this Singleton type ever created
  var instances = new Map();

  // The unique field marking every instance of type Type created by the
  // following Singleton
  var keySymb = Symbol();

  // The custom Singleton factory out of this Singleton factory
  var Singleton = function Singleton() {
    var extractedArgs = void 0;
    var convertedArgs = void 0;
    var unreduceableArgs = void 0;

    for (var _len = arguments.length, _args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
      _args[_key2] = arguments[_key2];
    }

    if (customArgs) {
      // First distinguish between regular init args and special treatment args
      extractedArgs = _args.filter(function (arg) {
        return customArgs.has(Object.getPrototypeOf(arg).constructor);
      });

      // Pass through regular args as already converted;
      // Spread spreadable special args;
      // Convert convertible special args;
      // Filter out all other known special args as they are meaningless
      // to instanciate Type
      convertedArgs = _args.reduce(spreadArgs, []).map(function (arg) {
        var type = Object.getPrototypeOf(arg).constructor;

        if (customArgs.has(type)) {
          var _customArgs$get2 = customArgs.get(type),
              convert = _customArgs$get2.convert,
              _spread2 = _customArgs$get2.spread,
              _shallowSpread2 = _customArgs$get2.shallowSpread;

          return convert ? convert(arg) : _spread2 || _shallowSpread2 ? arg : null;
        }

        return arg;
      }).filter(function (arg) {
        return arg !== null;
      });

      // Filter special args that won't need postprocess reduction
      unreduceableArgs = extractedArgs.filter(function (arg) {
        var type = Object.getPrototypeOf(arg).constructor;
        return !reduceableTypes.has(type);
      });
    }

    // convertedArgs contains also regular args;
    // After this, all args have the correct types and order to instanciate or
    // recall a unique instance of type Type
    var args = preprocess(convertedArgs || _args);

    var key = Singleton.key.apply(Singleton, _toConsumableArray(args));
    var instance = instances.get(key);

    // If the singleton doesn't exist, create it, mark it, register it
    if (!instance) {
      instance = new (Function.prototype.bind.apply(Type, [null].concat(_toConsumableArray(args))))();
      instance[keySymb] = key;
      instances.set(key, instance);
    }

    // If special args, now use them to update the singleton instance
    if (customArgs) {
      // Reduce reduceable special args and postprocess them
      reduceableTypes.forEach(function (type) {
        var _customArgs$get3 = customArgs.get(type),
            reduce = _customArgs$get3.reduce,
            postprocess = _customArgs$get3.postprocess;

        postprocess.call(instance, reduce(extractedArgs.filter(function (arg) {
          return arg instanceof type;
        })));
      });

      // Postprocess unreduceable special args
      unreduceableArgs.forEach(function (arg) {
        var type = Object.getPrototypeOf(arg).constructor;

        var _ref = customArgs.get(type) || {},
            postprocess = _ref.postprocess;

        if (postprocess) {
          postprocess.call(instance, arg);
        }
      });
    }

    // Last call for preprocessing
    postprocess.call(instance, args);

    return instance;
  };

  Singleton.key = function (arg0) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key3 = 1; _key3 < _len2; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    if (arg0[keySymb] && !args.length) {
      return arg0[keySymb];
    }
    return keyfunc.apply(undefined, [arg0].concat(args));
  };

  Singleton.singleton = function (_key) {
    return instances.get(_key);
  };

  Singleton.get = function () {
    return instances.get(Singleton.key.apply(Singleton, arguments));
  };

  return Singleton;
};