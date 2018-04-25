import Point from '../models/Point'
import { getEventTypeNames } from '../utils'

let lastTouches = null
let eventNames = null

export default {
  // life cycle handlers
  listen () {
    this.on('mousedown', this.startHandler)
    this.on('touchstart', this.startHandler)
    console.log('Pan::listen')
  },
  unlisten () {
    this.off('mousedown', this.startHandler)
    this.off('touchstart', this.startHandler)
    console.log('Pan::unlisten')
  },

  // custom methods
  startHandler (event) {
    this.unlisten()

    // TODO: take timestamp into consideration - call endHandler if enough time has passed
    lastTouches = event

    eventNames = getEventTypeNames(event)

    this.on(eventNames.move, this.moveHandler, error => {
      console.error(error)
      this.unlisten()
    })
    this.on(eventNames.end, this.endHandler)
  },

  moveHandler (event) {
    // TODO: take timestamp into consideration - call endHandler if enough time has passed

    const delta = new Point({ // TODO: abstract this somewhere
      x: event.touches[0].x - lastTouches.touches[0].x,
      y: event.touches[0].y - lastTouches.touches[0].y
    })
    // console.log(delta)

    event.direction = getDirection(lastTouches, event)

    this.fire('pan', event)
  },

  endHandler () {
    this.off(eventNames.move, this.moveHandler)
    this.off(eventNames.end, this.endHandler)
    this.listen()
  }
}

// TODO: Move to own model
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
