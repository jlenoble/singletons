## Spreadable singletons !heading

Some singletons are wrappers around collections. You may want to create new ones by merging two or more. You can do it by using the `customArgs:spread` or `customArgs:shallowSpread` options (see [Passing custom arguments](#passing-custom-arguments)) in conjunction with the type you used as first argument in the factory.

But when that type is not accessible (that is you cannot create the Singleton function and are only allowed to configure it through an interface that hides the type from you), you can still have the merging functionality by using options `spread` and `shallowSpread` (provided the interface doesn't further filter the options you pass to SingletonFactory).

#include "build/docs/examples/spreadable-singletons.test.md"
