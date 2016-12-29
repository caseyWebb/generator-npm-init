# generator-npm-init

![NPM](https://img.shields.io/npm/v/generator-npm-init.svg)
![WTFPL](https://img.shields.io/npm/l/generator-npm-init.svg)
[![Travis](https://img.shields.io/travis/caseyWebb/generator-npm-init.svg)](https://travis-ci.org/caseyWebb/generator-npm-init)
[![Coveralls](https://coveralls.io/repos/github/caseyWebb/generator-npm-init/badge.svg?branch=master)](https://coveralls.io/github/caseyWebb/generator-npm-init?branch=master)
[![DavidDM](https://img.shields.io/david/caseyWebb/generator-npm-init.svg)](https://david-dm.org/caseyWebb/generator-npm-init)
[![NPM Downloads](https://img.shields.io/npm/dt/generator-npm-init.svg?maxAge=2592000)](http://npm-stat.com/charts.html?package=generator-npm-init&author=&from=&to=)

Yeoman generator implementation of `npm init`. Useful for composition.

```javascript
this.composeWith(require.resolve('generator-npm-init/app')/*, options*/)
```

### Options

```javascript
{
  // skip prompts
  'skip-name': false,
  'skip-description': false,
  'skip-version': false,
  'skip-main': false,
  'skip-test': false,
  'skip-repo': false,
  'skip-keywords': false,
  'skip-author': false,
  'skip-license': false,

  // supply alternative defaults
  name: '<%= destFolderName %>',
  version: '1.0.0',
  description: '',
  main: 'index.js',
  test: 'echo "Error: no test specified" && exit 1',
  repo: '',
  keywords: [],
  author: '',
  license: 'ISC'
}
```
