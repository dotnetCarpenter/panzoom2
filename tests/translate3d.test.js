const test = require('tap').test
const panzoom = require('../dist/panzoom')

const Translate3d = panzoom.Translate3d

test('Translate3d returns a CSS string', t => {
  t.plan(1)
  const translate3d = new Translate3d()

  const expected = 'translate3d(0px, 0px, 0px);'
  const actual = String(translate3d)

  t.equal(actual, expected)
})
