'use strict'

const { execSync } = require('child_process')
const path = require('path')
const { readFileSync } = require('fs')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

test('uses the right defaults on bare project', async () => { // eslint-disable-line
  const dir = await runGenerator(null, null, null)

  assert.file('package.json')

  assert.JSONFileContent('package.json', { // eslint-disable-line
    name: dir,
    version: '1.0.0',
    main: 'index.js',
    license: 'ISC',
    scripts: {
      test: 'echo \"Error: no test specified\" && exit 1'
    }
  })
})

test('uses prompt responses', async () => { // eslint-disable-line
  await runGenerator(
    {
      name: 'foo',
      description: 'lorem ipsum dolor',
      version: '9.9.9',
      main: 'app.js',
      repo: 'foo/bar',
      keywords: 'foo bar baz qux',
      author: 'foobar',
      license: 'MIT',
      test: 'ava --verbose'
    })

  assert.file('package.json')

  assert.JSONFileContent('package.json', {
    name: 'foo',
    description: 'lorem ipsum dolor',
    version: '9.9.9',
    main: 'app.js',
    repository: 'foo/bar',
    keywords: [
      'foo',
      'bar',
      'baz',
      'qux'
    ],
    author: 'foobar',
    license: 'MIT',
    scripts: {
      test: 'ava --verbose'
    }
  })
})

test('uses supplied defaults', async () => { // eslint-disable-line
  await runGenerator(
    null,
    {
      name: 'foo',
      description: 'lorem ipsum dolor',
      version: '9.9.9',
      main: 'app.js',
      repo: 'foo/bar',
      keywords: [
        'foo',
        'bar',
        'baz',
        'qux'
      ],
      author: 'foobar',
      license: 'MIT',
      test: 'ava --verbose'
    })

  assert.file('package.json')

  assert.JSONFileContent('package.json', {
    name: 'foo',
    description: 'lorem ipsum dolor',
    version: '9.9.9',
    main: 'app.js',
    repository: 'foo/bar',
    keywords: [
      'foo',
      'bar',
      'baz',
      'qux'
    ],
    author: 'foobar',
    license: 'MIT',
    scripts: {
      test: 'ava --verbose'
    }
  })
})

test('respects skip-* options', async () => { // eslint-disable-line
  await runGenerator(
    null,
    {
      'skip-name': true
    })

  assert.file('package.json')
  assert.JSONFileContent('package.json', { name: undefined, 'skip-name': undefined })
})

test('respects skip-test option', async () => { // eslint-disable-line
  await runGenerator(
    null,
    {
      'skip-test': true
    })

  assert.file('package.json')
  assert.JSONFileContent('package.json', { scripts: { test: undefined } })
})

test('removes extraneous fields from package.json', async () => { //eslint-disable-line
  await runGenerator(null, {
    name: 'foo',
    description: 'lorem ipsum dolor',
    version: '9.9.9',
    main: 'app.js',
    repo: 'foo/bar',
    keywords: [
      'foo',
      'bar',
      'baz',
      'qux'
    ],
    author: 'foobar',
    license: 'MIT',
    test: 'ava --verbose'
  })

  assert.file('package.json')

  const raw = readFileSync('package.json', 'utf8')
  const parsed = JSON.parse(raw)

  const junkFields = [
    'env',
    'resolved',
    'namespace',
    'argv',
    'repo',
    'test',
    '_'
  ]

  junkFields.forEach((field) => {
    assert.ok(!parsed.hasOwnProperty(field), `package.json contains ${field}`)
  })
})

test('infers repository field from git repo', async () => { // eslint-disable-line
  await runGenerator(
    null,
    null,
    (dir) => {
      execSync('git init', { cwd: dir })
      execSync('git remote add origin https://example.com/foo.git', { cwd: dir })
    })

  assert.file('package.json')
  assert.JSONFileContent('package.json', {
    repository: {
      type: 'git',
      url: 'https://example.com/foo.git'
    }
  })
})

test('git repository field inference doesn\'t break on no remote origin', async () => { // eslint-disable-line
  await runGenerator(
    null,
    null,
    (dir) => {
      execSync('git init', { cwd: dir })
    })

  assert.file('package.json')
  assert.JSONFileContent('package.json', {
    repository: {
      type: 'git',
      url: ''
    }
  })
})

function runGenerator(prompts, opts, pre) {
  let basename

  return new Promise((resolve) => {
    helpers.run(path.join(__dirname, 'app'))
      .inTmpDir((dir) => {
        if (pre) {
          pre(dir)
        }
        basename = path.basename(dir)
      })
      .withOptions(opts || {})
      .withPrompts(prompts || {})
      .on('end', () =>
        resolve(basename))
  })
}
