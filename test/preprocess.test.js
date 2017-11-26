import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';
import signature from 'sig';

describe('Testing preprocess option', function () {
  it(`Testing with SingletonFactory(Class, ['literal'], {
    preprocess: function(args) {
      return args.map(arg => 'pre_' + arg);
    }
  })`, function () {
      class Class {
        constructor () {}
      }

      const Singleton = SingletonFactory(Class, ['literal'], {
        preprocess: function (args) {
          return args.map(arg => 'pre_' + arg);
        },
      });

      const s1 = Singleton('n1');
      expect(Singleton.key(s1)).to.equal(signature('pre_n1'));
    });

  it(`Testing with SingletonFactory(Class, ['object'], {
    preprocess: function(args) {
      return args.map(arg => {
        if (Singleton.get(arg)) {
          return arg;
        }
        if (arg instanceof N) {
          return arg.n + 10;
        }
        return arg;
      });
    }
  })`, function () {
      class N {
        constructor (n) {
          this.n = n;
        }
      }

      const Singleton = SingletonFactory(N, ['literal'], {
        preprocess: function (args) {
          return args.map(arg => {
            if (Singleton.get(arg)) {
              return arg;
            }
            if (arg instanceof N) {
              return arg.n + 10;
            }
            return arg;
          });
        },
      });

      const s1 = Singleton(1); // No preprocessing
      expect(Singleton.key(s1)).to.equal(signature(1));

      const s2 = Singleton(s1); // No preprocessing
      expect(s2).to.equal(s1);

      const n = new N(2);
      const s3 = Singleton(n);
      expect(Singleton.key(s3)).not.to.equal(signature(n));
      expect(Singleton.key(s3)).to.equal(signature(12));
    });
});
