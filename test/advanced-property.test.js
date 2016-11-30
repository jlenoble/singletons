import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';

describe('Testing Singleton with property', function() {

  it(`Calling SingletonFactory(Class, [{
    type: 'property:object',
    property: 'data'
  }])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, [{
      type: 'property:object',
      property: 'data'
    }]);

    const o1 = {};
    const o2 = {};

    const c1 = {data: o1};
    const c2 = {data: o2};
    const c3 = {data: o1};

    const s1 = Singleton(c1);
    const s2 = Singleton(c2);
    const s3 = Singleton(c3);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);

  });

  it(`Calling SingletonFactory(Class, [{
    type: 'property:literal',
    property: 'id'
  }])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, [{
      type: 'property:literal',
      property: 'id'
    }]);

    const c1 = {id: 1};
    const c2 = {id: 2};
    const c3 = {id: 1};

    const s1 = Singleton(c1);
    const s2 = Singleton(c2);
    const s3 = Singleton(c3);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);

  });

  it(`Calling SingletonFactory(Class, [{
    type: 'property:object',
    property: 'data'
  }])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, [{
      type: 'property:array',
      property: 'data'
    }]);

    const c1 = {id: 1};
    const c2 = {id: 2};
    const c3 = {id: 3};

    const s1 = Singleton({data: [c1, c2, c3]});
    const s2 = Singleton({data: [c2, c1, c3]});
    const s3 = Singleton({data: [c1, c2, c3]});

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);

  });

  it(`Calling SingletonFactory(Class, [{
    type: 'property:set',
    property: 'data'
  }])`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, [{
      type: 'property:set',
      property: 'data'
    }]);

    const c1 = {id: 1};
    const c2 = {id: 2};
    const c3 = {id: 3};

    const s1 = Singleton({data: [c1, c2, c3]});
    const s2 = Singleton({data: [c2, c1, c3]});
    const s3 = Singleton({data: [c1, c2, c3]});
    const s4 = Singleton({data: [c1, c2, c2]});

    expect(s1).to.equal(s2);
    expect(s1).to.equal(s3);
    expect(s1).not.to.equal(s4);

  });

});
