import Translate3d from './models/Translate3d'
import Options from './models/Options'

class PanZoom {
  constructor (options) {
    this.el = null
  }

  listen () {
    console.log('listen')
  }

  unlisten () {
    console.log('unlisten')
  }

  setElement (el) {
    this.el = el
  }
}

// Mock Element if we are not in a browser

function createPanzoom (el, options = {}) {
  if (!el) throw new TypeError('the first argument to createPanzoom must be an Element')

  const panzoom = new PanZoom(new Options(options))

  panzoom.listen()

  return panzoom
}

export {
  createPanzoom,
  Translate3d
}
