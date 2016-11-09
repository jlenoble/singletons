import keyFunc from 'keyfunc';

export const SingletonFactory = function SingletonFactory (
  Type, defaultKeyfunc = obj => obj.toString()) {

  let keyfunc = defaultKeyfunc;

  if (typeof keyfunc !== 'function') {

    if (Array.isArray(keyfunc)) {

      keyfunc = keyFunc(...keyfunc);

    } else {

      throw new TypeError(
        'Initializing argument should be a function generating unique keys ' +
        'from arguments');

    }

  }

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

    Singleton.key = keyfunc;
    Singleton.singleton = function singleton (_key) {

      return instances.get(_key);

    };

    return Singleton;

  }(Type, keyfunc));

  return madeSingleton;

};
