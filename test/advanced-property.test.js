import {expect} from 'chai';
import signature from 'sig';
import {SingletonFactory} from '../src/singletons';

describe('Testing Singleton with property', function () {
  it(`Calling SingletonFactory(Class, [{
    type: 'property:object',
    property: 'data'
  }])`, function () {
    class Class {
      constructor () {}
    }

    const Singleton = SingletonFactory(Class, [{
      type: 'property:object',
      property: 'data',
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
    expect(Singleton.key(s1)).to.equal('o1');
  });

  it(`Calling SingletonFactory(Class, [{
    type: 'property:literal',
    property: 'id'
  }])`, function () {
    class Class {
      constructor () {}
    }

    const Singleton = SingletonFactory(Class, [{
      type: 'property:literal',
      property: 'id',
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
    type: 'property:property:id',
    property: 'data'
  }])`, function () {
    // Checks allegation that this option works, but use is discouraged

    class Class {
      constructor () {}
    }

    const Singleton = SingletonFactory(Class, [{
      type: 'property:property:id',
      property: 'data',
    }]);

    const o1 = {id: 1};
    const o2 = {id: 2};

    const c1 = {data: o1};
    const c2 = {data: o2};
    const c3 = {data: o1};

    const s1 = Singleton(c1);
    const s2 = Singleton(c2);
    const s3 = Singleton(c3);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);
    expect(Singleton.key(s1)).not.to.equal('1');
    expect(Singleton.key(s1)).to.equal(signature(1));
  });

  it(`Calling SingletonFactory(Class, [{
    type: 'property:property:id:id',
    property: 'data'
  }])`, function () {
    // Checking that this option doesn't work as intended

    class Class {
      constructor () {}
    }

    const Singleton = SingletonFactory(Class, [{
      type: 'property:property:id:id',
      property: 'data',
    }]);

    const o1 = {id: {id: 1}};
    const o2 = {id: {id: 2}};

    const c1 = {data: o1};
    const c2 = {data: o2};
    const c3 = {data: o1};

    const s1 = Singleton(c1);
    const s2 = Singleton(c2);
    const s3 = Singleton(c3);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);
    expect(Singleton.key(s1)).not.to.equal(signature({id: 1}));
    expect(Singleton.key(s1)).to.equal(signature(1));
  });

  it(`Calling SingletonFactory(Class, [{
    type: 'property:array',
    property: 'data'
  }])`, function () {
    class Class {
      constructor () {}
    }

    const Singleton = SingletonFactory(Class, [{
      type: 'property:array',
      property: 'data',
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
  }])`, function () {
    class Class {
      constructor () {}
    }

    const Singleton = SingletonFactory(Class, [{
      type: 'property:set',
      property: 'data',
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
