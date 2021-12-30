# generator-npm-init

[![Version][npm-version-shield]][npm]
[![Build Status][build-status-shield]][build-status]
[![Coverage States][codecov-shield]][codecov]
[![Downloads][npm-stats-shield]][npm-stats]

Yeoman generator implementation of `npm init`. Useful for composition.

```javascript
this.composeWith(require.resolve('generator-npm-init/app') /*, options*/)
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
  license: 'ISC',

  // configure run script defaults
  scripts: {
    start: 'node dist/index.js',
    build: 'webpack -p',
    watch: 'webpack-dev-server'
  }
}
```

[build-status]: https://github.com/caseyWebb/generator-npm-init/actions/workflows/nodejs.yml
[build-status-shield]: https://img.shields.io/github/workflow/status/caseyWebb/generator-npm-init/Node%20CI/master
[codecov]: https://codecov.io/gh/caseyWebb/generator-npm-init
[codecov-shield]: https://img.shields.io/codecov/c/github/caseyWebb/generator-npm-init.svg
[npm]: https://www.npmjs.com/package/generator-npm-init
[npm-version-shield]: https://img.shields.io/npm/v/generator-npm-init.svg
[npm-stats]: http://npm-stat.com/charts.html?package=generator-npm-init&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/generator-npm-init.svg?maxAge=2592000
