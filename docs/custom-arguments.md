## Passing custom arguments !heading

On top of [preprocessing](#preprocessing-arguments) or [postprocessing](#postprocessing-an-instance) as a whole, you may need even finer control, such as when your singletons have only loosely related structures.

For example, a contact is definitely a singleton, is uniquely identified with a few parameters but may have many more associated. As ways to handle them blow up, you need dynamically to make your singletons understand how to construct themselves, or update themselves. The whole point of `singletons` is to be able to access your data through a finite set of unique, intuitive parameters, so neither maps with object keys, arrays of references, integer indexing will work, but on the other hand, you can't any more create your singletons straightforwardly with static, ordered parameters.

So you may also pass `customArgs` as third argument. It is an array of 2-sized arrays. The first element is a custom class, the second a literal object with several possible options as functions to process the arguments of your custom type:

* `convert`: Arguments of your custom type are replaced by the output of this function. If this option is not set, the custom arguments are not passed through as singleton parameters, but they are still considered for further processing by other custom functions.
* `reduce`: All arguments of your custom type are first reduced to one argument of the same type or another. It is then converted if possible, passed through or not, etc.
* `postprocess`: What to do with your custom types once your singleton is created or updated.

#include "build/docs/examples/custom-arguments.test.md"
