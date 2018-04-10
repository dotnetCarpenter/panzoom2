'use strict'

const listenButton = document.getElementById('listenButton')
const container = document.querySelector('.container')
const scene = document.querySelector('.scene')

const options = {
  bounds: scene.getBoundingClientRect(),
  zoomFactor: 0.03,
  pinchThreshold: .3,
  world: container,
  scene: scene
}

const zoom = new Zoom()

/* referent */
function Zoom (el, options) {
  const manager = new Manager({el:el})
  const wheel = new Wheel({eventName: 'zoom'})
  const pinch = new Pinch({eventName: 'zoom'})

  manager.addReferent('zoom', action)

  wheel.setup(manager)
  pinch.setup(manager)

  function action (event) {}
}

function Manager (options) {
  const el = options.el
  const dispatchEvents = options.dispatchEvents || false

  // #region gestures
  /*
  const gestures = {
    wheel: [],
    mousedown: [],
    mousemove: [],
    mouseup: [],
    touchstart: [],
    touchmove: [],
    touchend: [],
  } */
  // #endregion
  const eventListeners = {}

  //TODO: mixin observer to an object that attach at most one event type
  // trigger events via fire
  // normalize the event but send the originale event too
  // Let the gesture get access to observer directly
  const internalPublisher = panzoom.Observer()
  internalPublisher.on = aspect(registrate, internalPublisher.on, internalPublisher)
  internalPublisher.once = aspect(registrate, internalPublisher.once, internalPublisher)
  internalPublisher.promise = aspect(registrate, internalPublisher.promise, internalPublisher)

  function aspect (wrapper, originale, context) {
    return function () {
      const args = [].slice.call(arguments, 0)
      // addEvent(eventName, dispatch)
      wrapper.apply(null, args)
      return originale.apply(context, args)
    }
  }

  function registrate (eventName, success, error) {
    // TODO: map eventlisteners
    const listeners = eventListeners[eventName] || []

    listeners.push()

    eventListeners[eventName] = listeners
  }

  function addEvent () {
    el.addEventListener(name, dispatch, true)
  }

  function dispatch (ev) {
    const event = Object.assign({
      originale: ev
    }, normalizeEvent(ev))
    internalPublisher.fire(event)
  }

  const api = Object.assign({
    addReferent: function (referent) {}
  }, panzoom.Observer())

  // from Pinch.js
  function normalizeEvent(ev) {
    const event = {}

    // console.log(ev)

    event.touches = Array.prototype.map.call(
      ev.touches,
      t => new Point({ x: t.pageX, y: t.pageY })
    )
    event.type = { move: 'touchmove', end: 'touchend' } // TODO: use a proper enum
    event.timeStamp = Date.now()

    return event
  }

  // from Wheel.js
  function normalizeEvent(ev) {
    const event = {}

    // console.log(ev)

    event.touches = [
      new Point({ x: ev.pageX, y: ev.pageY })
    ]
    event.type = null
    event.timeStamp = Date.now()

    return event
  }

  return api
}

/* gestures */
function Wheel () {}
Wheel.prototype.setup = function (manager) {
  manager.on('wheel', this.listen)
}
Wheel.prototype.listen = function () {}
Wheel.prototype.moveHandler = function () {}
Wheel.prototype.endHandler = function () {}
Wheel.prototype.unlisten = function () {}
Wheel.prototype.destroy = function () {}

function Pinch () {}
Pinch.prototype.setup = function (manager) {
  manager.on('touchstart', this.listen)
}
Pinch.prototype.listen = function () {}
Pinch.prototype.moveHandler = function () {}
Pinch.prototype.endHandler = function () {}
Pinch.prototype.unlisten = function () {}
Pinch.prototype.destroy = function () {}
