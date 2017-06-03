import {expect} from 'chai';
import {SingletonFactory} from '../../src/singletons';

describe(`Testing README.md examples`, function () {
  it(`Special syntax: Singleton(singleton)`, function () {
    class Class {
      constructor () {}
    };

    const Singleton = SingletonFactory(Class, ['object']);

    const option1 = {color: 'red'};

    const s1 = Singleton(option1);
    const s2 = Singleton(option1);
    const s3 = Singleton(s1);

    expect(s1).to.equal(s2);
    expect(s1).to.equal(s3);
  });
});
