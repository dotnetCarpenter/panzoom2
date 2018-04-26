import Trait from 'traits.js'

import Observer from './Observer'

import eventTypes from '../models/EventTypes'
import Point from '../models/Point'
import GestureEvent from '../models/GestureEvent'

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
        this.fire(event.type, new GestureEvent(event))
      },

      on (eventName, f, reject) {
        this.observerOn(eventName, f, reject)

        let counter
        if (counter = nativeListeners.get(eventName)) {
          nativeListeners.set(eventName, counter + 1)
        } else if (eventTypes.indexOf(eventName) !== -1) {
          GestureEvent.addEvent(this.el, eventName, this.eventNotifier)
          nativeListeners.set(eventName, 1)
        }
      },

      off (eventName, f) {
        let counter
        if (counter = nativeListeners.get(eventName)) {
          nativeListeners.set(eventName, counter - 1)
        } else {
          GestureEvent.removeEvent(this.el, eventName, this.eventNotifier)
        }

        this.observerOff(eventName, f)
      },

      addNativeEventHandlers () {
        each(type => {
          if (eventTypes.indexOf(type) > -1) {
            GestureEvent.addEvent(this.el, type, this.eventNotifier)
          }
        }, this.currentListenerTypes)
      },

      removeNativeEventHandlers () {
        each(type => {
          if (eventTypes.indexOf(type) > -1) {
            GestureEvent.removeEvent(this.el, type, this.eventHandler)
          }
        }, this.currentListenerTypes)
      }
    })
  )
}
