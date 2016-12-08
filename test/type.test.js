import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';

describe('Testing Singleton with Type initialization', function() {

  it(`Calling Singleton with a Type object`, function() {

    class Class {constructor() {}}

    const Singleton = SingletonFactory(Class, ['object']);

    const c1 = new Class();
    const c2 = new Class();

    const s1 = Singleton(c1);
    const s2 = Singleton(c2);
    const s3 = Singleton(c1);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);

    expect(s1).to.equal(Singleton(c1));
    expect(s1).to.equal(Singleton(s1));
    expect(s2).to.equal(Singleton(c2));
    expect(s2).to.equal(Singleton(s2));

  });

  it(`Calling two different Singletons with same Type object`, function() {

    class Class {constructor() {}}

    const Singleton1 = SingletonFactory(Class, [{stem: 'ONE'}]);
    const Singleton2 = SingletonFactory(Class, [{stem: 'TWO'}]);

    const c = new Class();
    expect(Singleton1.key(c)).to.equal('ONE1');
    expect(Singleton2.key(c)).to.equal('TWO1');

    const s = Singleton1(c);
    expect(s).not.to.equal(c);
    expect(Singleton1.key(s)).to.equal('ONE1');
    expect(Singleton2.key(s)).to.equal('TWO2');

    const t = Singleton2(c);
    expect(t).not.to.equal(c);
    expect(t).not.to.equal(s);
    expect(Singleton1.key(t)).to.equal('ONE2');
    expect(Singleton2.key(t)).to.equal('TWO1');

    const s1 = Singleton1(s);
    expect(s1).to.equal(s);

    const t2 = Singleton2(t);
    expect(t2).to.equal(t);

    const s2 = Singleton2(s);
    expect(s2).not.equal(s);
    expect(Singleton1.key(s2)).to.equal('ONE3');
    expect(Singleton2.key(s2)).to.equal('TWO2');

    const t1 = Singleton1(t);
    expect(t1).not.equal(t);
    expect(Singleton1.key(t1)).to.equal('ONE2');
    expect(Singleton2.key(t1)).to.equal('TWO3');

    expect(Singleton1(s1)).to.equal(Singleton1(s));
    expect(Singleton1(t1)).to.equal(Singleton1(t));
    expect(Singleton2(s2)).to.equal(Singleton2(s));
    expect(Singleton2(t2)).to.equal(Singleton2(t));
  });

  it(`Calling two different Singletons with [same Type object]`, function() {

    class Class {constructor() {}}
    function preprocess(args) {
      return args.map(arg => {
        if (Array.isArray(arg)) {
          return arg[0];
        }
        return arg;
      });
    }

    const Singleton1 = SingletonFactory(Class, [{stem: 'ONE'}], preprocess);
    const Singleton2 = SingletonFactory(Class, [{stem: 'TWO'}], preprocess);

    const c = new Class();
    expect(Singleton1.key(c)).to.equal('ONE1');
    expect(Singleton2.key(c)).to.equal('TWO1');

    const s = Singleton1(c);
    expect(s).not.to.equal(c);
    expect(Singleton1.key(s)).to.equal('ONE1');
    expect(Singleton2.key(s)).to.equal('TWO2');

    const t = Singleton2(c);
    expect(t).not.to.equal(c);
    expect(t).not.to.equal(s);
    expect(Singleton1.key(t)).to.equal('ONE2');
    expect(Singleton2.key(t)).to.equal('TWO1');

    const s1 = Singleton1([s]);
    expect(s1).to.equal(s);

    const t2 = Singleton2([t]);
    expect(t2).to.equal(t);

    const s2 = Singleton2(s);
    expect(s2).not.equal(s);
    expect(Singleton1.key(s2)).to.equal('ONE3');
    expect(Singleton2.key(s2)).to.equal('TWO2');

    const t1 = Singleton1(t);
    expect(t1).not.equal(t);
    expect(Singleton1.key(t1)).to.equal('ONE2');
    expect(Singleton2.key(t1)).to.equal('TWO3');

    expect(Singleton1([s1])).to.equal(Singleton1([s]));
    expect(Singleton1([t1])).to.equal(Singleton1(t));
    expect(Singleton2([s2])).to.equal(Singleton2(s));
    expect(Singleton2([t2])).to.equal(Singleton2([t]));
  });

});
