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
  Type, defaultKeyfunc = obj => obj.toString()) {

  const madeSingleton = (function makeSingleton (_Type, _keyfunc) {

    const instances = new Map();
    const Singleton = function Singleton (...args) {

      const key = _keyfunc(...args);
      let instance = instances.get(key);

      if (instance) {

        return instance;

      }

      instance = new _Type(...args);
      instances.set(key, instance);

      return instance;

    };

    Singleton.key = _keyfunc;
    Singleton.singleton = function singleton (_key) {

      return instances.get(_key);

    };
    Singleton.get = function get (...args) {

      return instances.get(_keyfunc(...args));

    };

    return Singleton;

  }(Type, getKeyFunc(defaultKeyfunc)));

  return madeSingleton;

};
