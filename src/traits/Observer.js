'use strict'

function Observer () {
  let listeners = []

  return {
    on (eventName, f) {
      return new Promise((resolve, reject) => {
        listeners.push([eventName, resolve, reject])
      })
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
      this.on(eventName, function once (...args) {
        self.off(eventName, once)
        self.fire(eventName, ...args)
      })
    },

    destroy () {
      listeners = null
    }
  }
}

export default Observer
