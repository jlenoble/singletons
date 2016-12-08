# singletons
Helps create and manage families of singletons based on customizable conditions

## Use case

Sometimes your functions handle data that match one-to-one to an object, but your don't have that object in the scope, and don't want to create a new one (especially if the object has states that could already have been mutated).

SingletonFactory is provided by module 'singletons'. Given a constructor and a set of options hinting on what to expect, it returns a Singleton function that will always return the same object constructed once from the passed constructor and the same set of arguments (strict equality).

## SingletonFactory syntax

SingletonFactory takes generally two arguments. The first one specifies the constructor for the singletons, and the second one is a function or an array with at least as many arguments or elements as you expect data to index your objects. For example if it matters to you that methods be considered different if they are not bound to the same object, then you will need two arguments: One indexing the object and one indexing the method.

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

See also [Advanced usage](#advanced-usage) for constructs ```'array:*'``` and ```'set:*'```. See [property:*](#property) for construct ```property:*```.

## Function ```key(...args)```

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

## Function ```singleton(key)```

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

## Function ```get(...args)```

The generated Singleton function has a property ```get``` that returns the singleton for any given set of arguments. This is actually the behavior of the Singleton function too, except that the latter would create the asked for singleton on the fly if it doesn't find it. Therefore use rather ```Singleton.get``` if you don't want to create singletons that are not found.

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

Singleton.get(console) === s1; // true
Singleton.get(Number) === undefined; // true
```

### Options

* ```stem```: You may use option 'stem' to prepend to your keys a specific string. That helps figuring out what they were generated from. You need to use this option in combination with option 'type' if you want to use also an option type other than 'object' or 'property'.

* ```type```: Default is 'object'; Any option having a property 'property' forces the type to be 'property'. This option helps hint the type when other options are needed simultaneously.

* ```rest```: If omitted, the number of arguments of the generated key function is exactly that passed to keyFunc; if true for one argument, then the corresponding key function  will be used for all arguments not hinted in keyFunc; If several rest options are defined, only the first one is taken into account.

* ```unordered```: By default, the arguments passed to the generated key function are strictly ordered. If set to true, then 'unordered' option enforces 'rest: true' and limits keyFunc initialization to one type only so that the generated key function now doesn't enforce ordering any more. See [Unordered lists](#unordered-lists) for an example.

* ```sub```: Construct ```'array:*'``` allows to handle an ordered list of one type, but you often want an ordered list of mixed types. The ```sub``` option allows to handle this case. See [Mixed arrays](#mixed-arrays) for a discussion on its important use and its difference from a straight call to ```keyFunc```. See also See [Mixed properties](#mixed-properties).

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

Use this if you know your objects are persistent. When used on literals, you may end up with tons of singletons, a sign of a broken design. But this option allows for user-friendly (human-readable) keys, making accessing singletons easier.

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

## Special case: Singleton(singleton)

Some types can be initialized either from a set of data or from another instance. In order for a Singleton function not to get confused, each created singleton stores its key with a specific symbol associated uniquely to the Singleton function.

When a Singleton function is passed a singleton with its own symbol, it just returns it without any further processing, as expected from a singleton.

```js
import {SingletonFactory} from 'singletons';

class Class {constructor() {}}

const Singleton = SingletonFactory(Class, ['object']);

const option1 = {color: 'red'};

const s1 = Singleton(option1);
const s2 = Singleton(option1);
const s3 = Singleton(s1);

s1 === s2; // true
s1 === s3; // true
```

## Advanced Usage

Hints provided to SingletonFactory can get more complex for subtle usages. You're not bound to the five base types, but can use any of them within 'array', 'set' and 'property' types, allowing for hierarchical indexing.

### ```array:*``` and ```set:*```

By default, options ```'array'``` and ```'set'``` define arrays and sets of objects compared with strict equality (```===```). When the comparison can (or should) be relaxed or precised, those options can be extended as such:

* ```'array:literal'```: Expects an array of literals (strictly ordered).
* ```'array:property:[propertyName]'```: Expects an array of objects with property 'propertyName' (strictly ordered).
* ```'array:array'```: Expects an array (strictly ordered) of arrays (strictly ordered) of objects (strictly compared).
* ```'array:set'```: Expects an array (strictly ordered) of arrays (unordered) of objects (strictly compared).
* ```'set:literal'```: Expects an array of literals (unordered).
* ```'set:property:[propertyName]'```: Expects an array of objects with property 'propertyName' (unordered).
* ```'set:array'```: Expects an array (unordered) of arrays (strictly ordered) of objects (strictly compared).
* ```'set:set'```: Expects an array (unordered) of arrays (unordered) of objects (strictly compared).

For other element types, you will need to use option 'sub' instead. See [Mixed arrays](#mixed-arrays).

### ```property:*```

By default, option ```'property'``` indicates that objects will be compared with regard to a particular property, specified as an option: ```keyFunc({type:  'property', property: 'id'})``` for example.

The comparison in such cases will be done literally. But if you want another type of comparison, you may use the following:

* ```{type: 'property:object'}```: Expects property to be an object, strictly compared.
* ```{type: 'property:literal'}```: No difference from the default 'property'.
* ```{type: 'property:array'}```: Expects property to be an array (strictly ordered) of objects (strictly compared).
* ```{type: 'property:set'}```: Expects property to be an array (unordered) of objects (strictly compared).

**Note that ```'property:property:[propertyName]'```, though working, is not recommended**. The construct ```keyFunc(Class, [{type: 'property:property:id', property: 'data'}])``` is just too ambiguous and is better replaced by ```keyFunc(Class, [{property: 'data:id'}])``` (see [Deep properties](#deep-properties)).

For other property types, you will need to use option 'sub' instead. See [Mixed properties](#mixed-properties).

### Mixed arrays

With [```array:* and set:*```](#array-and-set), you get collections built from a single type, that is ```['object', 'object', ...]``` or ```['array', 'array', ...]``` for example. Using type hints as second argument of SingletonFactory, you can get keys from mixed types to index a singleton, but you do so one at a time. For example, ```(console, 'log')``` and ```(console, 'error')``` can map two singletons using ```keyFunc('object', 'literal')``` key function. But neither constructs allow to index collections of complex singletons: You can't index one for example with ```((console, 'log'), (console, 'error'))``` except by using ```keyFunc({type: 'literal', rest: true})```. But the latter option results in random side-effects once objects start getting mutated.

Therefore you need deep indexing with option ```'sub'```.

```js
import SingletonFactory from 'singletons';

class Class {}

const brokenSingleton = SingletonFactory(Class, [{type: 'literal', rest: true}]);

const goodSingleton = SingletonFactory(Class, [{
  type: 'array', // Mandatory
  sub: ['object', 'literal'],
  rest: true // Expects a list of mixed arrays, not only a single one
}]);

const o1 = {name: 1};
const o2 = {name: 2};
const o3 = {name: 3};

const broken = brokenSingleton([o1, 'name'], [o2, 'name'], [o3, 'name']);
const good = goodSingleton([o1, 'name'], [o2, 'name'], [o3, 'name']);

o1.name = 4;

// Though called broken, this may be intended behavior in your use
// case; it is 'broken' only with regard to this example intended behavior,
// which expects first arg of arrays to be evaluated strictly.
broken !== brokenSingleton([o1, 'name'], [o2, 'name'], [o3, 'name']);
broken === brokenSingleton([{name: 1}, 'name'], [o2, 'name'], [o3, 'name']);

good === goodSingleton([o1, 'name'], [o2, 'name'], [o3, 'name']);
good !== goodSingleton([{name: 1}, 'name'], [o2, 'name'], [o3, 'name']);
```

### Mixed properties

With [```property:*```](#property), just like for [```array:* and set:*```](#array-and-set), your properties point to base types like 'object' or 'array'. That is an improvement compared to default 'literal', but you will often want more flexibility and index your singletons with arbitrary types.

You can use the option 'sub' for that.

```js
import SingletonFactory from 'singletons';

class Class {}

const brokenSingleton = SingletonFactory(Class, [{property: 'data', rest: true}]);

const goodSingleton = SingletonFactory(Class, [{
  property: 'data', // Mandatory
  sub: {type: 'array', sub: ['object', 'literal']},
  rest: true // Expects a list of mixed arrays, not only a single one
}]);

const o1 = {name: 1};
const o2 = {name: 2};
const o3 = {name: 3};

const broken = brokenSingleton({data: [o1, 'name']}, {data: [o2, 'name']},
  {data: [o3, 'name']});
const good = goodSingleton({data: [o1, 'name']}, {data: [o2, 'name']},
  {data: [o3, 'name']});

o1.name = 4;

broken !== brokenSingleton({data: [o1, 'name']}, {data: [o2, 'name']},
  {data: [o3, 'name']});
broken === brokenSingleton({data: [{name: 1}, 'name']}, {data: [o2, 'name']},
  {data: [o3, 'name']});

good === goodSingleton({data: [o1, 'name']}, {data: [o2, 'name']},
  {data: [o3, 'name']});
good !== goodSingleton({data: [{name: 1}, 'name']}, {data: [o2, 'name']},
  {data: [o3, 'name']});
```  

### Deep properties

Using the syntax of [Mixed properties](#mixed-properties), it's cumbersome to write hints to get to a deep property. But you can refine your declaration of 'property' to create the same singleton. See the following example:

```js
import SingletonFactory from 'singletons';

class Class {
  constructor(thought) {this.thought = thought;}
}

const cumbersomeSingleton = SingletonFactory(Class, [{
  property: 'humanity',
  sub: {
    property: 'man',
    sub: {
      property: 'brain',
      sub: {
        property: 'thought'
      }
    }
  }
}]);
const straightSingleton = SingletonFactory(Class, [{property: 'humanity:man:brain:thought'}]);

const o = {humanity: {man: {brain: {thought: 'Duh?'}}}};

cumbersomeSingleton(o) === cumbersomeSingleton({humanity: {man: {brain: {thought: 'Duh?'}}}});
cumbersomeSingleton(o) !== cumbersomeSingleton({humanity: {man: {brain: {thought: 'Da!'}}}});
straightSingleton(o) === straightSingleton({humanity: {man: {brain: {thought: 'Duh?'}}}});
straightSingleton(o) !== straightSingleton({humanity: {man: {brain: {thought: 'Da!'}}}});
cumbersomeSingleton(o).thought === straightSingleton(o)).thought;
cumbersomeSingleton.key(o) === straightSingleton.key(o));
// Comparing keys, not objects which are from distinct factories,
// therefore are distinct.
```

### Unordered lists

Hints provided to SingletonFactory generates key functions that, when they accept more than one argument, enforce strict ordering of those arguments. This is due to the fact that by default, arguments don't share their type, and therefore don't share the function that generates their keys.

But since all singletons have the same type, they are initialized for similar sets of arguments and strict ordering may sometimes be too restrictive. With option 'unordered' provided to the first (and only) hint type, the limitation is lifted.

```js
import SingletonFactory from 'singletons';

