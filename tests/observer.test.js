const test = require('tap').test
const createObserver = require('../dist/panzoom').Observer

test('Observer has a promise interface', t => {
  t.plan(1)

  const observer = createObserver()
  const expected = 'foo'

  observer.promise('test').then((actual) => {
    t.equal(actual, expected)
  })

  observer.fire('test', expected)
})

test('Observer has a aync/await interface', async function (t) {
  t.plan(1)

  const observer = createObserver()

  setTimeout(() => {
    observer.fire('test', expected)
  }, 0)

  const expected = 'bar'
  const actual = await observer.promise('test')
  t.equal(actual, expected)
})

test('Observer has a publisher/subscriber interface', t => {
  t.plan(1)

  const observer = createObserver()
  const expected = 'foobar'

  observer.on('test', (actual) => {
    t.equal(actual, expected)
  })

  observer.fire('test', expected)
})

test('Observer can remove a specific subscriber', t => {
  t.plan(1)

  const observer = createObserver()

  observer.on('test', doNotCall)
  observer.on('test', doCall)
  observer.off('test', doNotCall)

  observer.fire('test')

  function doNotCall () {
    t.ok(false)
  }
  function doCall () {
    t.ok(true)
  }
})

test('Observer can remove all subscribers', t => {
  t.plan(0)

  const observer = createObserver()

  observer.on('test', doNotCall)
  observer.on('test', alsoDoNotCall)
  observer.off('test')

  observer.fire('test')
  t.end()

  function doNotCall () {
    t.ok(false)
  }
  function alsoDoNotCall () {
    t.ok(true)
  }
})

test('Observer has a once method', t => {
  t.plan(1)

  const observer = createObserver()

  observer.once('test', doCall)

  observer.fire('test')
  observer.fire('test')
  observer.fire('test')

  t.end()

  function doCall () {
    t.ok(true)
  }
})

test('Observer can have different event types and listeners', t => {
  t.plan(3)

  const observer = createObserver()

  observer.on('test1', doCall)
  observer.on('test2', doCall)

  observer.fire('test1')
  observer.fire('test2')
  observer.off('test1')
  observer.fire('test2')

  function doCall () {
    t.ok(true)
  }
})

test('Observer returns a list of listener types via currentListenerTypes', t => {
  t.plan(3)

  const observer = createObserver()
  const expected = ['wheel']

  observer.on('wheel', noop)
  t.match(observer.currentListenerTypes, expected, 'should match [wheel]')

  observer.on('mousedown', noop)
  expected.push('mousedown')
  t.match(observer.currentListenerTypes.sort(), expected.sort(), 'should match [wheel, mousedown]')

  observer.on('wheel', noop)
  t.strictSame(observer.currentListenerTypes.sort(), expected.sort(), 'should match [wheel, mousedown]')

  function noop () {}
})
