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
    expect(Singleton.get({id: 3})).to.be.undefined;
    expect(Singleton.get({id: 3, color: 'red'})).to.be.undefined;
    expect(Singleton(o3)).to.equal(s3);

    expect(s1).not.to.equal(s3);
    expect(s2).not.to.equal(s3);

  });

  it(`Testing with SingletonFactory(Class, ['literal'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['literal']);

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
    expect(Singleton.get({id: 3})).to.equal(s3);
    expect(Singleton.get({id: 3, color: 'red'})).to.be.undefined;
    expect(Singleton(o3)).to.equal(s3);

    expect(s1).not.to.equal(s3);
    expect(s2).not.to.equal(s3);

  });

  it(`Testing with SingletonFactory(Class, [{property: 'id'}])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, [{property: 'id'}]);

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
    expect(Singleton.get({id: 3})).to.equal(s3);
    expect(Singleton.get({id: 3, color: 'red'})).to.equal(s3);
    expect(Singleton(o3)).to.equal(s3);

    expect(s1).not.to.equal(s3);
    expect(s2).not.to.equal(s3);

  });

  it(`Testing with SingletonFactory(Class, ['array'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['array']);

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};

    const s1 = Singleton([o1, o2, o3]);
    const s2 = Singleton([o1, o2]);

    expect(s1).not.to.equal(s2);

    expect(Singleton.get([o1, o2, o3])).to.equal(s1);
    expect(Singleton.get([o1, o2])).to.equal(s2);
    expect(Singleton([o1, o2, o3])).to.equal(s1);
    expect(Singleton([o1, o2])).to.equal(s2);

    expect(Singleton.get([o2, o3])).to.be.undefined;

    const s3 = Singleton([o2, o3]);
    expect(Singleton.get([o2, o3])).to.equal(s3);
    expect(Singleton.get([o3, o2])).to.be.undefined;
    expect(Singleton.get([o2, {id: 3}])).to.be.undefined;
    expect(Singleton.get([o2, {id: 3, color: 'red'}])).to.be.undefined;
    expect(Singleton([o2, o3])).to.equal(s3);

    expect(s1).not.to.equal(s3);
    expect(s2).not.to.equal(s3);

  });

  it(`Testing with SingletonFactory(Class, ['set'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['set']);

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};

    const s1 = Singleton([o1, o2, o3]);
    const s2 = Singleton([o1, o2]);

    expect(s1).not.to.equal(s2);

    expect(Singleton.get([o1, o2, o3])).to.equal(s1);
    expect(Singleton.get([o1, o2])).to.equal(s2);
    expect(Singleton([o1, o2, o3])).to.equal(s1);
    expect(Singleton([o1, o2])).to.equal(s2);

    expect(Singleton.get([o2, o3])).to.be.undefined;

    const s3 = Singleton([o2, o3]);
    expect(Singleton.get([o2, o3])).to.equal(s3);
    expect(Singleton.get([o3, o2])).to.equal(s3);
    expect(Singleton.get([o2, {id: 3}])).to.be.undefined;
    expect(Singleton.get([o2, {id: 3, color: 'red'}])).to.be.undefined;
    expect(Singleton([o2, o3])).to.equal(s3);

    expect(s1).not.to.equal(s3);
    expect(s2).not.to.equal(s3);

  });

});
