import Point from './Point'

class Swipe {
  constructor (options) {
    this.el = null
    this.lastTouches = null
  }

  listen (action) {
    console.log('Swipe::listen')
    if (!(action instanceof Function)) throw new TypeError('action must be a function')

    this.action = Swipe.action(this, action)

    this.el.addEventListener('mousedown', this.action)
    this.el.addEventListener('touchmove', this.action) // TODO: seems that touchmove has to be followed the entire time, so different logic for mouse and touch
  }

  unlisten () {
    console.log('Swipe::unlisten')
    this.el.removeEventListener('mousedown', this.action)
    this.el.removeEventListener('touchmove', this.action)
  }

  setElement (el) {
    this.el = el
  }

  destroy () {
    this.el = null
    this.action = null
    this.lastTouches = null
  }

  static action (swipe, action) {
    return event => {
      event.preventDefault()

      swipe.unlisten()

      const startEvent = normalizeEvent(event)
      swipe.lastTouches = startEvent

      swipe.el.addEventListener(startEvent.type.move, moveHandler)

      swipe.el.addEventListener(startEvent.type.end, endHandler)

      function moveHandler (event) {
        const currentEvent = normalizeEvent(event)
        // console.log('getting moves!', currentEvent)

        // TODO: take timestamp into consideration - call endHandler if enough time has passed

        const distance = Math.sqrt( // TODO: abstract this somewhere
          Math.pow(currentEvent.touches[0].x - swipe.lastTouches.touches[0].x , 2) +
          Math.pow(currentEvent.touches[0].y - swipe.lastTouches.touches[0].y , 2)
        )

        // console.log(distance)

        if (distance > 100) { // TODO: make 100 a relative value and consider zoom
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
          endHandler()
        }
      }

      function endHandler () {
        swipe.el.removeEventListener(startEvent.type.move, moveHandler)
        swipe.el.removeEventListener(startEvent.type.end, endHandler)
        swipe.listen(action)
      }

    }
  }
}

function normalizeEvent(ev) {
  const event = {}

  event.touches = [new Point({ x: ev.pageX, y: ev.pageY })]
  event.type = event.type === 'touchstart' // TODO: use a proper enum
    ? { move: 'touchmove', end: 'touchend' }
    : { move: 'mousemove', end: 'mouseup' }
  event.timeStamp = Date.now()

  return event
}

function diff (event1, event2) {
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
