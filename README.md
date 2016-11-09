# singletons
Helps create and manage families of singletons based on customizable conditions

## Use case

Sometimes your functions handle data that match one-to-one to an object, but your don't have that object in the scope, and don't want to create a new one (especially if the object has states that could already have been mutated).

SingletonFactory is the default for module 'singletons'. Given a constructor and a set of options hinting on what to expect, it returns a Singleton function that will always return the same object constructed once from the passed constructor and the same set of arguments (strict equality).

## SingletonFactory syntax

SingletonFactory takes two arguments. The first one specifies the constructor for the singletons, and the second one is a function or an array with respectively as many arguments or elements as you expect data to index your objects. For example if it matters to you that methods be considered different if they are not bound to the same object, then you will need two arguments: One indexing the object and one indexing the method.

If you provide a function, it should take as arguments your indexes and return a unique key as a string. But if you provide an array of options, a custom function will be generated for you using module [keyfunc](https://www.npmjs.com/package/keyfunc).

In the latter case, options should hint on the nature of the expected indexing data. Keywords are 'object', 'literal' and 'property' used as in the following example:

```js
import SingletonFactory from 'singletons';

class Class {constructor() {}}

const Singleton = SingletonFactory(
  Class, // Constructor for the singletons
  [
    'object', // First argument must be an object matched strictly
    'literal', // Second argument can be anything matched literally
    {property: 'color'} // Third argument and all subsequent ones can be
    // anything matched literally from their property 'id' downwards
  ]
);

const s1 = Singleton(console, 'log', {color: 'red'});
const s2 = Singleton(console, 'log', {color: 'red'});

s1 === s2; // true
s1 instanceof Class; // true
```

## Function key(...args)

The generated Singleton function has a property ```key``` that returns the
generated key for any given set of arguments.

```js
import SingletonFactory from 'singletons';

class Class {constructor() {}}

const Singleton = SingletonFactory(
  Class,
  [
    'object'
  ]
);

Singleton.key(console) === '1'; // true
Singleton.key(new Class()) === '2'; // true
Singleton.key(console) === '1'; // true
Singleton.key(new Class()) === '3'; // true
```

## Function singleton(key)

The generated Singleton function has a property ```singleton``` that returns the singleton referenced by a specific key.

```js
import SingletonFactory from 'singletons';

class Class {constructor() {}}

const Singleton = SingletonFactory(
  Class,
  [
    'object'
  ]
);

const s1 = Singleton(console);

Singleton.singleton('1') === s1; // true
```

### Options

* ```stem```: You may use option 'stem' to prepend to your keys a specific string. That helps figuring out what they were generated from. You need to use this option in combination with option 'type' if you want to use also option 'literal'.

* ```type```: Often unused, as the default is 'object', and any option having a property 'property' forces the type to be 'property'. But when you use the option 'stem' and want a 'literal' treatment, then you need it.

```js
import SingletonFactory from 'singletons';

class Class {constructor() {}}

const Singleton = SingletonFactory(Class, [
  {
    stem: 'first'
  },
  {
    stem: 'second',
    type: 'literal'
  },
  {
    stem: 'third',
    property: 'color'
  }
]);

/first1_second[0-9a-f]{40}_third[0-9a-f]{40}/.test(
  Singleton.key(console, 'log', {color: 'red'})); // true
```

## 'object' vs 'literal' vs 'property'

There are advantages and drawbacks pertaining to each option type. Choose with caution.

### 'object' option

Use this if you know your objects are persistent. When used on literals, you may end up with tons of singletons, a sign of a poor design. But this option allows for user-friendly (human-readable) keys, making accessing singletons easier.

```js
import SingletonFactory from 'singletons';

class Class {constructor() {}}

const Singleton = SingletonFactory(Class, ['object']);

const option1 = {color: 'red'};

const s1 = Singleton(option1);
const s2 = Singleton({color: 'green'});
const s3 = Singleton({color: 'blue'});

s1 !== s2; // true
s2 !== s3; // true
s3 !== s1; // true

s1 === Singleton(option1); // true
s1 !== Singleton({color: 'red'}); // true
s1 !== Singleton({color: 'red', size: 'Huge'}); // true
```

### 'literal' option

Use this when literal equality is fine. This reduces the number of potential singletons, at the expense of key readability.

```js
import SingletonFactory from 'singletons';

class Class {constructor() {}}

const Singleton = SingletonFactory(Class, ['literal']);

const option1 = {color: 'red'};

const s1 = Singleton(option1);
const s2 = Singleton({color: 'green'});
const s3 = Singleton({color: 'blue'});

s1 !== s2; // true
s2 !== s3; // true
s3 !== s1; // true

s1 === Singleton(option1); // true
s1 === Singleton({color: 'red'}); // true
s1 !== Singleton({color: 'red', size: 'Huge'}); // true
```

### 'property' option

Use this when matching on a specific property. This even further reduces the number of generated singletons, but now you run the risk of matching pretty unrelated things.

```js
import SingletonFactory from 'singletons';

class Class {constructor() {}}

const Singleton = SingletonFactory(Class, [{property: 'color'}]);

const option1 = {color: 'red'};

const s1 = Singleton(option1);
const s2 = Singleton({color: 'green'});
const s3 = Singleton({color: 'blue'});

s1 !== s2; // true
s2 !== s3; // true
s3 !== s1; // true

s1 === Singleton(option1); // true
s1 === Singleton({color: 'red'}); // true
s1 === Singleton({color: 'red', size: 'Huge'}); // true
```
## License

singletons is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
