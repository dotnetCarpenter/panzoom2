const test = require('tap').test
const JSDOM = require('jsdom').JSDOM
const Translate3d = require('../dist/panzoom').Translate3d

// const test = test
// const JSDOM = jsdom.default.JSDOM
// console.log(tap)
const globalDom = new JSDOM('', { pretendToBeVisual: true })
global.window = globalDom.window
global.document = globalDom.window.document

test('Translate3d returns a CSS string width default values', t => {
  t.plan(1)
  const translate3d = new Translate3d()

  const expected = 'matrix(1, 0, 0, 1, 0, 0)'
  const actual = String(translate3d)

  t.equal(actual, expected)
})

test('Translate3d returns a CSS string with parameter values', t => {
  t.plan(1)
  const translate3d = new Translate3d(100, 200, 0.5)

  const expected = 'matrix(0.5, 0, 0, 0.5, 100, 200)'
  const actual = String(translate3d)

  t.equal(actual, expected)
})

test('Translate3d will throw if you ask for percentage to pixel values and have not set a container', t => {
  t.plan(1)
  const translate3d = new Translate3d('100%', '200%', 0.5)

  t.throws(() => { String(translate3d) }, Error)
})

test('Translate3d returns a CSS string with percentage to pixel values', t => {
  t.plan(1)

  const div = createMockDiv(200, 200)
  const translate3d = new Translate3d('100%', '200%', 0.5)
  translate3d.setElement(div)

  const expected = 'matrix(0.5, 0, 0, 0.5, 200, 400)'
  const actual = String(translate3d)

  t.equal(actual, expected)
})

test('Translate3d can translate percentage values to pixel values', t => {
  t.plan(1)

  const div = createMockDiv(200, 200)
  const translate3d = new Translate3d('50%', '100%', '0.5')
  translate3d.setElement(div)

  const expected = { tx: 100, ty: 200, tz: .5 }
  const actual = translate3d.toObject()

  t.match(actual, expected)
})

test('Translate3d can parse a css style string', t => {
  t.plan(3)

  const translate3d = Translate3d.parse('matrix(1.3, 0, 0, 1.3, 0, 0)')

  t.ok(translate3d instanceof Translate3d, '.parse() should return an instance of Translate3d')

  let expected = { tx: 0, ty: 0, tz: 1.3 }
  let actual = translate3d

  t.match(actual, expected, ' should return a string identical to the parsed string')

  expected = null
  actual = Translate3d.parse('matrix(something very wrong)')
  t.equal(actual, expected, '.parse() should return null for incorrect transform matrix')
})

function createMockDiv (width, height) {
  const div = global.document.createElement('div')
  Object.assign(div.style, {
    width: width + '',
    height: height + '',
  })

  // we have to mock this for jsdom.
  div.getBoundingClientRect = () => ({
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
  })

  return div
}
