import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';

describe(`Testing README.md examples`, function() {

  before(function() {
    this.Class = class Class {constructor() {}};
  });

  it('SingletonFactory syntax example', function() {

    const Singleton = SingletonFactory(
      this.Class, // Constructor for the singletons
      [
        'object', // First argument must be an object matched strictly
        'literal', // Second argument can be anything matched literally
        {property: 'color'} , // Third argument and all subsequent ones can be
        // anything matched literally from their property 'id' downwards
        'array', // Fourth argument is an array of 'object'
        'set' // Fifth argument is a set of 'object'
      ]
    );

    const obj = {id: 1};
    const s1 = Singleton(console, 'log', {color: 'red'}, [console, obj],
      [console, obj]);
    const s2 = Singleton(console, 'log', {color: 'red'}, [console, obj],
      [obj, console]);


    expect(s1).to.equal(s2);
    expect(s1).to.be.instanceof(this.Class);

  });

  it('Function key(...args) example', function() {

    const Singleton = SingletonFactory(
      this.Class,
      [
        'object'
      ]
    );

    expect(Singleton.key(console)).to.equal('1');
    expect(Singleton.key(new this.Class())).to.equal('2');
    expect(Singleton.key(console)).to.equal('1');
    expect(Singleton.key(new this.Class())).to.equal('3');

  });

  it('Function singleton(key) example', function() {

    const Singleton = SingletonFactory(
      this.Class,
      [
        'object'
      ]
    );

    const s1 = Singleton(console);

    expect(Singleton.singleton('1')).to.equal(s1);

  });

  it('Options example', function() {

    const Singleton = SingletonFactory(this.Class, [
      {
        stem: 'first'
      },
      {
        stem: 'second',
        type: 'literal',
        rest: true
      },
      {
        stem: 'third',
        property: 'color'
      },
      {
        stem: 'fourth',
        type: 'array'
      },
      {
        stem: 'fifth',
        type: 'set'
      }
    ]);

    const obj = {id: 1};
    expect(/first1_second[0-9a-f]{40}_third[0-9a-f]{40}_fourth[0-9a-f]{40}_fifth[0-9a-f]{40}_second[0-9a-f]{40}/
      .test(Singleton.key(console, 'log', {color: 'red'}, [console, obj],
      [obj, console], 'dummy'))).to.be.true;

  });

  it(`'object' option example`, function() {

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

  it(`'literal' option example`, function() {

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

  it(`'property' option example`, function() {

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

  it(`'array' option example`, function() {

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

  it(`'set' option example`, function() {

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

});
