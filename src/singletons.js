import keyFunc from 'keyfunc';

const getKeyFunc = function getKeyFunc(defaultKeyfunc) {
  let keyfunc = defaultKeyfunc;

  if (typeof keyfunc !== 'function') {
    if (Array.isArray(keyfunc)) {
      keyfunc = keyFunc(...keyfunc);
    } else {
      throw new TypeError(
        `Initializing keyFunc argument should be a function generating unique
keys from arguments, or an array of hints`);
    }
  }

  return keyfunc;
};

const idFunc = args => args;

export const SingletonFactory = function SingletonFactory(
  Type, defaultKeyfunc = obj => obj.toString(), options = {
    preprocess: idFunc,
    postprocess: idFunc,
  }) {
  const madeSingleton = (function makeSingleton(_Type, _keyfunc, _options) {
    const preprocess = _options.preprocess || idFunc;
    const postprocess = _options.postprocess || idFunc;

    const instances = new Map();
    const keySymb = Symbol();
    const Singleton = function Singleton(..._args) {
      const args = preprocess(_args);

      const key = Singleton.key(...args);
      let instance = instances.get(key);

      if (instance) {
        return postprocess(instance, args);
      }

      instance = new _Type(...args);
      instance[keySymb] = key;
      instances.set(key, instance);

      return postprocess(instance, args);
    };

    Singleton.key = (arg0, ...args) => {
      if (arg0[keySymb]) {
        return arg0[keySymb];
      }

      return _keyfunc(arg0, ...args);
    };
    Singleton.singleton = function singleton(_key) {
      return instances.get(_key);
    };
    Singleton.get = function get(...args) {
      return instances.get(Singleton.key(...args));
    };

    return Singleton;
  }(Type, getKeyFunc(defaultKeyfunc), options));

  return madeSingleton;
};
