import {expect} from 'chai';
import {SingletonFactory} from '../../src/singletons';

describe(`Testing README.md examples`, function () {
  it('Function get(...args) example', function () {
    class Class {
      constructor () {}
    };

    const Singleton = SingletonFactory(
      Class,
      [
        'object',
      ]
    );
    const s1 = Singleton(console);

    expect(Singleton.get(console)).to.equal(s1);
    expect(Singleton.get(Number)).to.be.undefined;
  });
});
