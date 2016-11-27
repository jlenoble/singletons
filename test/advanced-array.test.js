import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';

describe('Testing Singleton with array', function() {

  it(`Calling SingletonFactory(Class, ['array:object'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['array:object']);

    const c1 = new Class();
    const c2 = new Class();
    const c3 = new Class();

    const s1 = Singleton([c1, c2, c3]);
    const s2 = Singleton([c3, c2, c1]);
    const s3 = Singleton([c1, c2, c3]);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);

  });

  it(`Calling SingletonFactory(Class, ['array:literal'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['array:literal']);

    const c1 = new Class();
    const c2 = new Class();

    const s1 = Singleton([c1, c2, 1]);
    const s2 = Singleton([1, c2, c1]);
    const s3 = Singleton([c1, {}, 1]);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);

  });

  it(`Calling SingletonFactory(Class, ['array:property:id'])`, function() {

    class Class {constructor(id) {this.id = id}}

    const Singleton = SingletonFactory(Class, ['array:property:id']);

    const c1 = new Class(1);
    const c2 = new Class(2);

    const s1 = Singleton([c1, c2, {id: 3}]);
    const s2 = Singleton([{id: 3}, c2, c1]);
    const s3 = Singleton([c1, c2, {id: 3}]);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);

  });

  it(`Calling SingletonFactory(Class, ['array:array'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['array:array']);

    const c1 = new Class();
    const c2 = new Class();
    const c3 = new Class();

    const s1 = Singleton([[c1, c2], [c3]]);
    const s2 = Singleton([[c2, c1], [c3]]);
    const s3 = Singleton([[c1, c2], [c3]]);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);

  });

  it(`Calling SingletonFactory(Class, ['array:set'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['array:set']);

    const c1 = new Class();
    const c2 = new Class();
    const c3 = new Class();

    const s1 = Singleton([[c1, c2], [c3]]);
    const s2 = Singleton([[c2, c1], [c3]]);
    const s3 = Singleton([[c1, c2], [c3]]);

    expect(s1).to.equal(s2);
    expect(s1).to.equal(s3);

  });

});

describe('Testing Singleton with set', function() {

  it(`Calling SingletonFactory(Class, ['set:object'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['set:object']);

    const c1 = new Class();
    const c2 = new Class();
    const c3 = new Class();

    const s1 = Singleton([c1, c2, c3]);
    const s2 = Singleton([c3, c2, c1]);
    const s3 = Singleton([c1, c2, c3]);

    expect(s1).to.equal(s2);
    expect(s1).to.equal(s3);

  });

  it(`Calling SingletonFactory(Class, ['set:literal'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['set:literal']);

    const c1 = new Class();
    const c2 = new Class();

    const s1 = Singleton([c1, c2, 1]);
    const s2 = Singleton([1, c2, c1]);
    const s3 = Singleton([c1, {}, 1]);

    expect(s1).to.equal(s2);
    expect(s1).to.equal(s3);

  });

  it(`Calling SingletonFactory(Class, ['set:property:id'])`, function() {

    class Class {constructor(id) {this.id = id}}

    const Singleton = SingletonFactory(Class, ['set:property:id']);

    const c1 = new Class(1);
    const c2 = new Class(2);

    const s1 = Singleton([c1, c2, {id: 3}]);
    const s2 = Singleton([{id: 3}, c2, c1]);
    const s3 = Singleton([c1, c2, {id: 3}]);

    expect(s1).to.equal(s2);
    expect(s1).to.equal(s3);

  });

  it(`Calling SingletonFactory(Class, ['set:array'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['set:array']);

    const c1 = new Class();
    const c2 = new Class();
    const c3 = new Class();

    const s1 = Singleton([[c1, c2], [c3]]);
    const s2 = Singleton([[c3], [c1, c2]]);
    const s3 = Singleton([[c1, c2], [c3]]);

    expect(s1).to.equal(s2);
    expect(s1).to.equal(s3);

  });

  it(`Calling SingletonFactory(Class, ['set:set'])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['set:set']);

    const c1 = new Class();
    const c2 = new Class();
    const c3 = new Class();

    const s1 = Singleton([[c1, c2], [c3]]);
    const s2 = Singleton([[c3], [c2, c1]]);
    const s3 = Singleton([[c1, c2], [c3]]);

    expect(s1).to.equal(s2);
    expect(s1).to.equal(s3);

  });

});
