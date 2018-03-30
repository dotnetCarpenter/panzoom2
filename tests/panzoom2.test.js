const test = require('tap').test
const JsDom = require('jsdom').JSDOM
const panzoom = require('../dist/panzoom')

const globalDom = new JsDom('', { pretendToBeVisual: true })
global.window = globalDom.window;
global.document = globalDom.window.document;
global.HTMLElement = globalDom.window.HTMLElement;

const PanZoom = panzoom.PanZoom

test('createPanzoom throws if no element is given', t => {
  t.plan(1)

  t.throw(panzoom.createPanzoom, TypeError)
})

test('createPanzoom creates a PanZoom object', t => {
  t.plan(1)

  const dom = new JsDom(`<body><div class='content'></div></body>`);
  const document = dom.window.document;
  const content = document.querySelector('.content');

  t.ok(panzoom.createPanzoom(content) instanceof PanZoom)
})
