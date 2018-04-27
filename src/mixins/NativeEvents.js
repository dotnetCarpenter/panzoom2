import Trait from 'traits.js'

import Observer from './Observer'

import eventTypes from '../models/EventTypes'
import Point from '../models/Point'
import GestureEvent from '../models/GestureEvent'

import { map, each, compose } from '../utils'

export default function NativeEvents () {

  /* detect passive option for event listeners */
  let supportsPassiveOption = false
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassiveOption = true
      }
    })
    window.addEventListener('test', null, opts)
  } catch (e) {}
  /* end detect */
  // console.log('supportsPassiveOption', supportsPassiveOption)

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

      eventNotifier(event) {
        this.fire(event.type, new GestureEvent(event))
      },

      on (eventName, f, options = {}) {
        this.observerOn(eventName, f, options.reject)

        if (!isValidEventType(eventName)) return

        if (options.passive && !supportsPassiveOption) options = null
        else if (options.passive) options.useCapture = true

        let counter
        if (counter = nativeListeners.get(eventName)) {
          nativeListeners.set(eventName, counter + 1)
        } else {
          GestureEvent.addEvent(this.el, eventName, this.eventNotifier, options)
          nativeListeners.set(eventName, 1)
        }
      },

      off (eventName, f) {
        this.observerOff(eventName, f)

        if (!isValidEventType(eventName)) return

        let counter
        if (counter = nativeListeners.get(eventName)) {
          nativeListeners.set(eventName, counter - 1)
          if (counter === 1) GestureEvent.removeEvent(this.el, eventName, this.eventNotifier)
        } else {
          GestureEvent.removeEvent(this.el, eventName, this.eventNotifier)
        }
      },

      destroy () {
        this.removeNativeEventHandlers()
        nativeListeners = null
        this.observerDestroy()
      },

      // TODO: figure out how to reset event listener options
      addNativeEventHandlers () {
        each(type => {
          if (isValidEventType(type) && !nativeListeners.has(type)) {
            debugger
            GestureEvent.addEvent(this.el, type, this.eventNotifier)
            nativeListeners.set(type, 1)
          }
        }, this.currentListenerTypes)
      },

      removeNativeEventHandlers () {
        each(type => {
          if (isValidEventType(type) && nativeListeners.has(type)) {
            GestureEvent.removeEvent(this.el, type, this.eventNotifier)
            nativeListeners.delete(type)
          }
        }, this.currentListenerTypes)
      }
    })
  )
}

function isValidEventType (type) {
  return eventTypes.indexOf(type) > -1
}
