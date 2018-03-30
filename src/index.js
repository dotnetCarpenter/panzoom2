import Translate3d from './models/Translate3d'
import Options from './models/Options'
import PanZoom from './PanZoom'
import Observer from './traits/Observer'

function createPanzoom (el, options = {}) {
  if (!el) throw new TypeError('the first argument to createPanzoom must be an Element')

  const panzoom = new PanZoom(new Options(options)) // change PanZoom from a class to a trait user directly
  Object.assign(panzoom, Observer())
  panzoom.setElement(el)
  panzoom.listen()

  return panzoom
}

export {
  createPanzoom,
  PanZoom,
  Translate3d
}
