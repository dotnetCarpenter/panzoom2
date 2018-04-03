import { test } from 'tap'
import Translate3d from '../src/models/Translate3d'

// const Translate3d = panzoom.Translate3d
// const test = tap.test

test('Translate3d returns a CSS string width default values', t => {
  t.plan(1)
  const translate3d = new Translate3d()

  const expected = 'translate3d(0px, 0px, 0px);'
  const actual = String(translate3d)

  t.equal(actual, expected)
})

test('Translate3d returns a CSS string with parameter values', t => {
  t.plan(1)
  const translate3d = new Translate3d(100, 200, 0.5)

  const expected = 'translate3d(100px, 200px, 0.5px);'
  const actual = String(translate3d)

  t.equal(actual, expected)
})
