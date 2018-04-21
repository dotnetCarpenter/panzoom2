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

  // shared observer between a referent and all of its gestures
  const hivemind = Observer()

  const gestures = map(gesture => Object.assign(gesture, hivemind), referent.gestures)
  referent.gestures = gestures

  const eventNotifier = compose(event => {
    hivemind.fire(event.type, event)
  }, normalizeEvent)

  const proxy = Object.assign(
    hivemind,
    referent,
    {
      el,
      options: options || referent.options,
      isListening: false,
      listen (arg) {
        gestures.forEach(gesture => {
          gesture.listen(arg)
        })

        referent.listen.call(this)

        this.currentListenerTypes().forEach(type => {
          if (eventTypes.indexOf(type) > -1) {
            addEvent(el, type, eventNotifier)
          }
        })

        this.isListening = true
      },
      unlisten (arg) {
        gestures.forEach(gesture => {
          gesture.unlisten(arg)
        })

        referent.unlisten.call(this)

        this.currentListenerTypes().forEach(type => {
          if (eventTypes.indexOf(type) > -1) {
            removeEvent(el, type, eventNotifier)
          }
        })

        this.isListening = false
      },
      destroy () {
        gestures.forEach(gesture => {
          gesture.destroy()
        })
        referent.destroy.call(this)
      }
    }
  )

  // Object.assign(ref, bindMethods(referent.methods, ref))

  return Object.seal(proxy)
}

function each (f, list) {
  for (let key in list) {
    f(list[key], key)
  }
}

function map (f, list) {
  const m = []
  each((value, key) => {
    m.push(f(value, key))
  }, list)
  return m
}

/* function bindMethods (object, context) {
  if (!context) context = object

  for (let key in object) {
    // if (key === 'methods') return bindMethods(object['methods'], object)
    if (object[key] instanceof Function) {
      object[key] = object[key].bind(context)
    }
  }

  return object
} */

function addEvent (el, type, listener) {
  el.addEventListener(type, listener, true)
}

function removeEvent (el, type, listener) {
  el.removeEventListener(type, listener, true)
}

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
