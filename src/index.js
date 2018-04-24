import Trait from 'traits.js'
import Observer from './mixins/Observer'

import Translate3d from './models/Translate3d'
import Point from './models/Point'
import eventTypes from './models/EventTypes'

import { map, each, compose } from './utils'

import Pinch from './gestures/Pinch'
import Pan from './gestures/Pan'
import Wheel from './gestures/Wheel'

import Zoom from './referents/Zoom'
// import Move from './referents/Move'

function panzoom (el, options) {
  if (!el) throw new TypeError('the first argument to panzoom must be an Element')

  const zoom = initReferent(Zoom, el, options)
  console.log(zoom)

  zoom.listen()

  return zoom
}

function initReferent (referent, el, options) {
  if (!referent.gestures) {
    throw new Error('Referent must have gestures')
  }
  // if (referent.isInitialized) {
  //   throw new Error('Referent is initialized - use .listen() or destroy()')
  // }
  // referent.isInitialized = true

  // shared observer between a referent and all of its gestures
  const hivemind = Trait(Observer())
  const concreteHivemind = Trait.create(Object.prototype, hivemind)

  const eventNotifier = compose(event => {
    concreteHivemind.fire(event.type, event)
  }, normalizeEvent)

  let isListening = false
  let proxy = Trait.create(Object.prototype,
    Trait.compose(
      Trait.resolve({ destroy: 'destroyListeners' }, hivemind),
      Trait.resolve(
        {
          'listen': 'listenReferent',
          'unlisten': 'unlistenReferent',
          'destroy': 'destroyReferent',
          'options': undefined,
          'gestures': undefined
        },
        Trait(referent)
      ),
      Trait({
        el,
        options: options || referent.options,
        get isListening () { return isListening },
        gestures: map(
          gesture => Trait.create(
            Object.prototype,
            Trait.compose(Trait(gesture), hivemind)
          ),
          referent.gestures
        ),
        listen (arg) {
          each(gesture => {
            gesture.listen(arg)
          }, this.gestures)

          this.listenReferent(arg)

          each(type => {
            if (eventTypes.indexOf(type) > -1) {
              addEvent(el, type, eventNotifier)
            }
          }, this.currentListenerTypes())

          isListening = true
        },
        unlisten (arg) {
          removeNativeEvents(this.el, this.currentListenerTypes(), eventNotifier)

          each(gesture => {
            gesture.unlisten(arg)
          }, this.gestures)

          this.unlistenReferent(arg)

          isListening = false
        },
        destroy () {
          removeNativeEvents(this.el, this.currentListenerTypes(), eventNotifier)
          this.destroyListeners()
          this.destroyReferent()
          return proxy = null
        }
      })
    )
  )

  return proxy
}

function normalizeEvent (nativeEvent) {
  const event = {
    touches: nativeEvent.touches
      ? map(t => new Point({ x: t.pageX, y: t.pageY }), nativeEvent.touches)
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

function removeNativeEvents (el, eventNames, eventHandler) {
  eventNames.forEach(type => {
    if (eventTypes.indexOf(type) > -1) {
      removeEvent(el, type, eventHandler)
    }
  })
}

function addEvent (el, type, listener) {
  el.addEventListener(type, listener, true)
}

function removeEvent (el, type, listener) {
  el.removeEventListener(type, listener, true)
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


panzoom.Translate3d = Translate3d
panzoom.Observer = Observer
panzoom.gestures = {}
panzoom.gestures.Pinch = Pinch
panzoom.gestures.Pan = Pan
panzoom.gestures.Wheel = Wheel

export default panzoom
