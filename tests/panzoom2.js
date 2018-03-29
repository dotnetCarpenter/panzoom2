import { Translate3d } from '../src/index'

// const test = tap.test

test('Translate3d returns a CSS string', t => {
  const translate3d = new Translate3d

  const expected = 'translate3d(0px, 0px, 0px);'
  const actual = String(translate3d)
  t.equal(actual, expected)
})
