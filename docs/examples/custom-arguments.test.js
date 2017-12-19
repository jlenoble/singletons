import {expect} from 'chai';
import {SingletonFactory} from '../../src/singletons';

describe(`Testing README.md examples`, function () {
  it('Custom arguments', function () {
    class Name {
      constructor (name) {
        this.name = name;
        this.friends = new Set();
      }
    }

    class Age {
      constructor (age) {
        this.age = age;
      }
    }

    class Gender {
      constructor (gender) {
        this.gender = gender;
      }
    }

    class Country {
      constructor (country) {
        this.country = country;
      }
    }

    class Friend {
      constructor (friend) {
        this.friend = friend;
      }
    }

    const Contact = SingletonFactory(Name, ['literal'], {
      customArgs: [
        [Name, {
          convert ({name}) {
            return name;
          },
        }],
        [Age, {
          postprocess ({age}) {
            this.age = age;
          },
        }],
        [Gender, {
          postprocess ({gender}) {
            this.gender = gender;
          },
        }],
        [Country, {
          postprocess ({country}) {
            this.country = country;
          },
        }],
        [Friend, {
          reduce (friends) {
            return friends.map(friend => friend.friend);
          },
          postprocess (friends) {
            friends.forEach(friend => this.friends.add(new Contact(friend)));
          },
        }],
      ],
    });

    const paul = new Contact('Paul');
    const paula = new Contact(new Name('Paula'), new Gender('female'));
    const john = new Contact(new Country('England'), 'John', new Age(55));

    expect(paul.name).to.equal('Paul');
    expect(paula.name).to.equal('Paula');
    expect(john.name).to.equal('John');

    expect(paula.gender).to.equal('female');
    expect(john.age).to.equal(55);
    expect(john.country).to.equal('England');

    expect(new Contact('John', new Gender('male'), new Age(56),
      new Country('France'), new Friend('Paula'),
      new Friend('Paul'))).to.equal(john);
    expect(john.gender).to.equal('male');
    expect(john.age).to.equal(56);
    expect(john.country).to.equal('France');

    expect(john.friends.has(paula)).to.be.true;
    expect(john.friends.has(paul)).to.be.true;
    expect(john.friends.size).to.equal(2);

    const Friends = SingletonFactory(Array, [{
      type: 'literal',
      rest: true,
    }], {
      customArgs: [
        [Name, {
          spread (contact) {
            return Array.from(contact.friends || []).map(
              contact => new Friend(contact.name));
          },
        }],
        [Friend, {
          convert (friend) {
            return friend.friend;
          },
        }],
      ],
    });

    const friends = new Friends(john);
    expect(friends).to.eql(['Paula', 'Paul']);

    const Friends2 = SingletonFactory(Array, [{
      type: 'literal',
      rest: true,
    }], {
      customArgs: [
        [Name, {
          shallowSpread (contact) {
            return Array.from(contact.friends || []);
          },
          convert (contact) {
            return contact.name;
          },
        }],
      ],
    });

    const friends2 = new Friends2(john);
    expect(friends2).to.eql(['Paula', 'Paul']);
  });
});
