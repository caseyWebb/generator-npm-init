'use strict'

const _ = require('lodash')
const path = require('path')
const Base = require('yeoman-generator').Base

class Generator extends Base {
  constructor() {
    super(...arguments)

    this.option('skip-name')
    this.option('skip-description')
    this.option('skip-version')
    this.option('skip-main')
    this.option('skip-test')
    this.option('skip-repo')
    this.option('skip-keywords')
    this.option('skip-author')
    this.option('skip-license')

    this.option('name')
    this.option('description')
    this.option('version')
    this.option('main')
    this.option('test')
    this.option('repo')
    this.option('keywords')
    this.option('author')
    this.option('license')
  }

  initializing() {
    this.config.set(this.fs.readJSON('package.json', {}))

    this.config.defaults((() => {
      const d = {
        name: this.options.name || path.basename(this.destinationRoot()),
        version: this.options.version || '1.0.0',
        description: this.options.description || '',
        main: this.options.main || 'index.js',
        scripts: {
          test: this.options.test || 'echo "Error: no test specified" && exit 1'
        },
        keywords: this.options.keywords || [],
        license: this.options.license || 'ISC'
      }

      if (this.options.author) {
        d.author = this.options.author
      }
      if (this.options.repo) {
        d.repository = this.options.repo
      }

      return d
    })())
  }

  prompting() {
    const done = this.async()
    const prompts = []

    if (!this.options['skip-name']) {
      prompts.push({
        type: 'input',
        name: 'name',
        message: 'name:',
        default: this.config.get('name')
      })
    }

    if (!this.options['skip-version']) {
      prompts.push({
        type: 'input',
        name: 'version',
        message: 'version:',
        default: this.config.get('version')
      })
    }

    if (!this.options['skip-description']) {
      prompts.push({
        type: 'input',
        name: 'description',
        message: 'description:',
        default: this.config.get('description')
      })
    }

    if (!this.options['skip-main']) {
      prompts.push({
        type: 'input',
        name: 'main',
        message: 'main point:',
        default: this.config.get('main')
      })
    }

    if (!this.options['skip-test']) {
      prompts.push({
        type: 'input',
        name: 'test',
        message: 'test command:',
        default: this.config.get('scripts').test
      })
    }

    if (!this.options['skip-repo']) {
      const repoPrompt = {
        type: 'input',
        name: 'repo',
        message: 'git repository:'
      }

      if (this.config.get('repository')) {
        repoPrompt.default = this.config.get('repository')
      }

      prompts.push(repoPrompt)
    }

    if (!this.options['skip-keywords']) {
      prompts.push({
        type: 'input',
        name: 'keywords',
        message: 'keywords (space-delimited):',
        default: this.config.get('keywords').join(' ')
      })
    }

    if (!this.options['skip-author']) {
      prompts.push({
        type: 'input',
        name: 'author',
        message: 'author:',
        default: this.config.get('author')
      })
    }

    if (!this.options['skip-license']) {
      prompts.push({
        type: 'input',
        name: 'license',
        message: 'license:',
        default: this.config.get('license')
      })
    }

    this.prompt(prompts, (res) => {
      if (res.name) {
        this.config.set('name', res.name)
      }
      if (res.version) {
        this.config.set('version', res.version)
      }
      if (res.description) {
        this.config.set('description', res.description)
      }
      if (res.main) {
        this.config.set('main', res.main)
      }
      if (res.test) {
        this.config.set('scripts', { test: res.test })
      }
      if (res.keywords && !res.keywords.match(/^\w?$/)) {
        this.config.set('keywords', res.keywords.split(' '))
      }
      if (res.repo) {
        this.config.set('repository', res.repo)
      }
      if (res.author) {
        this.config.set('author', res.author)
      }
      if (res.license) {
        this.config.set('license', res.license)
      }

      done()
    })
  }

  writing() {
    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {})

    _.merge(pkg, this.config.getAll())

    this.fs.writeJSON(this.destinationPath('package.json'), pkg)
  }
}

module.exports = Generator
