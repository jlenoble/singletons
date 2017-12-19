import {expect} from 'chai';
import {SingletonFactory} from '../../src/singletons';

describe(`Testing README.md examples`, function () {
  it('Function looseGet(...args) example', function () {
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
    const s1 = Singleton('hello');

    expect(Singleton.get('hello')).to.be.undefined;
    expect(Singleton.get('hello!')).to.equal(s1);

    expect(Singleton.looseGet('hello')).to.equal(s1);
    expect(Singleton.looseGet('hello!')).to.equal(s1);
    expect(Singleton.looseGet('hello!!')).to.be.undefined;
  });
});
