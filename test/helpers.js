import babel from 'gulp-babel';
import rename from 'gulp-rename';
import keyFunc from 'keyfunc';

export const Types = [
  Number,
  String,
  class Name {
    constructor (name) {
      this.name = name;
    }
  },
];

export const Arguments = [
  {
    args1: [23],
    args2: [25],
  },
  {
    args1: [console, 'log'],
    title1: `(console, 'log')`,
    args2: [console, 'info'],
    title2: `(console, 'info')`,
    keyFunc: keyFunc('object', 'literal'),
  },
  {
    args1: ['src/**/*.js'],
    title1: `'src/**/*.js'`,
    args2: ['test/**/*.js'],
    title2: `'test/**/*.js'`,
  },
  {
    args1: [babel],
    title1: 'babel',
    args2: [rename, {suffix: '-renamed'}],
    title2: `rename({suffix: '-renamed'})`,
    keyFunc: keyFunc('object', {
      type: 'literal',
      optional: true,
    }),
  },
];

export const Arguments2 = [
  {
    args1: [23],
    args2: [25],
    keyFunc: ['literal'],
  },
  {
    args1: [console, 'log'],
    title1: `(console, 'log')`,
    args2: [console, 'info'],
    title2: `(console, 'info')`,
    keyFunc: ['object', 'literal'],
  },
  {
    args1: ['src/**/*.js'],
    title1: `'src/**/*.js'`,
    args2: ['test/**/*.js'],
    title2: `'test/**/*.js'`,
    keyFunc: ['literal'],
  },
  {
    args1: [babel],
    title1: 'babel',
    args2: [rename, {suffix: '-renamed'}],
    title2: `rename({suffix: '-renamed'})`,
    keyFunc: ['object', {
      type: 'literal',
      optional: true,
    }],
  },
];
