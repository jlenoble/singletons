export const SingletonFactory = function SingletonFactory (
  Type, keyFunc = obj => obj.toString()) {

  if (typeof keyFunc !== 'function') {

    throw new TypeError(
      'Initializing argument should be a function generating unique keys' +
      'from arguments');

  }

  const madeSingleton = (function makeSingleton (_Type, _keyFunc) {

    const instances = new Map();

    return function Singleton (...args) {

      const key = _keyFunc(...args);
      let instance = instances.get(key);

      if (instance) {

        return instance;

      }

      instance = new _Type(...args);
      instances.set(key, instance);

      return instance;

    };

  }(Type, keyFunc));

  return madeSingleton;

};
