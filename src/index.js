import Trait from 'traits.js'
import NativeEvents from './mixins/NativeEvents'

import Translate3d from './models/Translate3d'
import Point from './models/Point'

import { map, each } from './utils'

import Zoom from './referents/Zoom'
// import Move from './referents/Move'

// library exports
import Observer from './mixins/Observer'
import Pinch from './gestures/Pinch'
import Pan from './gestures/Pan'
import Wheel from './gestures/Wheel'
import Swipe from './gestures/Swipe'

/**
 *
 * @param {HTMLElement} el
 * @param {object} referent
 * @param {object} options
 */
function panzoom (el, referent = Zoom, options) {
  if (!el) throw new TypeError('the first argument to panzoom must be an Element')

  const initializedReferent = initReferent(referent, el, options)

  console.log(initializedReferent)

  initializedReferent.listen()

  return initializedReferent
}

function initReferent (referent, el, options) {
  if (!(referent.gestures && Object.values(referent.gestures)[0])) {
    throw new Error('Referent must have gestures')
  }

  // mixin options from referent with option argument
  options = Object.assign({}, referent.options, options)

  // if (referent.isInitialized) {
  //   throw new Error('Referent is initialized - use .listen() or destroy()')
  // }
  // referent.isInitialized = true

  // shared observer between a referent and all of its gestures
  let hivemind = NativeEvents()

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

        options,

        get isListening () { return isListening },

        gestures: map(
          (gesture, name) => {
            gesture.el = el

            const defaultOptions = {}
            each((value, key) => {
              // better error message than the one from traits.js
              if (value.required && !options[key]) {
                throw new Error(`options is missing ${key} - required by ${isNaN(name) ? name : 'a'} gesture`)
              }

              if (value.required) defaultOptions[key] = Trait.required
              else defaultOptions[key] = value
            }, gesture.options)
            // convert a gesture's options record into a trait instance where
            // `options` overwrite a gesture's default options
            try {
              gesture.options = Trait.object(Object.assign((defaultOptions), options))
            } catch (error) {
              throw new Error(`${error.message} in options`)
            }

            // convert gesture record into a trait instance
            const t = Trait.create(
              Object.prototype,
              Trait.compose(Trait(gesture), hivemind)
            )
            return t
          },
          referent.gestures
        ),

        listen (arg) {
          if (this.isListening) return

          each(gesture => {
            gesture.listen(arg)
          }, this.gestures)

          this.listenReferent(arg)

          // TODO: maybe not needed since we call listen on all gestures and they add the native event handler via NativeEvents.js
          this.addNativeEventHandlers()

          isListening = true
        },

        unlisten (arg) {
          this.removeNativeEventHandlers()

          each(gesture => {
            gesture.unlisten(arg)
          }, this.gestures)

          if (this.unlistenReferent) this.unlistenReferent(arg)

          isListening = false
        },

        destroy () {
          this.destroyListeners()
          if (this.destroyReferent) this.destroyReferent()

          return proxy = hivemind = null
        }
      })
    )
  )

  return proxy
}

panzoom.Point = Point
panzoom.Translate3d = Translate3d
panzoom.Observer = Observer
panzoom.gestures = {}
panzoom.gestures.Pinch = Pinch
panzoom.gestures.Pan = Pan
panzoom.gestures.Wheel = Wheel
panzoom.gestures.Swipe = Swipe
panzoom.referents = {}
panzoom.referents.Zoom = Zoom

export default panzoom
