## Preprocessing arguments !heading

`SingletonFactory` can take a third argument, allowing to pass it a preprocessing function. This is useful when one has to handle inputs that don't match directly the provided hints, especially when passing already created singletons. On the one hand, passing a single singleton is handled by default (see [Special syntax: Singleton(singleton)](#special-syntax-singletonsingleton)). But on the other hand one may want to handle passing more than one singleton in conjunction with option 'rest: true'. This requires preprocessing, as shown in the example below.

#include "build/docs/examples/preprocessing.test.md"
