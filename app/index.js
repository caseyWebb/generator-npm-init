'use strict' // eslint-disable-line

const _ = require('lodash')
const path = require('path')
const ini = require('ini')
const Base = require('yeoman-generator').Base

class Generator extends Base {
  constructor() {
    super(...arguments)
    this.package = {}
  }

  initializing() {
    const defaults = _.reduce(
      {
        name: path.basename(this.destinationRoot()),
        version: '1.0.0',
        description: '',
        main: 'index.js',
        scripts: {
          test: 'echo "Error: no test specified" && exit 1'
        },
        keywords: [],
        license: 'ISC'
      },
      (memo, v, k) => this.options[`skip-${k}`]
        ? memo
        : _.extend(memo, { [k]: v }),
      {}
    )

    if (!this.options.repository && !this.options.repo && this.fs.exists('.git/config')) {
      const gitConfigIni = this.fs.read('.git/config')

      if (gitConfigIni) {
        const gitConfig = ini.parse(gitConfigIni)
        this.options['skip-repo'] = true
        this.options.repository = {
          type: 'git',
          url: gitConfig['remote "origin"'].url
        }
      }
    }

    const existing = this.fs.readJSON('package.json')

    const options = _.reduce(this.options, (memo, v, k) =>
      k.indexOf('skip-') === 0
        ? memo
        : _.extend(memo, { [k]: v }),
      {})

    if (this.options['skip-test']) {
      delete defaults.scripts.test
    }

    const aliases = {
      author: this.options.author,
      repository: this.options.repo,
      scripts: {
        test: this.options.test
      }
    }

    _.merge(
      this.package,
      defaults,
      existing,
      options,
      aliases)
  }

  prompting() {
    const done = this.async()
    const prompts = []

    if (!this.options['skip-name']) {
      prompts.push({
        type: 'input',
        name: 'name',
        message: 'name:',
        default: this.package.name
      })
    }

    if (!this.options['skip-version']) {
      prompts.push({
        type: 'input',
        name: 'version',
        message: 'version:',
        default: this.package.version
      })
    }

    if (!this.options['skip-description']) {
      prompts.push({
        type: 'input',
        name: 'description',
        message: 'description:',
        default: this.package.description
      })
    }

    if (!this.options['skip-main']) {
      prompts.push({
        type: 'input',
        name: 'main',
        message: 'main point:',
        default: this.package.main
      })
    }

    if (!this.options['skip-test']) {
      prompts.push({
        type: 'input',
        name: 'test',
        message: 'test command:',
        default: this.package.scripts.test
      })
    }

    if (!this.options['skip-repo']) {
      prompts.push({
        type: 'input',
        name: 'repo',
        message: 'git repository:',
        default: this.package.repository || ''
      })
    }

    if (!this.options['skip-keywords']) {
      prompts.push({
        type: 'input',
        name: 'keywords',
        message: 'keywords (space-delimited):',
        default: this.package.keywords ? this.package.keywords.join(' ') : ''
      })
    }

    if (!this.options['skip-author']) {
      prompts.push({
        type: 'input',
        name: 'author',
        message: 'author:',
        default: this.package.author
      })
    }

    if (!this.options['skip-license']) {
      prompts.push({
        type: 'input',
        name: 'license',
        message: 'license:',
        default: this.package.license
      })
    }

    this.prompt(prompts).then((res) => {
      if (res.name) {
        this.package.name = res.name
      }
      if (res.version) {
        this.package.version = res.version
      }
      if (res.description) {
        this.package.description = res.description
      }
      if (res.main) {
        this.package.main = res.main
      }
      if (res.test) {
        this.package.scripts = { test: res.test }
      }
      if (res.keywords && !res.keywords.match(/^\w?$/)) {
        this.package.keywords = res.keywords.split(' ')
      }
      if (res.repo) {
        this.package.repository = res.repo
      }
      if (res.author) {
        this.package.author = res.author
      }
      if (res.license) {
        this.package.license = res.license
      }

      done()
    })
  }

  writing() {
    const junk = ['env', 'resolved', 'namespace', 'argv', 'repo', 'test']
    junk.forEach((e) => delete this.package[e])

    this.fs.writeJSON(this.destinationPath('package.json'), this.package)
  }
}

module.exports = Generator
