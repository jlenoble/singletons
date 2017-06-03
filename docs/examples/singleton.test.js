import {expect} from 'chai';
import {SingletonFactory} from '../../src/singletons';

describe(`Testing README.md examples`, function () {
  it('Function singleton(key) example', function () {
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

    expect(Singleton.singleton('o1')).to.equal(s1);
  });
});
