import Point from '../models/Point'

class Wheel {
  constructor (options) {
    this.el = null
    this.lastTouches = null
    this.detecting = false
    this.zoomFactor = options.zoomFactor
  }

  listen (action) {
    // console.log('Wheel::listen')
    if (!(action instanceof Function)) throw new TypeError('action must be a function')

    this.action = Wheel.action(this, action)

    this.el.addEventListener('wheel', this.action, true)
  }

  unlisten () {
    // console.log('Wheel::unlisten')
    this.el.removeEventListener('wheel', this.action, true)
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

  static action (wheel, action) {
    return event => {
      // event.preventDefault()
      // event.stopImmediatePropagation()
      // event.stopPropagation()
      // event.returnValue = false

      // touchpads can give event.deltaY == 0, which is something we never want to handle
      if (event.deltaY === 0) return

      wheel.unlisten()
      wheel.detecting = true

      const wheelEventData = {
        point: normalizeEvent(event).touches[0],
        scale: wheel.zoomFactor * -event.deltaY
      }
      // console.log(wheelEventData)

      action('wheelDelta', wheelEventData)

      // tell event listeners
      const wheelEvent = new CustomEvent('wheelDelta', { detail: wheelEventData })
      if (!wheel.el.dispatchEvent(wheelEvent)) {
        endHandler()
        console.log('Wheel::action - event was cancelled')
      }

      endHandler()

      function endHandler () {
        wheel.detecting = false
        wheel.listen(action)
      }

    }
  }
}

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

export default Wheel
