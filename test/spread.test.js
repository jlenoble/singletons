import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';

describe('Testing a spreadable Singleton', function () {
  it(`Using option spread`, function () {
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

    const Crowd = SingletonFactory(Persons, [{
      type: 'literal',
      rest: true,
    }], {
      spread (crowd) {
        return crowd.persons;
      },

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
    });

    const crowd = new Crowd(
      'Sam', 'Nancy',
      new Person('Harry'),
      new Persons('Johnny', 'Sally'),
      ['Peter', new Person('Paul'), new Persons('Pauline', 'Louis')],
    );

    expect(crowd).to.be.instanceof(Persons);
    expect(crowd.getNames()).to.eql([
      'Sam', 'Nancy',
      'Harry',
      'Johnny', 'Sally',
      'Peter', 'Paul', 'Pauline', 'Louis',
    ]);
  });
});
