# generator-npm-init

![NPM](https://img.shields.io/npm/v/generator-npm-init.svg)
![MIT](https://img.shields.io/npm/l/generator-npm-init.svg)
[![Travis](https://img.shields.io/travis/caseyWebb/generator-npm-init.svg)](https://travis-ci.org/caseyWebb/generator-npm-init)
[![CodeClimate](https://img.shields.io/codeclimate/github/caseyWebb/generator-npm-init.svg)](https://codeclimate.com/github/caseyWebb/generator-npm-init)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/caseyWebb/generator-npm-init.svg)](https://codeclimate.com/github/caseyWebb/generator-npm-init/coverage)
[![Dependency Status](https://img.shields.io/david/caseyWebb/generator-npm-init.svg)](https://david-dm.org/caseyWebb/generator-npm-init)

Yeoman generator implementation of `npm init`. Useful for composition.

```javascript
this.composeWith('npm-init', {}, {
  local: require.resolve('generator-npm-init/app'): false,
})
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
