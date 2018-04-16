import Observer from './mixins/Observer'

import Translate3d from './models/Translate3d'
import Point from './models/Point'
import eventTypes from './models/EventTypes'

import { compose } from './utils'

import Pinch from './gestures/Pinch'
import Pan from './gestures/Pan'
import Wheel from './gestures/Wheel'

import Zoom from './referents/Zoom'
// import Move from './referents/Move'

function panzoom (el, options) {
  if (!el) throw new TypeError('the first argument to panzoom must be an Element')

  const zoom = initReferent(Zoom, el, options)

  zoom.listen()

  return zoom
}

function initReferent (referent, el, options) {
  if (!referent.gestures) {
    throw new Error('Referent must have gestures')
  }

  const observer = Observer()
  const eventNotifier = compose(event => {
    observer.fire(event.type, event)
  }, normalizeEvent)

  const ref = Object.assign(
    new Translate3d,
    referent.methods,
    {
      $el: observer,
      $options: options || referent.options,
      $gestures: initGestures(referent.gestures, observer),
      listen () {
        proxy('listen', this.$gestures)

        referent.listen.call(this)

        this.$el.currentListenerTypes.forEach(type => {
          if (eventTypes.indexOf(type) > -1) {
            addEvent(el, type, eventNotifier)
          }
        })
      },
      unlisten () {
        proxy('unlisten', this.$gestures)
        referent.unlisten.call(this)
      },
      destroy () {
        proxy('destroy', this.$gestures)
        referent.destroy.call(this)
      }
    }
  )

  bindMethods(ref)

  ref.setElement(el)

  return Object.seal(ref)
}

function initGestures (gestures, observer) {
  Object.values(gestures).forEach(gesture => {
    // Explicitly bind gesture functions
    // to gesture even object, even
    // if they are called from the observer.
    gesture = Object.assign(bindMethods(gesture), {
      $el: observer
    }, gesture.methods)

  })
  return gestures
}

function bindMethods (object, context) {
  if (!context) context = object

  for (let key in object) {
    // if (key === 'methods') return bindMethods(object['methods'], object)
    if (object[key] instanceof Function) {
      object[key] = object[key].bind(context)
    }
  }

  return object
}

function proxy (methodName, dependents) {
  Object.values(dependents).forEach(gesture => {
    gesture[methodName]()
  })
}

function addEvent (el, type, listener) {
  el.addEventListener(type, listener, true)
}

function removeEvent (el, type, listener) {}

function normalizeEvent (nativeEvent) {
  const event = {
    touches: nativeEvent.touches
      ? Array.prototype.map.call(
          nativeEvent.touches,
          t => new Point({ x: t.pageX, y: t.pageY }))
      : [new Point({ x: nativeEvent.pageX, y: nativeEvent.pageY })]
    ,
    type: nativeEvent.type,
    deltaY: nativeEvent.deltaY,
    preventDefault () {
      nativeEvent.preventDefault()
    },
    target: nativeEvent.target
  }

  return event
}

panzoom.Translate3d = Translate3d
panzoom.Observer = Observer
panzoom.gestures = {}
panzoom.gestures.Pinch = Pinch
panzoom.gestures.Pan = Pan
panzoom.gestures.Wheel = Wheel

export default panzoom
