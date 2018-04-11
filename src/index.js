import Translate3d from './mixins/Translate3d'
import Observer from './mixins/Observer'

import Pinch from './gestures/Pinch'
import Pan from './gestures/Pan'
import Wheel from './gestures/Wheel'

import Zoom from './referents/Zoom'
// import Move from './referents/Move'

function panzoom (el, options) {
  if (!el) throw new TypeError('the first argument to panzoom must be an Element')

  const zoom = initReferent(Zoom, options)

  zoom.listen()

  return zoom
}

function initReferent (referent, options) {
  if (!referent.gestures) {
    throw new Error('Referent most have gestures')
  }

  const observer = Observer()

  const ref = Object.assign(
    {
      $el: observer,
      $gestures: initGestures(referent.gestures, observer),
      listen () {
        proxy('listen', this.$gestures)
        referent.listen.call(this)
      },
      unlisten () {
        proxy('unlisten', referent, this.$gestures)
        referent.unlisten.call(this)
      },
      destroy () {
        proxy('destroy', referent, this.$gestures)
        referent.destroy.call(this)
      }
    },
    referent.methods
  )

  return Object.seal(ref)
}

function proxy (methodName, dependents) {
  Object.values(dependents).forEach(gesture => {
    gesture[methodName]()
  })
}

function initGestures (gestures, observer) {
  Object.values(gestures).forEach(gesture => {
    gesture.$el = observer
  })
  return gestures
}

panzoom.Translate3d = Translate3d
panzoom.Observer = Observer
panzoom.gestures = {}
panzoom.gestures.Pinch = Pinch
panzoom.gestures.Pan = Pan
panzoom.gestures.Wheel = Wheel

export default panzoom
