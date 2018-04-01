import Observer from './mixins/Observer'

import Options from './models/Options'
import Swipe from './gestures/Swipe'
import Pinch from './gestures/Pinch'
import Pan from './gestures/Pan'

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
console.log('supportsPassiveOption', supportsPassiveOption)

class PanZoom {
  constructor (options) {
    this.options = options
    this.el = null
    this.swipe = null
    this.pinch = null
    this.pan = null
    this.isListening = false
  }

  listen (gesture) { // TODO: only enable gesture if defined
    // console.log('PanZoom::listen')

    if (this.isListening) return

    this.swipe = new Swipe()
    this.swipe.setElement(this.el)
    this.swipe.listen(this.fire)

    this.pinch = new Pinch({
      threshold: .2
    })
    this.pinch.setElement(this.el)
    this.pinch.listen(this.fire)

    this.pan = new Pan()
    this.pan.setElement(this.el)
    this.pan.listen(this.fire)

    this.isListening = true
  }

  unlisten (gesture) { // TODO: only disable gesture if defined
    // console.log('PanZoom::unlisten')
    if (!this.isListening) return

    this.off('swipe')
    this.swipe.unlisten()
    this.swipe = null

    this.off('pinch')
    this.pinch.unlisten()
    this.pinch = null

    this.off('pan')
    this.pan.unlisten()
    this.pan = null

    this.isListening = false
  }

  setElement (el) {
    this.el = el
  }
}

function createPanzoom (el, options = {}) {
  if (!el) throw new TypeError('the first argument to createPanzoom must be an Element')

  const panzoom = new PanZoom(new Options(options))
  Object.assign(panzoom, Observer()) // add mixins
  panzoom.setElement(el)
  panzoom.listen()

  return panzoom
}

export {
  PanZoom,
  createPanzoom
}