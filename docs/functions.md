## Function `key(...args)` !heading

The generated Singleton function has a property `key` that returns the
generated key for any given set of arguments.

#include "build/docs/examples/key.test.md"

## Function `singleton(key)` !heading

The generated Singleton function has a property `singleton` that returns the singleton referenced by a specific key.

#include "build/docs/examples/singleton.test.md"

## Function `get(...args)` !heading

The generated Singleton function has a property `get` that returns the singleton for any given set of arguments. This is actually the behavior of the Singleton function too, except that the latter would create the asked for singleton on the fly if it doesn't find it. Therefore use rather `Singleton.get` if you don't want to create singletons that are not found.

#include "build/docs/examples/get.test.md"

## Function `looseKey(...args)` !heading

Whereas `key` requires an exact match, `looseKey` will preprocess its arguments with the same helpers you provided for `Singleton`, then only it will return the generated key.

Never use this function within one of your preprocessing helpers, as you would enter an infinite loop resulting in a maximum call stack size error.

#include "build/docs/examples/loose-key.test.md"

## Function `looseGet(...args)` !heading

Whereas `get` requires an exact match, `looseGet` will preprocess its arguments with the same helpers you provided for `Singleton`, then only it will return the found singleton or nothing if the preprocessed args still match nothing.

Never use this function within one of your preprocessing helpers, as you would enter an infinite loop resulting in a maximum call stack size error.

#include "build/docs/examples/loose-get.test.md"
