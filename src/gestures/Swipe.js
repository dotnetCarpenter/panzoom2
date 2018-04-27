import Point from '../models/Point'
import { percentToPixel, getUnit } from '../mixins/LengthUnits'
import GestureEvent from '../models/GestureEvent';

let minDistance = ''
let lastTouches = null
let eventNames = null

export default Object.assign({
  // required option(s)
  options: {
    distance: {
      required: true
    },
    preventDefault: false
  },

  // life cycle handlers
  listen () {
    if (getUnit(this.options.distance) === '%') {
      minDistance = Math.min(
        this.percentToPixel(parseFloat(this.options.distance), 'width'),
        this.percentToPixel(parseFloat(this.options.distance), 'height')
      )
    }

    this.on('mousedown', this.startHandler)
    this.on('touchstart', this.startHandler, { reject: errorHandler, passive: true })
    console.log('Swipe::listen')
  },
  unlisten () {
    this.off('mousedown', this.startHandler)
    this.off('touchstart', this.startHandler)
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

    this.on(eventNames.move, this.moveHandler)
    this.on(eventNames.end, this.endHandler)
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
    this.off(eventNames.move, this.moveHandler)
    this.off(eventNames.end, this.endHandler)
    this.listen()
  },

  percentToPixel

})

function errorHandler (error) {
  console.error(error, 'error happen in listener')
}
