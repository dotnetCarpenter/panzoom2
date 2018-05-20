import Point from '../models/Point'
import { percentToPixel, getUnit } from '../mixins/LengthUnits'
import GestureEvent from '../models/GestureEvent';

let minDistance = ''
let lastTouches = null
let eventNames = null
let isPassive = false

function getEventName(eventName) {
  return isPassive ? eventName + '.passive' : eventName
}

export default Object.assign({percentToPixel}, {
  // required option(s)
  options: {
    distance: {
      required: true
    },
    get preventDefault () {
      return !isPassive
    },
    set preventDefault (bool) {
      isPassive = !bool
    }
  },

  // life cycle handlers
  listen () {
    if (getUnit(this.options.distance) === '%') {
      minDistance = Math.min(
        this.percentToPixel(parseFloat(this.options.distance), 'width'),
        this.percentToPixel(parseFloat(this.options.distance), 'height')
      )
    }

    this.on('mousedown', this.startHandler, { reject: errorHandler })
    this.on('touchstart.passive', this.startHandler, { reject: errorHandler })
    console.log('Swipe::listen')
  },
  unlisten () {
    this.off('mousedown', this.startHandler)
    this.off('touchstart.passive', this.startHandler)
    console.log('Swipe::unlisten')
  },

  // custom methods
  /**
   *
   * @param {GestureEvent} event
   */
  startHandler (event) {
    this.unlisten()

    // TODO: take timestamp into consideration - call endHandler if enough time has passed
    lastTouches = event

    eventNames = event.getEventTypeNames()

    this.on(getEventName(eventNames.move), this.moveHandler, { reject: errorHandler })
    this.on(eventNames.end, this.endHandler, { reject: errorHandler })
  },

  /**
   *
   * @param {GestureEvent} event
   */
  moveHandler (event) {
    const distance = event.touches[0].distance(lastTouches.touches[0])
    // console.log(distance)

    if (distance > minDistance) { // TODO: consider zoom in distance?
      event.direction = event.getDirection(lastTouches)

      this.fire('swipe', event)

      this.endHandler()
    }
  },

  endHandler () {
    this.off(getEventName(eventNames.move), this.moveHandler)
    this.off(eventNames.end, this.endHandler)
    this.listen()
  }
})

function errorHandler (error) {
  console.error(error, 'error happen in listener')
}
