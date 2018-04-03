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

test('Translate3d will throw if you ask for percentage to pixel values and have not set a container', t => {
  t.plan(1)
  const translate3d = new Translate3d('100%', '200%', 0.5)

  t.throws(() => { String(translate3d) }, Error)
})

test('Translate3d returns a CSS string with percentage to pixel values', t => {
  t.plan(1)

  const div = createMockDiv(200, 200)
  const translate3d = new Translate3d('100%', '200%', 0.5)
  translate3d.setContainer(div)

  const expected = 'translate3d(200px, 400px, 0.5px);'
  const actual = String(translate3d)

  t.equal(actual, expected)
})

test('Translate3d can translate percentage values to pixel values', t => {
  t.plan(1)

  const div = createMockDiv(200, 200)
  const translate3d = new Translate3d('50%', '100%', '0.5')
  translate3d.setContainer(div)

  const expected = { tx: 100, ty: 200, tz: .5 }
  const actual = translate3d.toObject()

  t.match(actual, expected)
})

function createMockDiv (width, height) {
  const div = global.document.createElement('div')
  Object.assign(div.style, {
    width: width + 'px',
    height: height + 'px',
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