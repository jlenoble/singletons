# singletons

Helps create and manage families of singletons based on customizable conditions

  * [Use case](#use-case)
  * [SingletonFactory syntax](#singletonfactory-syntax)
  * [Special syntax: `Singleton(singleton)`](#special-syntax-singletonsingleton)
  * [Function `key(...args)`](#function-keyargs)
  * [Function `singleton(key)`](#function-singletonkey)
  * [Function `get(...args)`](#function-getargs)
  * [Preprocessing arguments](#preprocessing-arguments)
  * [Postprocessing an instance](#postprocessing-an-instance)
  * [Spreadable singletons](#spreadable-singletons)
  * [Passing custom arguments](#passing-custom-arguments)
  * [License](#license)


## Use case

Sometimes your functions handle data that match one-to-one to an object, but you don't have that object in the scope, and don't want to create a new one (especially if the object has states that could already have been mutated).

SingletonFactory is provided by module 'singletons'. Given a constructor and a set of options hinting at what to expect, it returns a Singleton function that will always return the same object constructed once from the passed constructor and the same set of arguments (strict equality).

## SingletonFactory syntax

SingletonFactory takes generally two arguments. The first one specifies the constructor for the singletons, and the second one is a function or an array with at least as many arguments or elements as you expect data to index your objects. For example if it matters to you that methods be considered different if they are not bound to the same object, then you will need two arguments: One indexing the object and one indexing the method.

If you provide a function, it should take as arguments your indexes and return a unique key as a string. But if you provide an array of options, a custom function will be generated for you using module [keyfunc](https://www.npmjs.com/package/keyfunc).

In the latter case, options should hint on the nature of the expected indexing data. Keywords are 'object', 'literal', 'property', 'option', 'array', 'set' and 'ignore' used as in the following example:

```js
import {SingletonFactory} from 'singletons';

class Class {
  constructor () {}
};

const Singleton = SingletonFactory(
  Class, // Constructor for the singletons
  [
    'object', // First argument must be an object matched strictly
    'literal', // Second argument can be anything matched literally
    {property: 'color'}, // Third argument and all subsequent ones can be
    // anything matched literally from their property 'id' downwards
    'array', // Fourth argument is an array of 'object'
    'set', // Fifth argument is a set of 'object'
    'ignore', // Sixth argument is ignored
    {
      type: 'option',
      sub: {
        id: 'literal',
        name: 'literal',
      },
    }, // Seventh argument is an object with properties id and name matched
    // at the level of its propeties
  ]
);

const obj = {id: 1};
const obj2 = {id: 2, name: 'Alice'};
const s1 = Singleton(console, 'log', {color: 'red'}, [console, obj],
  [console, obj], console, obj2);
const s2 = Singleton(console, 'log', {color: 'red'}, [console, obj],
  [obj, console], 'dummy', {id: 2, name: 'Alice'});

s1 === s2;
s1; // instanceof(Class);
```

For advanced combinations of hints, of which there are many, see [keyfunc](https://www.npmjs.com/package/keyfunc) documentation.

## Special syntax: `Singleton(singleton)`

Some types can be initialized either from a set of data or from another instance. In order for a Singleton function not to get confused, each created singleton stores its key with a specific symbol associated uniquely to the Singleton function.

When a Singleton function is passed a singleton with its own symbol, it just returns it without any further processing, as expected from a singleton.

```js
import {SingletonFactory} from 'singletons';

class Class {
  constructor () {}
};

const Singleton = SingletonFactory(Class, ['object']);

const option1 = {color: 'red'};

const s1 = Singleton(option1);
const s2 = Singleton(option1);
const s3 = Singleton(s1);

s1 === s2;
s1 === s3;
```

## Function `key(...args)`

The generated Singleton function has a property `key` that returns the
generated key for any given set of arguments.

```js
import {SingletonFactory} from 'singletons';

class Class {
  constructor () {}
};

const Singleton = SingletonFactory(
  Class,
  [
    'object',
  ]
);

Singleton.key(console) === 'o1';
Singleton.key(new Class()) === 'o2';
Singleton.key(console) === 'o1';
Singleton.key(new Class()) === 'o3';
```

## Function `singleton(key)`

The generated Singleton function has a property `singleton` that returns the singleton referenced by a specific key.

```js
import {SingletonFactory} from 'singletons';

class Class {
  constructor () {}
};

const Singleton = SingletonFactory(
  Class,
  [
    'object',
  ]
);

const s1 = Singleton(console);

Singleton.singleton('o1') === s1;
```

## Function `get(...args)`

The generated Singleton function has a property `get` that returns the singleton for any given set of arguments. This is actually the behavior of the Singleton function too, except that the latter would create the asked for singleton on the fly if it doesn't find it. Therefore use rather `Singleton.get` if you don't want to create singletons that are not found.

```js
import {SingletonFactory} from 'singletons';

class Class {
  constructor () {}
};

const Singleton = SingletonFactory(
  Class,
  [
    'object',
  ]
);
const s1 = Singleton(console);

Singleton.get(console) === s1;
Singleton.get(Number); // undefined;
```

## Preprocessing arguments

`SingletonFactory` can take a third argument, allowing to pass it a preprocessing function. This is useful when one has to handle inputs that don't match directly the provided hints, especially when passing already created singletons. On the one hand, passing a single singleton is handled by default (see [Special syntax: Singleton(singleton)](#special-syntax-singletonsingleton)). But on the other hand one may want to handle passing more than one singleton in conjunction with option 'rest: true'. This requires preprocessing, as shown in the example below.

```js
import {SingletonFactory} from 'singletons';

class Class {
  constructor (...chunks) {
    this.chunk = chunks.reduce(
      (str, chunk) => str + chunk, '');
  }
}

const Singleton = SingletonFactory(Class, [{type: 'literal', rest: true}], {
  preprocess: function (args) {
    return args.map(arg => {
      if (arg.chunk) {
        return arg.chunk;
      }
      return arg;
    });
  },
});
const refSingleton = SingletonFactory(Class,
  [{type: 'literal', rest: true}]);

const chunk1 = 'foo';
const chunk2 = 'bar';

const s1 = Singleton(chunk1);
const s2 = Singleton(chunk2);
const s3 = Singleton(chunk1, chunk2);
const s4 = Singleton(s1, s2);

s1 !== s2;
s1 !== s3;
s3 === s4;

const t1 = refSingleton(chunk1);
const t2 = refSingleton(chunk2);
const t3 = refSingleton(chunk1, chunk2);
const t4 = refSingleton(t1, t2);

t1 !== t2;
t1 !== t3;
t3 !== t4;
```

## Postprocessing an instance

Sometimes, you want to update your singleton on invocation. This is not advised as it can have side effects, but for example if you ignore some arguments using the type 'ignore', then whatever you use for these arguments on invocation will be discarded from the second call onwards, since the singleton will just be recalled and the constructor not called again. That's probably unwanted behavior and the option postprocess gives an opportunity to correct that.

To pass that option, use the third argument of the SingletonFactory. This option must be an object with property 'postprocess' as a function that takes all the arguments passed to the singleton as a single array argument. Use `this` to refer to the actual singleton instance.

```js
import {SingletonFactory} from 'singletons';

class Person {
  constructor (firstname, lastname, options) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.where = options.where;
  }
}

const Inhabitant = SingletonFactory(Person, [
  'literal', 'literal', 'ignore',
], {
  postprocess: function (args) {
    if (args && args[2] && args[2].where) {
      this.where = args[2].where;
    }
  },
});

const annie = new Inhabitant('Annie', 'Smith', {where: 'Los Angeles'});

annie.where === 'Los Angeles';
annie === Inhabitant('Annie', 'Smith');
annie.where === 'Los Angeles';
annie === Inhabitant('Annie', 'Smith', {where: 'New York'});
annie.where === 'New York';
```

## Spreadable singletons

Some singletons are wrappers around collections. You may want to create new ones by merging two or more. You can do it by using the `customArgs:spread` or `customArgs:shallowSpread` options (see [Passing custom arguments](#passing-custom-arguments)) in conjunction with the type you used as first argument in the factory.

But when that type is not accessible (that is you cannot create the Singleton function and are only allowed to configure it through an interface that hides the type from you), you can still have the merging functionality by using options `spread` and `shallowSpread` (provided the interface doesn't further filter the options you pass to SingletonFactory).

```js
import {SingletonFactory} from 'singletons';

function hidingFunction (options) {
  class Person {
    constructor (name) {
      this.name = name;
    }
  }

  class Persons {
    constructor (...names) {
      this.persons = names.map(name => new Person(name));
    }

    getNames () {
      return this.persons.map(person => person.name);
    }
  }

  return SingletonFactory(Persons, [{
    type: 'literal',
    rest: true,
  }], Object.assign({
    customArgs: [
      [Person, {
        convert (person) {
          return person.name;
        },
      }],

      [Array, {
        spread: true,
      }],
    ],
  }, options));
}

const Crowd = hidingFunction({
  spread (crowd) {
    return crowd.persons;
  },
});

const c1 = new Crowd('Nancy');
const c2 = new Crowd('Harry', 'Johnny', 'Sally');
const c3 = ['Peter', 'Paul', 'Pauline', 'Louis'];

const crowd = new Crowd('Sam', c1, c2, c3);

expect(crowd.getNames()).to.eql([
  'Sam', 'Nancy',
  'Harry', 'Johnny', 'Sally',
  'Peter', 'Paul', 'Pauline', 'Louis',
]);
```

## Passing custom arguments

On top of [preprocessing](#preprocessing-arguments) or [postprocessing](#postprocessing-an-instance) as a whole, you may need even finer control, such as when your singletons have only loosely related structures.

For example, a contact is definitely a singleton, is uniquely identified with a few parameters but may have many more associated. As ways to handle them blow up, you need dynamically to make your singletons understand how to construct themselves, or update themselves. The whole point of `singletons` is to be able to access your data through a finite set of unique, intuitive parameters, so neither maps with object keys, arrays of references, integer indexing will work, but on the other hand, you can't any more create your singletons straightforwardly with static, ordered parameters.

So you may also pass `customArgs` as third argument. It is an array of 2-sized arrays. The first element is a custom class, the second a literal object with several possible options as functions to process the arguments of your custom type:

* `convert`: Arguments of your custom type are replaced by the output of this function. If this option is not set, the custom arguments are not passed through as singleton parameters, but they are still considered for postprocessing.
* `reduce`: All arguments of your custom type are reduced to one argument of the same type or another before postprocessing, but after all other operations. If you need to reduce first, either use `[`preprocess`](#preprocessing-arguments)`, or reduce them outside and pass only the result of the reduction (of a regular type or of a new custom type created just for the occasion!).
* `spread`: Arguments of your custom type are converted to lists of regular initializing args that are spread in place in the sequence of all init args, recursively. Beware of cyclical references. You may prefer to use `shallowSpread` instead.
* `shallowSpread`: Arguments of your custom type are converted to lists of regular initializing args that are spread in place in the sequence of all init args. Just the init args are affected. You won't enter an infinite loop if there are cyclical references.
* `postprocess`: What to do with your custom or reduced types once your singleton is created or updated.

If you need to spread arguments deeply but they cross-reference, you must use [`preprocess`](#preprocessing-arguments) instead of `customArgs:spread` and you must work out some circumvoluted logic on your own. Good luck!

```js
import {SingletonFactory} from 'singletons';

class Name {
  constructor (name) {
    this.name = name;
    this.friends = new Set();
  }
}

class Age {
  constructor (age) {
    this.age = age;
  }
}

class Gender {
  constructor (gender) {
    this.gender = gender;
  }
}

class Country {
  constructor (country) {
    this.country = country;
  }
}

class Friend {
  constructor (friend) {
    this.friend = friend;
  }
}

const Contact = SingletonFactory(Name, ['literal'], {
  customArgs: [
    [Name, {
      convert ({name}) {
        return name;
      },
    }],
    [Age, {
      postprocess ({age}) {
        this.age = age;
      },
    }],
    [Gender, {
      postprocess ({gender}) {
        this.gender = gender;
      },
    }],
    [Country, {
      postprocess ({country}) {
        this.country = country;
      },
    }],
    [Friend, {
      reduce (friends) {
        return friends.map(friend => friend.friend);
      },
      postprocess (friends) {
        friends.forEach(friend => this.friends.add(new Contact(friend)));
      },
    }],
  ],
});

const paul = new Contact('Paul');
const paula = new Contact(new Name('Paula'), new Gender('female'));
const john = new Contact(new Country('England'), 'John', new Age(55));

paul.name === 'Paul';
paula.name === 'Paula';
john.name === 'John';

paula.gender === 'female';
john.age === 55;
john.country === 'England';

expect(new Contact('John', new Gender('male'), new Age(56),
  new Country('France'), new Friend('Paula'),
  new Friend('Paul'))).to.equal(john);
john.gender === 'male';
john.age === 56;
john.country === 'France';

john.friends.has(paula); // true;
john.friends.has(paul); // true;
john.friends.size === 2;

const Friends = SingletonFactory(Array, [{
  type: 'literal',
  rest: true,
}], {
  customArgs: [
    [Name, {
      spread (contact) {
        return Array.from(contact.friends || []).map(
          contact => new Friend(contact.name));
      },
    }],
    [Friend, {
      convert (friend) {
        return friend.friend;
      },
    }],
  ],
});

const friends = new Friends(john);
expect(friends).to.eql(['Paula', 'Paul']);

const Friends2 = SingletonFactory(Array, [{
  type: 'literal',
  rest: true,
}], {
  customArgs: [
    [Name, {
      shallowSpread (contact) {
        return Array.from(contact.friends || []);
      },
      convert (contact) {
        return contact.name;
      },
    }],
  ],
});

const friends2 = new Friends2(john);
expect(friends2).to.eql(['Paula', 'Paul']);
```


## License

singletons is [MIT licensed](./LICENSE).

© 2016-2017 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
