import keyFunc from 'keyfunc';

const getKeyFunc = function (defaultKeyfunc) {
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

export const SingletonFactory = function (
  Type, defaultKeyfunc = obj => obj.toString(), options = {
    preprocess: idFunc,
    postprocess: idFunc,
  }) {
  const keyfunc = getKeyFunc(defaultKeyfunc);
  const preprocess = options.preprocess || idFunc;
  const postprocess = options.postprocess || idFunc;
  const customArgs = options.customArgs && new Map(options.customArgs);

  const reduceableTypes = customArgs ? new Set(Array.from(customArgs.keys())
    .filter(key => {
      return customArgs.get(key).reduce;
    })) : null;
  const spreadableTypes = customArgs ? new Set(Array.from(customArgs.keys())
    .filter(key => {
      return customArgs.get(key).spread;
    })) : null;

  const spreadArgs = (array, arg) => {
    let newArray;
    const type = Object.getPrototypeOf(arg).constructor;

    if (spreadableTypes.has(type)) {
      const {spread} = customArgs.get(type);
      newArray = spread === true ?
        Array.from(arg).reduce(spreadArgs, []) :
        spread(arg).reduce(spreadArgs, []);
    } else {
      newArray = [arg];
    }

    return array.concat(newArray);
  };

  const instances = new Map();
  const keySymb = Symbol();
  const Singleton = function (..._args) {
    let extractedArgs;
    let convertedArgs;
    let unreduceableArgs;

    if (customArgs) {
      extractedArgs = _args.filter(arg =>
        customArgs.has(Object.getPrototypeOf(arg).constructor));

      convertedArgs = _args.reduce(spreadArgs, []).map(arg => {
        const type = Object.getPrototypeOf(arg).constructor;

        if (customArgs.has(type)) {
          const {convert} = customArgs.get(type);
          return convert ? convert(arg) : null;
        }

        return arg;
      }).filter(arg => arg !== null);

      unreduceableArgs = extractedArgs.filter(arg => {
        const type = Object.getPrototypeOf(arg).constructor;
        return !reduceableTypes.has(type);
      });
    }

    const args = preprocess(convertedArgs || _args);

    const key = Singleton.key(...args);
    let instance = instances.get(key);

    if (!instance) {
      instance = new Type(...args);
      instance[keySymb] = key;
      instances.set(key, instance);
    }

    if (customArgs) {
      reduceableTypes.forEach(type => {
        const {reduce, postprocess} = customArgs.get(type);
        postprocess.call(instance, reduce(extractedArgs.filter(
          arg => arg instanceof type)));
      });

      unreduceableArgs.forEach(arg => {
        const type = Object.getPrototypeOf(arg).constructor;
        const {postprocess} = customArgs.get(type) || {};
        if (postprocess) {
          postprocess.call(instance, arg);
        }
      });
    }

    postprocess.call(instance, args);

    return instance;
  };

  Singleton.key = (arg0, ...args) => {
    if (arg0[keySymb]) {
      return arg0[keySymb];
    }

    return keyfunc(arg0, ...args);
  };
  Singleton.singleton = function (_key) {
    return instances.get(_key);
  };
  Singleton.get = function (...args) {
    return instances.get(Singleton.key(...args));
  };

  return Singleton;
};
