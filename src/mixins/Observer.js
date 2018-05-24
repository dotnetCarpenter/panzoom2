import { compose, partial, each, filter, reduce, map } from '../utils'

const mapReduce = compose(
  partial(reduce)((a, b) => a.indexOf(b) > -1 ? a : a.concat([b]), []),
  partial(map)(x => x[0])
)

export default function Observer () {
  let listeners = []

  return {
    on (eventName, f, reject) {
      if (!(f instanceof Function)) throw new TypeError('event handler is not a function')

      listeners.push([eventName, f, reject])
    },

    fire (eventName, ...args) {
      each(listener => {
        if (listener[0] === eventName) {
          try {
            listener[1].apply(this, args)
            // listener[1](...args)
          } catch (error) {
            if (listener[2]) listener[2](error)
            else console.error ? console.error(error) : console.log(error)
          }
        }
      }, listeners)
    },

    /**
     *
     * @param {string} eventName The event type you want to remove
     * @param {function} f The function listening for the event type to
     * distinguish from other listeners for the same event type
     */
    off (eventName, f) {
      let notRemoved = true

      listeners = filter(
        listener => {
          if (listener[0] === eventName) {
            // if f is not defined then remove all listeners with the eventName
            if (!f) return false
            else return listener[1] === f ? notRemoved = false : true
          }
          return true
        }
      , listeners)

      return !notRemoved
    },

    once (eventName, f, errorHandler) {
      const self = this
      this.on(eventName, function once (...args) {
        self.off(eventName, once)
        f(...args)
      }, errorHandler)
    },

    promise (eventName) {
      const self = this

      return new Promise((resolve, reject) => {
        this.on(
          eventName,
          function wrapper(...args) {
            resolve(...args)
            self.off(eventName, wrapper)
          },
          (error) => {
            reject(error)
            self.off(eventName, wrapper)
          }
        )
      })
      // debug
      // .then(() => { console.log(listeners) })
    },

    destroy () {
      listeners = null
    },

    get currentListenerTypes () {
      return mapReduce(listeners)
    }
  }
}
