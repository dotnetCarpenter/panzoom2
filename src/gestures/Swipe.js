import Point from '../models/Point'
import { percentToPixel, getUnit } from '../mixins/LengthUnits'

let minDistance = '100px'
let lastTouches = null
let eventNames = null

export default Object.assign({
  // required option(s)
  options: {
    distance: {
      required: true
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

    this.on('mousedown', this.startHandler)
    this.on('touchstart', this.startHandler)
    console.log('swipe::listen')
  },
  unlisten () {
    this.off('mousedown', this.startHandler)
    this.off('touchstart', this.startHandler)
    console.log('swipe::unlisten')
  },

  // custom methods
  startHandler (event) {
    this.unlisten()

    // TODO: take timestamp into consideration - call endHandler if enough time has passed
    lastTouches = event

    eventNames = getEventTypeNames(event)

    this.on(eventNames.move, this.moveHandler)
    this.on(eventNames.end, this.endHandler)
  },

  moveHandler (event) {
    const distance = Math.sqrt(
      (event.touches[0].x - lastTouches.touches[0].x) ** 2
      +
      (event.touches[0].y - lastTouches.touches[0].y) ** 2
    )
    console.log(distance)

    if (distance > minDistance) { // TODO: consider zoom in distance?
      event.direction = getDirection(lastTouches, event)

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

function getEventTypeNames (event) {
  return event.type === 'touchstart'
  ? { move: 'touchmove', end: 'touchend' }
  : { move: 'mousemove', end: 'mouseup' }
}

// TODO: might also be useful in Pan.js
function getDirection (event1, event2) {
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
