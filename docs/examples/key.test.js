import {expect} from 'chai';
import {SingletonFactory} from '../../src/singletons';

describe(`Testing README.md examples`, function () {
  it('Function key(...args) example', function () {
    class Class {
      constructor () {}
    };

    const Singleton = SingletonFactory(
      Class,
      [
        'object',
      ]
    );

    expect(Singleton.key(console)).to.equal('o1');
    expect(Singleton.key(new Class())).to.equal('o2');
    expect(Singleton.key(console)).to.equal('o1');
    expect(Singleton.key(new Class())).to.equal('o3');
  });
});
