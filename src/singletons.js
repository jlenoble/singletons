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

  // Wholesale preprocessing (before everything except direct type conversion)
  const preprocess = options.preprocess || idFunc;

  // Wholesale postprocessing (last chance to update the current singleton)
  const postprocess = options.postprocess || idFunc;

  // If not undefined, some args will require special processing
  const customArgs = options.customArgs && new Map(options.customArgs);

  // When special handling is activated, reduceableTypes will help merge
  // several args into one
  const reduceableTypes = customArgs ? new Set(Array.from(customArgs.keys())
    .filter(key => {
      return customArgs.get(key).reduce;
    })) : null;

  // When special handling is activated, spreadableTypes will help split
  // one arg into several
  const spreadableTypes = customArgs ? new Set(Array.from(customArgs.keys())
    .filter(key => {
      const customArg = customArgs.get(key);
      return customArg.spread || customArg.shallowSpread;
    })) : null;

  // Helper function to split registered containerlike args into the args
  // they contain
  const spreadArgs = (array, arg) => {
    let newArray;
    const type = Object.getPrototypeOf(arg).constructor;

    if (spreadableTypes.has(type)) {
      const {spread, shallowSpread} = customArgs.get(type);
      newArray = spread === true ?
        Array.from(arg).reduce(spreadArgs, []) :
        spread !== undefined ?
          spread(arg).reduce(spreadArgs, []) :
          shallowSpread === true ?
            Array.from(arg) :
            shallowSpread(arg);
    } else {
      newArray = [arg];
    }

    return array.concat(newArray);
  };

  // All singletons from this Singleton type ever created
  const instances = new Map();

  // The unique field marking every instance of type Type created by the
  // following Singleton
  const keySymb = Symbol();

  // The custom Singleton factory out of this Singleton factory
  const Singleton = function (..._args) {
    let extractedArgs;
    let convertedArgs;
    let unreduceableArgs;

    if (customArgs) {
      // First distinguish between regular init args and special treatment args
      extractedArgs = _args.filter(arg =>
        customArgs.has(Object.getPrototypeOf(arg).constructor));

      // Pass through regular args as already converted;
      // Spread spreadable special args;
      // Convert convertible special args;
      // Filter out all other known special args as they are meaningless
      // to instanciate Type
      convertedArgs = _args.reduce(spreadArgs, []).map(arg => {
        const type = Object.getPrototypeOf(arg).constructor;

        if (customArgs.has(type)) {
          const {convert, spread, shallowSpread} = customArgs.get(type);
          return convert ? convert(arg) : spread || shallowSpread ? arg : null;
        }

        return arg;
      }).filter(arg => arg !== null);

      // Filter special args that won't need postprocess reduction
      unreduceableArgs = extractedArgs.filter(arg => {
        const type = Object.getPrototypeOf(arg).constructor;
        return !reduceableTypes.has(type);
      });
    }

    // convertedArgs contains also regular args;
    // After this, all args have the correct types and order to instanciate or
    // recall a unique instance of type Type
    const args = preprocess(convertedArgs || _args);

    const key = Singleton.key(...args);
    let instance = instances.get(key);

    // If the singleton doesn't exist, create it, mark it, register it
    if (!instance) {
      instance = new Type(...args);
      instance[keySymb] = key;
      instances.set(key, instance);
    }

    // If special args, now use them to update the singleton instance
    if (customArgs) {
      // Reduce reduceable special args and postprocess them
      reduceableTypes.forEach(type => {
        const {reduce, postprocess} = customArgs.get(type);
        postprocess.call(instance, reduce(extractedArgs.filter(
          arg => arg instanceof type)));
      });

      // Postprocess unreduceable special args
      unreduceableArgs.forEach(arg => {
        const type = Object.getPrototypeOf(arg).constructor;
        const {postprocess} = customArgs.get(type) || {};
        if (postprocess) {
          postprocess.call(instance, arg);
        }
      });
    }

    // Last call for preprocessing
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
