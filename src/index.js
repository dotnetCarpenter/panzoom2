import Translate3d from './models/Translate3d'
import Options from './models/Options'
import PanZoom from './PanZoom'
import Observer from './traits/Observer'

// Mock Element if we are not in a browser

function createPanzoom (el, options = {}) {
  if (!el) throw new TypeError('the first argument to createPanzoom must be an Element')

  const panzoom = new PanZoom(new Options(options))
  panzoom.setElement(el)

  panzoom.listen()

  return Object.assign(panzoom, Observer(panzoom))
}

export {
  createPanzoom,
  PanZoom,
  Translate3d
}
