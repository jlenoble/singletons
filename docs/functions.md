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
