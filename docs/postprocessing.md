## Postprocessing an instance !heading

Sometimes, you want to update your singleton on invocation. This is not advised as it can have side effects, but for example if you ignore some arguments using the type 'ignore', then whatever you use for these arguments on invocation will be discarded from the second call onwards, since the singleton will just be recalled and the constructor not called again. That's probably unwanted behavior and the option postprocess gives an opportunity to correct that.

To pass that option, use the third argument of the SingletonFactory. This option must be an object with property 'postprocess' as a function that takes all the arguments passed to the Singleton as second argument (array). Use `this` to refer to the actual singleton instance.

#include "build/docs/examples/postprocessing.test.md"
