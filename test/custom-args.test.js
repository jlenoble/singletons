import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';

describe('Testing Singleton with custom arguments', function () {
  it(`Using custom arguments`, function () {
    class Person {
      constructor (name) {
        this.name = name;
      }
    }

    class Attributes {
      constructor (attributes) {
        this.name = attributes.name;
        this.attributes = Object.assign({}, attributes);
        if (this.name) {
          delete this.attributes.name;
        }
      }
    }

    const Mister = SingletonFactory(Person, ['literal'], {
      customArgs: [
        [Attributes, {
          convert: attrs => attrs.name,
          postprocess: (instance, {attributes}) => {
            Object.assign(instance, attributes);
          },
        }],
      ],
    });

    const peter = new Mister('Peter');
    const jack = new Mister(new Attributes({
      name: 'Jack',
      age: 42,
    }));

    expect(peter.name).to.equal('Peter');
    expect(jack.name).to.equal('Jack');
    expect(jack.age).to.equal(42);
  });
});
