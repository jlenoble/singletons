import babel from 'gulp-babel';
import rename from 'gulp-rename';
import keyFunc from 'keyfunc';
import {SingletonFactory} from '../src/singletons';

export const Types = [
  Number,
  String,
  class Name {
    constructor(name) {this.name = name;}
  }
];

export const Arguments = [
  {
    args1: [23],
    args2: [25]
  },
  {
    args1: [console, 'log'],
    title1: `(console, 'log')`,
    args2: [console, 'info'],
    title2: `(console, 'info')`,
    keyFunc: keyFunc({stem: 'logger'}, 'literal')
  },
  {
    args1: ['src/**/*.js'],
    title1: `'src/**/*.js'`,
    args2: ['test/**/*.js'],
    title2: `'test/**/*.js'`
  },
  {
    args1: [babel],
    title1: 'babel',
    args2: [rename, {suffix: '-renamed'}],
    title2: `rename({suffix: '-renamed'})`,
    keyFunc: keyFunc({stem: 'plugin'}, 'literal')
  }
];

export const Arguments2 = [
  {
    args1: [23],
    args2: [25],
    keyFunc: ['literal', 'literal']
  },
  {
    args1: [console, 'log'],
    title1: `(console, 'log')`,
    args2: [console, 'info'],
    title2: `(console, 'info')`,
    keyFunc: [{stem: 'logger'}, 'literal']
  },
  {
    args1: ['src/**/*.js'],
    title1: `'src/**/*.js'`,
    args2: ['test/**/*.js'],
    title2: `'test/**/*.js'`,
    keyFunc: ['literal', 'literal']
  },
  {
    args1: [babel],
    title1: 'babel',
    args2: [rename, {suffix: '-renamed'}],
    title2: `rename({suffix: '-renamed'})`,
    keyFunc: [{stem: 'plugin'}, 'literal']
  }
];
