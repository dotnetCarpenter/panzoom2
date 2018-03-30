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
            listener[1](...args)
          } catch (error) {
            listener[2](error)
          }
        }
      })
    },

    off (eventName, f) {
      listeners = listeners.filter(
        listener => listener[0] === eventName
          && listener[1] === f
            ? false
            : true)
    },

    once (eventName, f) {
      const self = this

      return new Promise((resolve, reject) => {
        this.on(
          eventName,
          function f(...args) {
            self.off(eventName, f)
            resolve(...args)
          },
          (error) => {
            self.off(eventName, f)
            reject(error)
          }
        )
      })
      // debug .then(() => { console.log(listeners) })
    },

    destroy () {
      listeners = null
    }
  }
}

export default Observer
