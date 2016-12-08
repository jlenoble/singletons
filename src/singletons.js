import keyFunc from 'keyfunc';

const getKeyFunc = function getKeyFunc (defaultKeyfunc) {

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

export const SingletonFactory = function SingletonFactory (
  Type, defaultKeyfunc = obj => obj.toString(), preprocess = args => args) {

  const madeSingleton = (function makeSingleton (_Type, _keyfunc, _preprocess) {

    const instances = new Map();
    const keySymb = Symbol();
    const Singleton = function Singleton (..._args) {

      const args = _preprocess(_args);

      const key = Singleton.key(...args);
      let instance = instances.get(key);

      if (instance) {

        return instance;

      }

      instance = new _Type(...args);
      instance[keySymb] = key;
      instances.set(key, instance);

      return instance;

    };

    Singleton.key = (arg0, ...args) => {

      if (arg0[keySymb]) {

        return arg0[keySymb];

      } else if (Array.isArray(arg0) && arg0.length === 1 &&
        arg0[0][keySymb]) {

        return arg0[0][keySymb];

      }

      return _keyfunc(arg0, ...args);

    };
    Singleton.singleton = function singleton (_key) {

      return instances.get(_key);

    };
    Singleton.get = function get (...args) {

      return instances.get(Singleton.key(...args));

    };

    return Singleton;

  }(Type, getKeyFunc(defaultKeyfunc), preprocess));

  return madeSingleton;

};
