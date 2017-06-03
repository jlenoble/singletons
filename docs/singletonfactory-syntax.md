## SingletonFactory syntax !heading

SingletonFactory takes generally two arguments. The first one specifies the constructor for the singletons, and the second one is a function or an array with at least as many arguments or elements as you expect data to index your objects. For example if it matters to you that methods be considered different if they are not bound to the same object, then you will need two arguments: One indexing the object and one indexing the method.

If you provide a function, it should take as arguments your indexes and return a unique key as a string. But if you provide an array of options, a custom function will be generated for you using module [keyfunc](https://www.npmjs.com/package/keyfunc).

In the latter case, options should hint on the nature of the expected indexing data. Keywords are 'object', 'literal', 'property', 'option', 'array', 'set' and 'ignore' used as in the following example:

#include "build/docs/examples/singletonfactory-syntax.test.md"

For advanced combinations of hints, of which there are many, see [keyfunc](https://www.npmjs.com/package/keyfunc) documentation.
