import {expect} from 'chai';
import {SingletonFactory} from '../../src/singletons';

describe(`Testing README.md examples`, function () {
  it(`Postprocessing instance`, function () {
    class Person {
      constructor (firstname, lastname, options) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.where = options.where;
      }
    }

    const Inhabitant = SingletonFactory(Person, [
      'literal', 'literal', 'ignore',
    ], {
      postprocess: function (_instance, args) {
        const instance = _instance;
        if (args && args[2] && args[2].where) {
          instance.where = args[2].where;
        }
        return instance;
      },
    });

    const annie = new Inhabitant('Annie', 'Smith', {where: 'Los Angeles'});

    expect(annie.where).to.equal('Los Angeles');
    expect(annie).to.equal(Inhabitant('Annie', 'Smith'));
    expect(annie.where).to.equal('Los Angeles');
    expect(annie).to.equal(Inhabitant('Annie', 'Smith', {where: 'New York'}));
    expect(annie.where).to.equal('New York');
  });
});
