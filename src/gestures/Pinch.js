import Point from '../models/Point'

let minDistance = ''
let lastTouches = null
let lastDistance = null
let eventNames = null
let pinchStart = true

export default {
  // custom properties with default values - use {required: true} if you don't want to set a default value
  options: {
    pinchThreshold: .2,
    preventDefault: true
  },

  // life cycle handlers
  listen () {
    this.on(this.options.preventDefault ? 'touchstart' : 'touchstart.passive', this.startHandler, { reject: errorHandler })

    console.log('Pinch::listen')
  },
  unlisten () {
    this.off(this.options.preventDefault ? 'touchstart' : 'touchstart.passive', this.startHandler, { reject: errorHandler })
    console.log('Pinch::unlisten')
  },

  // custom methods
  startHandler (event) {
    // console.log('Pinch::startHandler')
    // KLUDGE: in Chrome we have to preventDefault already in touchStart since touchMove can be too late if the Chrome also initiates scrolling
    if (this.options.preventDefault) event.preventDefault()

    this.unlisten()

    eventNames = event.getEventTypeNames()

    if (event.touches.length < 2) {
      this.endHandler()
      console.log('aborting because only one finger is detected')
      return
    }

    lastTouches = event

    this.on(this.options.preventDefault ? eventNames.move : eventNames.move + '.passive', this.moveHandler, { reject: errorHandler })
    this.on(eventNames.end, this.endHandler)
  },

  moveHandler (event) {
    // console.log('Pinch::moveHandler')
    if (this.options.preventDefault) event.preventDefault()
    // TODO: take timestamp into consideration - call endHandler if enough time has passed

    // movement (translate)
    const distanceFromFirstTouch = event.touches[0].distance(lastTouches.touches[0])

    // distance between two first fingers
    const distanceBetweenTwoFingers = event.touches[0].distance(lastTouches.touches[1])
    // const distanceBetweenTwoFingers = event.touches[0].distance(event.touches[1])

    const pinchOutwards = lastDistance && distanceBetweenTwoFingers > lastDistance ? true : false
    // console.log(pinchOutwards ? 'zoom in' : 'zoom out')

    lastDistance = distanceBetweenTwoFingers

    const scale = distanceFromFirstTouch / distanceBetweenTwoFingers
        // console.log('scale', scale)

    if (scale > this.options.pinchThreshold) {
      // Focus formular ported from svg.panzoom.js - ask fuzzyma why it's like that - fuzzyma found the algorithm on SO
      const currentFocus = new Point({
        x: event.touches[0].x + .5 * (event.touches[1].x - event.touches[0].x),
        y: event.touches[0].y + .5 * (event.touches[1].y - event.touches[0].y)
      })

      const lastFocus = new Point({
        x: lastTouches.touches[0].x + 0.5 * (lastTouches.touches[1].x - lastTouches.touches[0].x),
        y: lastTouches.touches[0].y + 0.5 * (lastTouches.touches[1].y - lastTouches.touches[0].y)
      })

      console.log(scale)
      event.point = currentFocus
      event.scale = pinchOutwards ? scale : -scale,
      event.focusAfterScale = new Point({ x: -lastFocus.x, y: -lastFocus.y })

      if (pinchStart) {
        pinchStart = false
        this.fire('pinchstart', event)
      } else {
        this.fire('pinch', event)
      }
    }
  },
  endHandler () {
    this.off(this.options.preventDefault ? eventNames.move : eventNames.move + '.passive', this.moveHandler)
    this.off(eventNames.end, this.endHandler)
    pinchStart = true
    this.listen()
  }

}

function errorHandler (error) {
  console.error(error, 'error happen in listener')
}
