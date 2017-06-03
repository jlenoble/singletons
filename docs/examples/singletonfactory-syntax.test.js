import {expect} from 'chai';
import {SingletonFactory} from '../../src/singletons';

describe(`Testing README.md examples`, function () {
  it('SingletonFactory syntax example', function () {
    class Class {
      constructor () {}
    };

    const Singleton = SingletonFactory(
      Class, // Constructor for the singletons
      [
        'object', // First argument must be an object matched strictly
        'literal', // Second argument can be anything matched literally
        {property: 'color'}, // Third argument and all subsequent ones can be
        // anything matched literally from their property 'id' downwards
        'array', // Fourth argument is an array of 'object'
        'set', // Fifth argument is a set of 'object'
        'ignore', // Sixth argument is ignored
        {
          type: 'option',
          sub: {
            id: 'literal',
            name: 'literal',
          },
        }, // Seventh argument is an object with properties id and name matched
        // at the level of its propeties
      ]
    );

    const obj = {id: 1};
    const obj2 = {id: 2, name: 'Alice'};
    const s1 = Singleton(console, 'log', {color: 'red'}, [console, obj],
      [console, obj], console, obj2);
    const s2 = Singleton(console, 'log', {color: 'red'}, [console, obj],
      [obj, console], 'dummy', {id: 2, name: 'Alice'});

    expect(s1).to.equal(s2);
    expect(s1).to.be.instanceof(Class);
  });
});
