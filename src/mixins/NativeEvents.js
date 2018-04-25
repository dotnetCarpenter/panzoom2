import Trait from 'traits.js'

import Observer from './Observer'

import eventTypes from '../models/EventTypes'
import Point from '../models/Point'

import { map, each, compose } from '../utils'

export default function NativeEvents () {
  let nativeListeners = new Map()

  return Trait.compose(
    Trait.resolve({
      on: 'observerOn',
      off: 'observerOff'
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
        event = normalizeEvent(event)
        this.fire(event.type, event)
      },

      on (eventName, f, reject) {
        this.observerOn(eventName, f, reject)

        let counter
        if (counter = nativeListeners.get(eventName)) {
          nativeListeners.set(eventName, counter + 1)
        } else if (eventTypes.indexOf(eventName) !== -1) {
          addEvent(this.el, eventName, this.eventNotifier)
          nativeListeners.set(eventName, 1)
        }
      },

      off (eventName, f) {
        let counter
        if (counter = nativeListeners.get(eventName)) {
          nativeListeners.set(eventName, counter - 1)
        } else {
          removeEvent(this.el, eventName, this.eventNotifier)
        }

        this.observerOff(eventName, f)
      },

      addNativeEventHandlers () {
        each(type => {
          if (eventTypes.indexOf(type) > -1) {
            addEvent(this.el, type, this.eventNotifier)
          }
        }, this.currentListenerTypes)
      },

      removeNativeEventHandlers () {
        each(type => {
          if (eventTypes.indexOf(type) > -1) {
            removeEvent(this.el, type, this.eventHandler)
          }
        }, this.currentListenerTypes)
      }
    })
  )
}

function addEvent (el, type, listener) {
  el.addEventListener(type, listener, true)
}

function removeEvent (el, type, listener) {
  el.removeEventListener(type, listener, true)
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
