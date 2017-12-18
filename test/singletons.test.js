import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';
import {Types, Arguments, Arguments2} from './helpers';

describe('Testing SingletonFactory with keyFunc', function () {
  Types.forEach(Type => {
    describe(`with Type ${Type.name}`, function () {
      Arguments.forEach(Args => {
        const {args1, args2, title1, title2, keyFunc} = Args;

        it(`with args ${title1 ? title1 : args1} and ${title2 ?
          title2 : args2}`, function () {
          const Singleton = SingletonFactory(Type, keyFunc);

          const s1 = Singleton(...args1);
          const s2 = Singleton(...args2);
          const s3 = Singleton(...args1);

          expect(s1).to.equal(s3);
          expect(s2).not.to.equal(s3);
        });
      });
    });
  });
});

describe('Testing SingletonFactory with array of options', function () {
  Types.forEach(Type => {
    describe(`with Type ${Type.name}`, function () {
      Arguments2.forEach(Args => {
        const {args1, args2, title1, title2, keyFunc} = Args;

        it(`with args ${title1 ? title1 : args1} and ${title2 ?
          title2 : args2}`, function () {
          const Singleton = SingletonFactory(Type, keyFunc);

          const s1 = Singleton(...args1);
          const s2 = Singleton(...args2);
          const s3 = Singleton(...args1);

          expect(s1).to.equal(s3);
          expect(s2).not.to.equal(s3);
        });
      });
    });
  });
});

describe('Testing different Singletons concurrently', function () {
  it(`Different singletons don't interfer`, function () {
    class Name {
      constructor (name) {
        this.name = name;
      }
    }

    const Singleton1 = SingletonFactory(Name, ['literal']);
    const Singleton2 = SingletonFactory(Name, ['literal']);

    const s1 = new Singleton1('Albert');
    const s2 = new Singleton2('Albert');

    expect(s1.name).to.equal(s2.name);
    expect(s1).not.to.equal(s2);

    expect(s1).to.equal(new Singleton1(s1));
    expect(s2).to.equal(new Singleton2(s2));

    expect(s1).not.to.equal(new Singleton2(s1));
    expect(s1).not.to.equal(new Singleton1(s2));
    expect(s2).not.to.equal(new Singleton1(s2));
    expect(s2).not.to.equal(new Singleton2(s1));
  });
});
