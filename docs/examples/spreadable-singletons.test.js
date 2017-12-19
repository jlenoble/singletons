import {expect} from 'chai';
import {SingletonFactory} from '../../src/singletons';

describe('Testing README.md examples', function () {
  it(`Using option spread behind an interface`, function () {
    function hidingFunction (options) {
      class Person {
        constructor (name) {
          this.name = name;
        }
      }

      class Persons {
        constructor (...names) {
          this.persons = names.map(name => new Person(name));
        }

        getNames () {
          return this.persons.map(person => person.name);
        }
      }

      return SingletonFactory(Persons, [{
        type: 'literal',
        rest: true,
      }], Object.assign({
        customArgs: [
          [Person, {
            convert (person) {
              return person.name;
            },
          }],

          [Array, {
            spread: true,
          }],
        ],
      }, options));
    }

    const Crowd = hidingFunction({
      spread (crowd) {
        return crowd.persons;
      },
    });

    const c1 = new Crowd('Nancy');
    const c2 = new Crowd('Harry', 'Johnny', 'Sally');
    const c3 = ['Peter', 'Paul', 'Pauline', 'Louis'];

    const crowd = new Crowd('Sam', c1, c2, c3);

    expect(crowd.getNames()).to.eql([
      'Sam', 'Nancy',
      'Harry', 'Johnny', 'Sally',
      'Peter', 'Paul', 'Pauline', 'Louis',
    ]);
  });
});
