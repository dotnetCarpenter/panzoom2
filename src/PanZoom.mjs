import Observer from './mixins/Observer'
import Options from './models/Options'

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
  }

  listen () {
    // console.log('PanZoom::listen')

    if (this.isListening) return

    for (let name of this.options.configurations.keys()) {
      const factory = this.options.getFactory(name)

      this[name] = new factory()
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