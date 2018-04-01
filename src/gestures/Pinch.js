import Point from '../models/Point'

class Pinch {
  constructor (options) {
    this.threshold = options.threshold
    this.el = null
    this.lastTouches = null
    this.lastDistance = null
    this.detecting = false
  }

  listen (action) {
    console.log('Pinch::listen')
    if (!(action instanceof Function)) throw new TypeError('action must be a function')

    this.action = Pinch.action(this, action)

    this.el.addEventListener('touchstart', this.action)
  }

  unlisten () {
    console.log('Pinch::unlisten')
    this.el.removeEventListener('touchstart', this.action)
  }

  setElement (el) {
    this.el = el
  }

  destroy () {
    this.el = null
    this.action = null
    this.lastTouches = null
  }

  static action (pinch, action) {
    return event => {
      event.preventDefault()

      pinch.unlisten()

      const startEvent = normalizeEvent(event)
      // console.log(startEvent)
      if (startEvent.touches.length < 2) {
        endHandler()
        return
      }
      pinch.lastTouches = startEvent

      this.detecting = true

      pinch.el.addEventListener(startEvent.type.move, moveHandler)
      pinch.el.addEventListener(startEvent.type.end, endHandler)

      function moveHandler (event) {
        event.preventDefault()
        const currentEvent = normalizeEvent(event)
        // console.log('getting moves!', currentEvent)

        // TODO: take timestamp into consideration - call endHandler if enough time has passed

        // movement (translate)
        const distanceFromFirstTouch = Math.sqrt( // TODO: abstract this somewhere
          (currentEvent.touches[0].x - pinch.lastTouches.touches[0].x) ** 2
          +
          (currentEvent.touches[0].y - pinch.lastTouches.touches[0].y) ** 2
        )
        // distance between two first fingers
        const distanceBetweenTwoFingers = Math.sqrt( // TODO: abstract this somewhere
          (currentEvent.touches[0].x - pinch.lastTouches.touches[1].x) ** 2
          +
          (currentEvent.touches[0].y - pinch.lastTouches.touches[1].y) ** 2
        )
        if (pinch.lastDistance) console.log(distanceBetweenTwoFingers > pinch.lastDistance ? 'zoom in' : 'zoom out')
        pinch.lastDistance = distanceBetweenTwoFingers

        // console.log('distance', distanceFromFirstTouch, distanceBetweenTwoFingers)

        const scale = distanceFromFirstTouch / distanceBetweenTwoFingers
        // console.log('scale', scale)

        if (scale > pinch.threshold) {
          // Focus formular ported from svg.panzoom.js - ask Ulrich why it's like that
          const currentFocus = new Point({
            x: currentEvent.touches[0].x + .5 * (currentEvent.touches[1].x - currentEvent.touches[0].x),
            y: currentEvent.touches[0].y + .5 * (currentEvent.touches[1].y - currentEvent.touches[0].y)
          })

          const lastFocus = new Point({
            x: pinch.lastTouches.touches[0].x + 0.5 * (pinch.lastTouches.touches[1].x - pinch.lastTouches.touches[0].x),
            y: pinch.lastTouches.touches[0].y + 0.5 * (pinch.lastTouches.touches[1].y - pinch.lastTouches.touches[0].y)
          })

          const pinchEventData = {
            focus: currentFocus,
            scale: distanceBetweenTwoFingers > pinch.lastDistance ? scale : -scale,
            focusAfterScale: new Point({ x: -lastFocus.x, y: -lastFocus.y })
          }

          // console.dir(pinchEventData)

          // tell subscribers
          action('pinch', pinchEventData)

          // tell event listeners
          const pinchEvent = new CustomEvent('pinch', { detail: pinchEventData })
          if (!pinch.el.dispatchEvent(pinchEvent)) {
            endHandler()
            console.log('Pinch::action - event was cancelled')
          }
        }
      }

      function endHandler () {
        pinch.el.removeEventListener(startEvent.type.move, moveHandler)
        pinch.el.removeEventListener(startEvent.type.end, endHandler)
        pinch.detecting = false
        pinch.listen(action)
      }

    }
  }
}

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

function diff (event1, event2) {
  // https://stackoverflow.com/questions/2264072/detect-a-finger-pinch-through-javascript-on-the-iphone-and-android
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

export default Pinch
