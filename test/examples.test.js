import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';

describe(`Testing README.md examples`, function () {
  before(function () {
    this.Class = class Class {
      constructor () {}
    };
  });

  it(`'object' option example`, function () {
    const Singleton = SingletonFactory(this.Class, ['object']);

    const option1 = {color: 'red'};

    const s1 = Singleton(option1);
    const s2 = Singleton({color: 'green'});
    const s3 = Singleton({color: 'blue'});

    expect(s1).not.to.equal(s2);
    expect(s2).not.to.equal(s3);
    expect(s3).not.to.equal(s1);

    expect(s1).to.equal(Singleton(option1));
    expect(s1).not.to.equal(Singleton({color: 'red'}));
    expect(s1).not.to.equal(Singleton({color: 'red', size: 'Huge'}));
  });

  it(`'literal' option example`, function () {
    const Singleton = SingletonFactory(this.Class, ['literal']);

    const option1 = {color: 'red'};

    const s1 = Singleton(option1);
    const s2 = Singleton({color: 'green'});
    const s3 = Singleton({color: 'blue'});

    expect(s1).not.to.equal(s2);
    expect(s2).not.to.equal(s3);
    expect(s3).not.to.equal(s1);

    expect(s1).to.equal(Singleton(option1));
    expect(s1).to.equal(Singleton({color: 'red'}));
    expect(s1).not.to.equal(Singleton({color: 'red', size: 'Huge'}));
  });

  it(`'property' option example`, function () {
    const Singleton = SingletonFactory(this.Class, [{property: 'color'}]);

    const option1 = {color: 'red'};

    const s1 = Singleton(option1);
    const s2 = Singleton({color: 'green'});
    const s3 = Singleton({color: 'blue'});

    expect(s1).not.to.equal(s2);
    expect(s2).not.to.equal(s3);
    expect(s3).not.to.equal(s1);

    expect(s1).to.equal(Singleton(option1));
    expect(s1).to.equal(Singleton({color: 'red'}));
    expect(s1).to.equal(Singleton({color: 'red', size: 'Huge'}));
  });

  it(`'array' option example`, function () {
    const Singleton = SingletonFactory(this.Class, ['array']);

    const option1 = {color: 'red'};
    const option2 = {color: 'green'};
    const option3 = {color: 'blue'};

    const s1 = Singleton([option1, option2, option3]);
    const s2 = Singleton([option3, option2, option1]);
    const s3 = Singleton([option1, option2, option3]);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);
  });

  it(`'set' option example`, function () {
    const Singleton = SingletonFactory(this.Class, ['set']);

    const option1 = {color: 'red'};
    const option2 = {color: 'green'};
    const option3 = {color: 'blue'};

    const s1 = Singleton([option1, option2, option3]);
    const s2 = Singleton([option3, option2, option1]);
    const s3 = Singleton([option1, option2, option3]);

    expect(s1).to.equal(s2);
    expect(s1).to.equal(s3);
  });

  it(`Special case: Singleton(singleton)`, function () {
    const Singleton = SingletonFactory(this.Class, ['object']);

    const option1 = {color: 'red'};

    const s1 = Singleton(option1);
    const s2 = Singleton(option1);
    const s3 = Singleton(s1);

    expect(s1).to.equal(s2);
    expect(s1).to.equal(s3);
  });

  it('Mixed arrays', function () {
    class Class {}

    const brokenSingleton = SingletonFactory(Class,
      [{type: 'literal', rest: true}]);

    const goodSingleton = SingletonFactory(Class, [{
      type: 'array', // Mandatory
      sub: ['object', 'literal'],
      rest: true, // Expects a list of mixed arrays, not only a single one
    }]);

    const o1 = {name: 1};
    const o2 = {name: 2};
    const o3 = {name: 3};

    const broken = brokenSingleton([o1, 'name'], [o2, 'name'], [o3, 'name']);
    const good = goodSingleton([o1, 'name'], [o2, 'name'], [o3, 'name']);

    o1.name = 4;

    // Though called broken, this may be intended behavior in your use
    // case; it is 'broken' only with regard to this example intended behavior,
    // which expects first arg of arrays to be evaluated strictly.
    expect(broken).not.to.equal(brokenSingleton(
      [o1, 'name'], [o2, 'name'], [o3, 'name']));
    expect(broken).to.equal(brokenSingleton(
      [{name: 1}, 'name'], [o2, 'name'], [o3, 'name']));

    expect(good).to.equal(goodSingleton(
      [o1, 'name'], [o2, 'name'], [o3, 'name']));
    expect(good).not.to.equal(goodSingleton(
      [{name: 1}, 'name'], [o2, 'name'], [o3, 'name']));
  });

  it(`Mixed properties`, function () {
    class Class {}

    const brokenSingleton = SingletonFactory(Class,
      [{property: 'data', rest: true}]);

    const goodSingleton = SingletonFactory(Class, [{
      property: 'data', // Mandatory
      sub: {type: 'array', sub: ['object', 'literal']},
      rest: true, // Expects a list of mixed arrays, not only a single one
    }]);

    const o1 = {name: 1};
    const o2 = {name: 2};
    const o3 = {name: 3};

    const broken = brokenSingleton({data: [o1, 'name']}, {data: [o2, 'name']},
      {data: [o3, 'name']});
    const good = goodSingleton({data: [o1, 'name']}, {data: [o2, 'name']},
      {data: [o3, 'name']});

    o1.name = 4;

    expect(broken).not.to.equal(brokenSingleton({data: [o1, 'name']},
      {data: [o2, 'name']}, {data: [o3, 'name']}));
    expect(broken).to.equal(brokenSingleton({data: [{name: 1}, 'name']},
      {data: [o2, 'name']}, {data: [o3, 'name']}));

    expect(good).to.equal(goodSingleton({data: [o1, 'name']},
      {data: [o2, 'name']}, {data: [o3, 'name']}));
    expect(good).not.to.equal(goodSingleton({data: [{name: 1}, 'name']},
      {data: [o2, 'name']}, {data: [o3, 'name']}));
  });

  it(`Deep properties`, function () {
    class Class {
      constructor (thought) {
        this.thought = thought;
      }
    }

    const cumbersomeSingleton = SingletonFactory(Class, [{
      property: 'humanity',
      sub: {
        property: 'man',
        sub: {
          property: 'brain',
          sub: {
            property: 'thought',
          },
        },
      },
    }]);
    const straightSingleton = SingletonFactory(Class,
      [{property: 'humanity:man:brain:thought'}]);

    const o = {humanity: {man: {brain: {thought: 'Duh?'}}}};

    expect(cumbersomeSingleton(o)).to.equal(cumbersomeSingleton(
      {humanity: {man: {brain: {thought: 'Duh?'}}}}));
    expect(cumbersomeSingleton(o)).not.to.equal(cumbersomeSingleton(
      {humanity: {man: {brain: {thought: 'Da!'}}}}));
    expect(straightSingleton(o)).to.equal(straightSingleton(
      {humanity: {man: {brain: {thought: 'Duh?'}}}}));
    expect(straightSingleton(o)).not.to.equal(straightSingleton({
      humanity: {man: {brain: {thought: 'Da!'}}}}));
    expect(cumbersomeSingleton(o).thought).to.equal(
      straightSingleton(o).thought);
    expect(cumbersomeSingleton.key(o)).to.equal(
      straightSingleton.key(o));
  });

  it(`Unordered lists`, function () {
    class Person {
      constructor (firstname, lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
      }
    }

    class Family {
      constructor (...members) {
        this.members = members.map(member => new Person(...member));
      }
    }

    const oFamily = SingletonFactory(Family,
      [{type: 'array', sub: ['literal', 'literal'], rest: true}]);
    const uFamily = SingletonFactory(Family,
      [{type: 'array', sub: ['literal', 'literal'], unordered: true}]);

    const info1 = ['Adam', 'Blue'];
    const info2 = ['Betsy', 'Blue'];
    const info3 = ['Charlotte', 'Blue'];

    const daddyMummyDaughter = oFamily(info1, info2, info3);
    const family = uFamily(info1, info2, info3);

    expect(daddyMummyDaughter).not.to.equal(oFamily(info3, info2, info1));
    expect(family).to.equal(uFamily(info3, info2, info1));
  });
});
