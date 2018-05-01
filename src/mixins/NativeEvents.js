import Trait from 'traits.js'

import Observer from './Observer'

import eventTypes from '../models/EventTypes'
import Point from '../models/Point'
import GestureEvent from '../models/GestureEvent'

import { map, each, compose } from '../utils'
import { remToPixel } from './LengthUnits';


/* detect passive option for event listeners */
let supportsPassiveOption = false
try {
  let opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassiveOption = true
    }
  })
  window.addEventListener('test', null, opts)
} catch (e) {}
/* end detect */
// console.log('supportsPassiveOption', supportsPassiveOption)

const matchPassive = /\.passive$/
function isPassive (eventName) {
  return matchPassive.test(eventName)
}

function isValidEventType (eventName) {
  return eventTypes.indexOf(eventName.replace(matchPassive, '')) > -1
}

/**
 * Returns the correct eventName and options object.
 * @param {string} eventName Removes '.passive' from the eventName if passive is not supported
 * @return {object} passive options if supported or true for options to use capture.
 */
function normalisePassive (eventName) {
  return supportsPassiveOption && isPassive(eventName) ? {
    realEventName: eventName.replace(matchPassive, ''),
    options: {
      capture: true,
      passive: true
    }
  } : {
    realEventName: eventName.replace(matchPassive, ''),
    options: true
  }
}

export default function NativeEvents () {
  let nativeListeners = new Map()

  return Trait.compose(
    Trait.resolve({
      on: 'observerOn',
      off: 'observerOff',
      destroy: 'observerDestroy'
    },
      Trait(Observer())
    ),
    Trait({
      el: Trait.required,
      currentListenerTypes: Trait.required,
      on: Trait.required,
      off: Trait.required,
      fire: Trait.required,

      eventNotifier (event) {
        this.fire(event.type, new GestureEvent(event))
      },

      eventNotifierPassive (event) {
        this.fire(event.type + '.passive', new GestureEvent(event))
      },

      on (eventName, f, options = {}) {
        this.observerOn(eventName, f, options.reject)

        if (!isValidEventType(eventName)) return

        let realEventName;
        ({ options, realEventName} = normalisePassive(eventName))

        const eventNotifier = options.passive ? this.eventNotifierPassive : this.eventNotifier

        const counter = nativeListeners.get(eventName)
        if (counter) {
          nativeListeners.set(eventName, counter + 1)
        } else {
          GestureEvent.addEvent(this.el, realEventName, eventNotifier, options)
          nativeListeners.set(eventName, 1)
        }
      },

      off (eventName, f) {
        if (!this.observerOff(eventName, f)) return

        if (!isValidEventType(eventName)) return

        let { options, realEventName } = normalisePassive(eventName)

        let counter
        if (counter = nativeListeners.get(eventName)) {
          nativeListeners.set(eventName, counter - 1)
          if (counter === 1) GestureEvent.removeEvent(this.el, realEventName, this.eventNotifier, options)
        } else {
          GestureEvent.removeEvent(this.el, realEventName, this.eventNotifier, options)
        }
      },

      destroy () {
        this.removeNativeEventHandlers()
        nativeListeners = null
        this.observerDestroy()
      },

      addNativeEventHandlers () {
        each(eventName => {
          if (isValidEventType(eventName) && !nativeListeners.has(eventName)) {
            let { options = {}, realEventName } = normalisePassive(eventName)
            const eventNotifier = options.passive ? this.eventNotifierPassive : this.eventNotifier
            // debugger
            GestureEvent.addEvent(this.el, realEventName, eventNotifier, options)
            nativeListeners.set(eventName, 1)
          }
        }, this.currentListenerTypes)
      },

      removeNativeEventHandlers () {
        each(eventName => {
          if (isValidEventType(eventName) && nativeListeners.has(eventName)) {
            let { options, realEventName } = normalisePassive(eventName)
            GestureEvent.removeEvent(this.el, realEventName, this.eventNotifier, options)
            nativeListeners.delete(eventName)
          }
        }, this.currentListenerTypes)
      }
    })
  )
}
