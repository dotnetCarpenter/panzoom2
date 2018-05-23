import Point from '../models/Point'
import { percentToPixel, getUnit } from '../mixins/LengthUnits'

class Swipe {
  constructor (options) {
    Object.assign(this, { percentToPixel })

    this.distance = options.distance

    this.el = null
    this.lastTouches = null
    this.detecting = false
  }

  listen (action) {
    // console.log('Swipe::listen')
    if (!(action instanceof Function)) throw new TypeError('action must be a function')

    if (getUnit(this.distance) === '%') {
      this.distance = Math.min(
        this.percentToPixel(parseFloat(this.distance), 'width'),
        this.percentToPixel(parseFloat(this.distance), 'height')
      )
    }

    this.action = Swipe.action(this, action)

    this.el.addEventListener('mousedown', this.action)
    this.el.addEventListener('touchstart', this.action)
  }

  unlisten () {
    // console.log('Swipe::unlisten')
    this.el.removeEventListener('mousedown', this.action)
    this.el.removeEventListener('touchstart', this.action)
  }

  setElement (el) {
    // TODO: unlisten on el before changing
    this.el = el
  }

  destroy () {
    this.el = null
    this.action = null
    this.lastTouches = null
  }

  static action (swipe, action) {
    return event => {
      swipe.unlisten()

      const startEvent = normalizeEvent(event)
      swipe.lastTouches = startEvent

      // console.log(startEvent)
      this.detecting = true

      swipe.el.addEventListener(startEvent.type.move, moveHandler)
      // removing event listeners from DOM via endHandler
      swipe.el.addEventListener(startEvent.type.end, endHandler)

      function moveHandler (event) {
        const currentEvent = normalizeEvent(event)

        // TODO: take timestamp into consideration - call endHandler if enough time has passed

        const distance = Math.sqrt(
          (currentEvent.touches[0].x - swipe.lastTouches.touches[0].x) ** 2
          +
          (currentEvent.touches[0].y - swipe.lastTouches.touches[0].y) ** 2
        )

        // console.log(distance)

        if (distance > swipe.distance) { // TODO: consider zoom in distance?
          const direction = diff(swipe.lastTouches, currentEvent)
          // console.log(direction)

          // tell subscribers
          action('swipe', direction)

          // tell event listeners
          const swipeEvent = new CustomEvent('swipe', { detail: direction })
          if (!swipe.el.dispatchEvent(swipeEvent)) {
            console.log('Swipe::action - event was cancelled')
          }

          // debugger
          endHandler() // removing event listeners from DOM via this (before touchend/mouseup)
        }
      }

      function endHandler () {
        swipe.el.removeEventListener(startEvent.type.move, moveHandler)
        swipe.el.removeEventListener(startEvent.type.end, endHandler)
        swipe.detecting = false
        swipe.listen(action)
      }

    }
  }
}

function normalizeEvent(ev) {
  const event = {}

  // console.log(ev)

  event.touches = [
    ev.touches
      ? new Point({ x: ev.touches[0].pageX, y: ev.touches[0].pageY })
      : new Point({ x: ev.pageX, y: ev.pageY })
  ]
  event.type = ev.type === 'touchstart' // TODO: use a proper enum
    ? { move: 'touchmove', end: 'touchend' }
    : { move: 'mousemove', end: 'mouseup' }
  event.timeStamp = Date.now()

  return event
}

// TODO: might also be useful in Pan.js
function diff (event1, event2) {
  // https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
  const deltaX = event1.touches[0].x - event2.touches[0].x // TODO: make addition and substraction easier for Point
  const deltaY = event1.touches[0].y - event2.touches[0].y

  // TODO: return an enum instead
  // console.log(deltaX, deltaY)
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) return 'left'
    else return 'right'
  } else {
    if (deltaY > 0) return 'up'
    else return 'down'
  }
}

export default Swipe
