import Observer from './mixins/Observer'

import Options from './models/Options'
import Swipe from './gestures/Swipe'
import Pinch from './gestures/Pinch'

class PanZoom {
  constructor (options) {
    this.options = options
    this.el = null
    this.swipe = null
    this.pinch = null
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