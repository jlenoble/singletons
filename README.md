# singletons
Helps create and manage families of singletons based on customizable conditions

## Use case

Sometimes your functions handle data that match one-to-one to an object, but your don't have that object in the scope, and don't want to create a new one (especially if the object has states that could already have been mutated).

SingletonFactory is provided by module 'singletons'. Given a constructor and a set of options hinting on what to expect, it returns a Singleton function that will always return the same object constructed once from the passed constructor and the same set of arguments (strict equality).

## SingletonFactory syntax

SingletonFactory takes two arguments. The first one specifies the constructor for the singletons, and the second one is a function or an array with at least as many arguments or elements as you expect data to index your objects. For example if it matters to you that methods be considered different if they are not bound to the same object, then you will need two arguments: One indexing the object and one indexing the method.

If you provide a function, it should take as arguments your indexes and return a unique key as a string. But if you provide an array of options, a custom function will be generated for you using module [keyfunc](https://www.npmjs.com/package/keyfunc).

In the latter case, options should hint on the nature of the expected indexing data. Keywords are 'object', 'literal', 'property', 'array' and 'set' used as in the following example:

```js
import {SingletonFactory} from 'singletons';

class Class {constructor() {}}

const Singleton = SingletonFactory(
  Class, // Constructor for the singletons
  [
    'object', // First argument must be an object matched strictly
    'literal', // Second argument can be anything matched literally
    {property: 'color'}, // Third argument can be anything matched literally from their property 'id' downwards
    'array', // Fourth argument is an array of 'object'
    'set' // Fifth argument is a set of 'object'
  ]
);

const obj = {id: 1};
const s1 = Singleton(console, 'log', {color: 'red'}, [console, obj],
  [console, obj]);
const s2 = Singleton(console, 'log', {color: 'red'}, [console, obj],
  [obj, console]);

s1 === s2; // true
s1 instanceof Class; // true
```

## Function key(...args)

The generated Singleton function has a property ```key``` that returns the
generated key for any given set of arguments.

```js
import {SingletonFactory} from 'singletons';

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
import {SingletonFactory} from 'singletons';

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

* ```rest```: If omitted, the number of arguments of the generated Singleton function is exactly that passed to SingletonFactory; if true for one argument, then the corresponding key function  will be used for all arguments not hinted in SingletonFactory; If several rest options are defined, only the first one is taken into account.

```js
import {SingletonFactory} from 'singletons';

class Class {constructor() {}}

const Singleton = SingletonFactory(Class, [
  {
    stem: 'first'
  },
  {
    stem: 'second',
    type: 'literal',
    rest: true
  },
  {
    stem: 'third',
    property: 'color'
  },
  {
    stem: 'fourth',
    type: 'array'
  },
  {
    stem: 'fifth',
    type: 'set'
  }
]);

const obj = {id: 1};
/first1_second[0-9a-f]{40}_third[0-9a-f]{40}_fourth[0-9a-f]{40}_fifth[0-9a-f]{40}_second[0-9a-f]{40}/.test(
  Singleton.key(console, 'log', {color: 'red'}, [console, obj], [obj, console], 'dummy')); // true
```

## 'object' vs 'literal' vs 'property'

There are advantages and drawbacks pertaining to each option type. Choose with caution.

### 'object' option

Use this if you know your objects are persistent. When used on literals, you may end up with tons of singletons, a sign of a poor design. But this option allows for user-friendly (human-readable) keys, making accessing singletons easier.

```js
import {SingletonFactory} from 'singletons';

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
import {SingletonFactory} from 'singletons';

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
import {SingletonFactory} from 'singletons';

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

## 'array' vs 'set'

When using arrays as arguments, you may either match them simply by using the 'literal' option, or using the 'array' or 'set' options. In the latter case, each element in the list is matched using the 'object' option.

### 'array' option

Use this when matching arrays where order matters and matching literal objects should be considered different.

```js
import {SingletonFactory} from 'singletons';

class Class {constructor() {}}

const Singleton = SingletonFactory(Class, ['array']);

const option1 = {color: 'red'};
const option2 = {color: 'green'};
const option3 = {color: 'blue'};

const s1 = Singleton([option1, option2, option3]);
const s2 = Singleton([option3, option2, option1]);
const s3 = Singleton([option1, option2, option3]);

s1 !== s2; // true
s1 === s3; // true
```

### 'set' option

Use this when matching arrays where order doesn't matter and matching literal objects shoud be considered different.

```js
import {SingletonFactory} from 'singletons';

class Class {constructor() {}}

const Singleton = SingletonFactory(Class, ['set']);

const option1 = {color: 'red'};
const option2 = {color: 'green'};
const option3 = {color: 'blue'};

const s1 = Singleton([option1, option2, option3]);
const s2 = Singleton([option3, option2, option1]);
const s3 = Singleton([option1, option2, option3]);

s1 === s2; // true
s1 === s3; // true
```

## License

singletons is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
