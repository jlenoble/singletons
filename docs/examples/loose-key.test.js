import {expect} from 'chai';
import {SingletonFactory} from '../../src/singletons';
import sig from 'sig';

describe(`Testing README.md examples`, function () {
  it('Function looseKey(...args) example', function () {
    class Class {
      constructor (str) {
        this.str = str;
      }
    };

    const Singleton = SingletonFactory(
      Class,
      ['literal'],
      {
        customArgs: [
          [String, {
            convert (arg) {
              return arg.match(/!$/) ? arg : arg + '!';
            },
          }],
        ],
      }
    );

    expect(Singleton.key('hello')).to.equal(sig('hello'));
    expect(Singleton.key('hello!')).to.equal(sig('hello!'));

    expect(Singleton.looseKey('hello')).to.equal(sig('hello!'));
    expect(Singleton.looseKey('hello!')).to.equal(sig('hello!'));
  });
});
