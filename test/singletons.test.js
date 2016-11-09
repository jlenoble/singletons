import {expect} from 'chai';
import {SingletonFactory} from '../src/singletons';
import {Types, Arguments} from './helpers';

describe('Testing Singletons', function() {

  Types.forEach(Type => {

    describe(`with Type ${Type.name}`, function() {

      Arguments.forEach(Args => {

        const {args1, args2, title1, title2, keyFunc} = Args;

        it(`with args ${title1 ? title1 : args1} and ${title2 ?
            title2 : args2}`, function() {

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
