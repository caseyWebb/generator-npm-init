'use strict'

const _ = require('lodash')
const path = require('path')
const ini = require('ini')
const YeomanGenerator = require('yeoman-generator')

module.exports = class Generator extends YeomanGenerator {
  constructor() {
    super(...arguments)
    this.package = {}
  }

  initializing() {
    normalizeOptions(this.options)

    const defaults = getDefaults(this.destinationRoot(), this.options)
    const existing = this.fs.readJSON('package.json')

    if (!this.options.repository && this.fs.exists('.git/config')) {
      this.options['skip-repo'] = true
      _.merge(this.options, getRepositoryInformationFromGit(this.fs))
    }

    const options = _.reduce(
      this.options,
      (memo, v, k) => k.indexOf('skip-') === 0 ? memo : _.extend(memo, { [k]: v }),
      {}
    )

    if (this.options['skip-test']) {
      delete defaults.scripts.test
    }

    _.merge(
      this.package,
      defaults,
      existing,
      options
    )
  }

  async prompting() {
    const prompts = [
      ['name', 'package name'],
      ['version'],
      ['description'],
      ['main', 'entry point'],
      ['test', 'test command'],
      ['repo', 'git repository'],
      ['keywords', 'keywords (space-delimited)', this.package.keywords ? this.package.keywords.join(' ') : ''],
      ['author'],
      ['license']
    ]
      .filter(([name]) => !this.options[`skip-${name}`])
      .map(([name, message = name, defaultV = this.package[name]]) => ({
        type: 'input',
        name,
        message: `${message}:`,
        default: defaultV
      }))

    const res = await this.prompt(prompts)

    if (res.test) {
      res.scripts = { test: res.test }
      delete res.test
    }
    if (res.keywords && !res.keywords.match(/^\w?$/)) {
      res.keywords = res.keywords.split(' ')
    }
    if (res.repo) {
      res.repository = res.repo
      delete res.repo
    }

    _.merge(this.package, res)

    // strip extraneous props
    this.package = _.reduce(
      [
        'name',
        'version',
        'description',
        'main',
        'repository',
        'bugs',
        'homepage',
        'keywords',
        'author',
        'license',
        'scripts'
      ],
      (accum, k) => _.extend(accum, { [k]: this.package[k] }),
      {}
    )
  }

  writing() {
    this.fs.writeJSON(this.destinationPath('package.json'), this.package)
  }
}

function normalizeOptions(options) {
  const aliases = {
    repository: options.repo,
    scripts: {
      test: options.test
    }
  }
  _.merge(options, aliases)
  delete options.repo
  delete options.test
}

function getDefaults(fd, options) {
  return _.reduce(
    {
      name: path.basename(fd),
      version: '1.0.0',
      description: '',
      main: 'index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1'
      },
      keywords: [],
      license: 'ISC'
    },
    (memo, v, k) => (options[`skip-${k}`] ? memo : _.extend(memo, { [k]: v })),
    {}
  )
}

function getRepositoryInformationFromGit(fs) {
  const gitConfigIni = fs.read('.git/config')
  const gitConfig = ini.parse(gitConfigIni)
  const url = gitConfig['remote "origin"'] ? gitConfig['remote "origin"'].url : ''
  const ret = {
    repository: {
      type: 'git',
      url
    }
  }
  try {
    const repo = url.match(/github\.com[:\/](.+)/i)[1].replace(/\.git$/, '')
    if (url.includes('github.com')) {
      ret.bugs = {
        url: `https://github.com/${repo}/issues`
      }
      ret.homepage = `https://github.com/${repo}#readme`
    }
  } finally {
    return ret
  }
}
