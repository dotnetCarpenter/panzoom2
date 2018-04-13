'use strict'

function Observer () {
  let listeners = []

  return {
    on (eventName, f, reject) {
      if (!(reject instanceof Function)) reject = f

      listeners.push([eventName, f, reject])
    },

    fire (eventName, ...args) {
      listeners.forEach(listener => {
        if (listener[0] === eventName) {
          try {
            // listener[1].apply(listener[1], args)
            listener[1](...args)
          } catch (error) {
            listener[2](error)
          }
        }
      })
    },

    off (eventName, f) {
      listeners = listeners.filter(
        listener => {
          if (listener[0] === eventName) {
            // if f is not defined then remove all listeners with the eventName
            if (!f) return false
            else return listener[1] === f ? false : true
          }
          return true
        }
      )
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
      return listeners
        .map(x => x[0])
        .reduce((a, b) => a.indexOf(b) > -1 ? a : a.concat([b]), [])
    }
  }
}

export default Observer
