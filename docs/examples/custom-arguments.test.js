import {expect} from 'chai';
import {SingletonFactory} from '../../src/singletons';

describe(`Testing README.md examples`, function () {
  it('Custom arguments', function () {
    class Name {
      constructor (name) {
        this.name = name;
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

    const Contact = SingletonFactory(Name, ['literal'], {
      customArgs: [
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
      ],
    });

    const paul = new Contact('Paul');
    const paula = new Contact('Paula', new Gender('female'));
    const john = new Contact(new Country('England'), 'John', new Age(55));

    expect(paul.name).to.equal('Paul');
    expect(paula.name).to.equal('Paula');
    expect(john.name).to.equal('John');

    expect(paula.gender).to.equal('female');
    expect(john.age).to.equal(55);
    expect(john.country).to.equal('England');

    expect(new Contact('John', new Gender('male'), new Age(56),
      new Country('France'))).to.equal(john);
    expect(john.gender).to.equal('male');
    expect(john.age).to.equal(56);
    expect(john.country).to.equal('France');
  });
});
