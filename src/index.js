import Translate3d from './mixins/Translate3d'
import Observer from './mixins/Observer'
import { createPanzoom, PanZoom } from './PanZoom'

import Pinch from './gestures/Pinch'
import Pan from './gestures/Pan'
import Wheel from './gestures/Wheel'

import Zoom from './referents/Zoom'
import Move from './referents/Move'

const referents = new Map([
  ['zoom', () => new Zoom()],
  ['move', () => new Move()]
])

export {
  createPanzoom,
  PanZoom, // only exposed to test
  Translate3d, // only exposed to test
  Observer, // only exposed to test
  referents,
  Pinch,
  Pan,
  Wheel
}
