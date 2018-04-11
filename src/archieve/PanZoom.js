import Observer from './mixins/Observer'

import Swipe from './gestures/Swipe'
import Pinch from './gestures/Pinch'
import Pan from './gestures/Pan'
import Wheel from './gestures/Wheel'

import Zoom from './referents/Zoom'
import Move from './referents/Move'

/* detect passive option for event listeners */
let supportsPassiveOption = false
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassiveOption = true
    }
  })
  window.addEventListener('test', null, opts)
} catch (e) {}
/* end detect */
// console.log('supportsPassiveOption', supportsPassiveOption)

// mobile recognition from hammer.js
// const SUPPORT_TOUCH = 'ontouchstart' in window
// const MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i
// const SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent)

class PanZoom {
  constructor (options) {
    this.options = options
    this.el = null
    this.swipe = null
    this.pinch = null
    this.pan = null
    this.isListening = false

    this.referents = new Map([
      ['zoom', Zoom],
      ['move', Move]
    ])
    this.gestures = new Map([
      ['pinch', Pinch],
      ['wheel', Wheel],
      ['swipe', Swipe],
      ['pan', Pan]
    ])
  }

  with (...gestures) {
    this.gestures = gestures
  }

  setOptions (options) {
    this.options = options
  }

  listen () {
    // console.log('PanZoom::listen')

    if (this.isListening) return

    for (let [name, options] of this.options.configurations.entries()) {
      const factory = this.gestures.get(name)

      this[name] = new factory(options)
      this[name].setElement(this.el)
      this[name].listen(this.fire)
    }

    this.isListening = true
  }

  unlisten () {
    // console.log('PanZoom::unlisten')
    if (!this.isListening) return

    for (let name of this.options.configurations.keys()) {
      this.off(name)
      this[name].unlisten()
      this[name] = null
    }

    this.isListening = false
  }

  setElement (el) {
    this.el = el
  }
}

function createPanzoom (el, options) {
  if (!el) throw new TypeError('the first argument to createPanzoom must be an Element')

  const defaultOptions = {
    min: 0.5,
    max: 20,
    configurations: new Map([
      ['swipe', { distance: '70%' }],
      ['pinch', { pinchThreshold: .2 }],
      ['pan', {}],
      ['wheel', { zoomFactor: 0.03 }],
    ]),
    actions: [
      ['zoom', ['wheel', 'pinch']]
    ]
  }

  const panzoom = new PanZoom(options || defaultOptions)
  Object.assign(panzoom, Observer()) // add mixins
  panzoom.setElement(el)
  panzoom.listen()

  return panzoom
}

export {
  PanZoom,
  createPanzoom
}