const test = require('tap').test
const createObserver = require('../dist/panzoom').Observer

test('Observer has a promise interface', t => {
  t.plan(2)

  const observer = createObserver()
  const expected = 'foo'

  observer.promise('test').then((arg) => {
    t.equal(arg, expected)
    t.ok(true)
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
