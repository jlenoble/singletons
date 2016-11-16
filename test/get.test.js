import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';

describe('Testing Singleton.get', function() {

  it(`Testing with SingletonFactory(Class, ['object'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['object']);

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};

    const s1 = Singleton(o1);
    const s2 = Singleton(o2);

    expect(s1).not.to.equal(s2);

    expect(Singleton.get(o1)).to.equal(s1);
    expect(Singleton.get(o2)).to.equal(s2);
    expect(Singleton(o1)).to.equal(s1);
    expect(Singleton(o2)).to.equal(s2);

    expect(Singleton.get(o3)).to.be.undefined;

    const s3 = Singleton(o3);
    expect(Singleton.get(o3)).to.equal(s3);
    expect(Singleton(o3)).to.equal(s3);

    expect(s1).not.to.equal(s3);
    expect(s2).not.to.equal(s3);

  });

});
