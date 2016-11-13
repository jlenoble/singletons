import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';

describe('Testing Singleton with array', function() {

  it(`Calling SingletonFactory(Class, ['array'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['array']);

    const c1 = new Class();
    const c2 = new Class();
    const c3 = new Class();

    const s1 = Singleton([c1, c2, c3]);
    const s2 = Singleton([c3, c2, c1]);
    const s3 = Singleton([c1, c2, c3]);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);

  });

  it(`Calling SingletonFactory(Class, ['set'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['set']);

    const c1 = new Class();
    const c2 = new Class();
    const c3 = new Class();

    const s1 = Singleton([c1, c2, c3]);
    const s2 = Singleton([c3, c2, c1]);
    const s3 = Singleton([c1, c2, c3]);

    expect(s1).to.equal(s2);
    expect(s1).to.equal(s3);

  });

});
