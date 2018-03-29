const panzoom = require('../dist/panzoom')
const tap = require('tap')

const Translate3d = panzoom.Translate3d
const test = tap.test

test('createPanzoom throws if no element is given', t => {
  t.plan(1)

  t.throw(panzoom.createPanzoom, TypeError)
})

test('Translate3d returns a CSS string', t => {
  t.plan(1)
  const translate3d = new Translate3d()

  const expected = 'translate3d(0px, 0px, 0px);'
  const actual = String(translate3d)

  t.equal(actual, expected)
})
