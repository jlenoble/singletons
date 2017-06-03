## Special syntax: `Singleton(singleton)` !heading

Some types can be initialized either from a set of data or from another instance. In order for a Singleton function not to get confused, each created singleton stores its key with a specific symbol associated uniquely to the Singleton function.

When a Singleton function is passed a singleton with its own symbol, it just returns it without any further processing, as expected from a singleton.

#include "build/docs/examples/special-syntax.test.md"
