import Point from '../models/Point'

class Pan {
  constructor (options) {
    this.el = null
    this.lastTouches = null
    this.detecting = false
  }

  listen (action) {
    // console.log('Pan::listen')
    if (!(action instanceof Function)) throw new TypeError('action must be a function')

    this.action = Pan.action(this, action)

    this.el.addEventListener('mousedown', this.action)
    this.el.addEventListener('touchstart', this.action)
  }

  unlisten () {
    // console.log('Pan::unlisten')
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

  static action (pan, action) {
    return event => {
      // event.preventDefault()

      pan.unlisten()

      const startEvent = normalizeEvent(event)
      pan.lastTouches = startEvent

      // console.log(startEvent)
      pan.detecting = true

      pan.el.addEventListener(startEvent.type.move, moveHandler)
      pan.el.addEventListener(startEvent.type.end, endHandler) // removing event listeners from DOM via this

      function moveHandler (event) {
        const currentEvent = normalizeEvent(event)
        // console.log('getting moves!', currentEvent)

        // TODO: take timestamp into consideration - call endHandler if enough time has passed

        // TODO: abstract this somewhere
        const delta = new Point({
          x: currentEvent.touches[0].x - pan.lastTouches.touches[0].x,
          y: currentEvent.touches[0].y - pan.lastTouches.touches[0].y
        })
        // console.log(delta)

        // tell subscribers
        action('pan', delta)

        // tell event listeners
        const panEvent = new CustomEvent('pan', { detail: delta })
        if (!pan.el.dispatchEvent(panEvent)) {
          endHandler()
          console.log('Pan::action - event was cancelled')
        }
      }

      function endHandler () {
        pan.el.removeEventListener(startEvent.type.move, moveHandler)
        pan.el.removeEventListener(startEvent.type.end, endHandler)
        pan.detecting = false
        pan.listen(action)
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

export default Pan
