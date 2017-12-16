import {expect} from 'chai';
import {SingletonFactory} from '../../src/singletons';

describe(`Testing README.md examples`, function () {
  it('Preprocessing arguments', function () {
    class Class {
      constructor (...chunks) {
        this.chunk = chunks.reduce(
          (str, chunk) => str + chunk, '');
      }
    }

    const Singleton = SingletonFactory(Class, [{type: 'literal', rest: true}], {
      preprocess: function (args) {
        return args.map(arg => {
          if (arg.chunk) {
            return arg.chunk;
          }
          return arg;
        });
      },
    });
    const refSingleton = SingletonFactory(Class,
      [{type: 'literal', rest: true}]);

    const chunk1 = 'foo';
    const chunk2 = 'bar';

    const s1 = Singleton(chunk1);
    const s2 = Singleton(chunk2);
    const s3 = Singleton(chunk1, chunk2);
    const s4 = Singleton(s1, s2);

    expect(s1).not.to.equal(s2);
    expect(s1).not.to.equal(s3);
    expect(s3).to.equal(s4);

    const t1 = refSingleton(chunk1);
    const t2 = refSingleton(chunk2);
    const t3 = refSingleton(chunk1, chunk2);
    const t4 = refSingleton(t1, t2);

    expect(t1).not.to.equal(t2);
    expect(t1).not.to.equal(t3);
    expect(t3).not.to.equal(t4);
  });
});
