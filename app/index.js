'use strict'

const path = require('path')
const yeoman = require('yeoman-generator')

class Generator extends yeoman.generators.Base {
  constructor() {
    super(...arguments)

    this.option('skip-name')
    this.option('skip-description')
    this.option('skip-version')
    this.option('skip-entry')
    this.option('skip-test')
    this.option('skip-repo')
    this.option('skip-keywords')
    this.option('skip-author')
    this.option('skip-license')
  }

  initializing() {
    this.config.set(this.fs.readJSON('package.json', {}))
    this.config.defaults({
      name: path.basename(this.destinationRoot()),
      version: '1.0.0',
      description: '',
      main: 'index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1'
      },
      keywords: [],
      license: 'ISC'
    })
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

    if (!this.options['skip-entry']) {
      prompts.push({
        type: 'input',
        name: 'main',
        message: 'entry point:',
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
      prompts.push({
        type: 'input',
        name: 'repository',
        message: 'git repository:'
      })
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
      if (!this.options['skip-test']) {
        res.scripts = {}
        res.scripts.test = res.test
        delete res.test
      }

      if (!this.options['skip-description'] && res.description === '') {
        delete res.description
      }

      if (!this.options['skip-repo'] && typeof res.repository === 'undefined') {
        delete res.repository
      }

      if (!this.options['skip-author'] && typeof res.author === 'undefined') {
        delete res.author
      }

      if (!this.options['skip-keywords'] && res.keywords.match(/^\w?$/)) {
        delete res.keywords
      } else if (!this.options['skip-keywords']) {
        res.keywords = res.keywords.trim().split(' ')
      }

      this.pkg = res
      done()
    })
  }

  writing() {
    this.fs.writeJSON('package.json', this.pkg)
  }
}

module.exports = Generator
