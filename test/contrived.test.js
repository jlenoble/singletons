import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';

describe('Testing Singleton with contrived options', function () {
  it(`Calling SingletonFactory(Class, [
    'array:literal', {property: 'name'}, {type: 'set:set', rest: true}
  ])`, function () {
      class Class {
        constructor (name) {
          this.name = name;
        }
      }

      const Singleton = SingletonFactory(Class, [
        'array:literal', {property: 'name'}, {type: 'set:set', rest: true},
      ]);

      const c1 = new Class('Adele');
      const c2 = new Class('Bea');
      const c3 = new Class('Cecil');

      const s1 = Singleton(
        [c1, c2, c3],
        c3,
        [[c1, c2], [c3]],
        [[c1], [c2, c3]]
      );

      expect(s1).to.equal(Singleton(
        [c1, c2, c3],
        c3,
        [[c1, c2], [c3]],
        [[c1], [c2, c3]]
      ));
      expect(s1).to.equal(Singleton(
        [c1, c2, c3],
        {name: 'Cecil'},
        [[c1, c2], [c3]],
        [[c1], [c2, c3]]
      ));
      expect(s1).to.equal(Singleton(
        [c1, c2, c3],
        c3,
        [[c3], [c2, c1]],
        [[c1], [c3, c2]]
      ));
      expect(s1).not.to.equal(Singleton(
        [c1, c2, c3],
        c2,
        [[c3], [c2, c1]],
        [[c1], [c2, c3]]
      ));
      expect(s1).not.to.equal(Singleton(
        [c1, c2, c3],
        c3,
        [[c2], [c2, c1]],
        [[c3], [c2, c1]]
      ));
      expect(s1).to.equal(Singleton(
        [c1, {name: 'Bea'}, c3],
        c3,
        [[c3], [c2, c1]],
        [[c1], [c3, c2]]
      ));
    });
});