class Person {
  constructor(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
  }
}

class Family {
  constructor(...members) {
    this.members = members.map(member => new Person(...member));
  }
}

const oFamily = SingletonFactory(Family,
  [{type: 'array', sub: ['literal', 'literal'], rest: true}]);
const uFamily = SingletonFactory(Family,
  [{type: 'array', sub: ['literal', 'literal'], unordered: true}]);

const info1 = ['Adam', 'Blue'];
const info2 = ['Betsy', 'Blue'];
const info3 = ['Charlotte', 'Blue'];

const daddyMummyDaughter = oFamily(info1, info2, info3);
const family = uFamily(info1, info2, info3);

daddyMummyDaughter !== oFamily(info3, info2, info1);
family === uFamily(info3, info2, info1);
```

### Preprocessing arguments

```SingletonFactory``` can take a third argument, allowing to pass it a preprocessing function. This is useful when one has to handle inputs that don't match directly the provided hints, especially when passing already created singletons. On the one hand, passing a single singleton is handled by default (see [Special case: Singleton(singleton)](#special-case-singleton-singleton)). But on the other hand one may want to handle passing more than one singleton in conjunction with option 'rest: true'. This requires preprocessing, as shown in the following example.

```js
import SingletonFactory from 'singletons';

class Class {
  constructor(...chunks) {this.chunk = ['', ...chunks].reduce(
    (str, chunk) => str + chunk);}
}

const Singleton = SingletonFactory(Class, [{type: 'literal', rest: true}],
function(args) {
  return args.map(arg => {
    if (arg.chunk) {
      return arg.chunk;
    }
    return arg;
  });
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
s3 === s4; // Preprocessing handled already created objects

const t1 = refSingleton(chunk1);
const t2 = refSingleton(chunk2);
const t3 = refSingleton(chunk1, chunk2);
const t4 = refSingleton(t1, t2);

t1 !== t2;
t1 !== t3;
t3 !== t4;
```

## License

singletons is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
