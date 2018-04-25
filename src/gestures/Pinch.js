import Point from '../models/Point'
import { getEventTypeNames } from '../utils'

let minDistance = ''
let lastTouches = null
let lastDistance = null
let eventNames = null

export default {
  // required custom properties from option object
  options: {
    pinchThreshold: .2,
    preventDefault: true
  },

  // life cycle handlers
  listen () {
    this.on('touchstart', this.startHandler)
    console.log('Pinch::listen')
  },
  unlisten () {
    this.off('touchstart', this.startHandler)
    console.log('Pinch::unlisten')
  },

  // custom methods
  startHandler (event) {
    console.log('Pinch::moveHandler', event, this)

    this.unlisten()

    if (event.touches.length < 2) {
      this.endHandler()
      return
    }

    lastTouches = event
    eventNames = getEventTypeNames(event)

    this.on(eventNames.move, this.moveHandler)
    this.on(eventNames.end, this.endHandler)
  },

  moveHandler (event) {
    if (this.options.preventDefault) event.preventDefault()

    // TODO: take timestamp into consideration - call endHandler if enough time has passed

    // movement (translate)
    const distanceFromFirstTouch = Math.sqrt( // TODO: abstract this somewhere
      (event.touches[0].x - lastTouches.touches[0].x) ** 2
      +
      (event.touches[0].y - lastTouches.touches[0].y) ** 2
    )
    // distance between two first fingers
    const distanceBetweenTwoFingers = Math.sqrt( // TODO: abstract this somewhere
      (event.touches[0].x - lastTouches.touches[1].x) ** 2
      +
      (event.touches[0].y - lastTouches.touches[1].y) ** 2
    )

    const pinchOutwards = lastDistance && distanceBetweenTwoFingers > lastDistance ? true : false
    // console.log(pinchOutwards ? 'zoom in' : 'zoom out')

    lastDistance = distanceBetweenTwoFingers

    const scale = distanceFromFirstTouch / distanceBetweenTwoFingers
        // console.log('scale', scale)

    if (scale > pinch.threshold) {
      // Focus formular ported from svg.panzoom.js - ask Ulrich why it's like that
      const currentFocus = new Point({
        x: event.touches[0].x + .5 * (event.touches[1].x - event.touches[0].x),
        y: event.touches[0].y + .5 * (event.touches[1].y - event.touches[0].y)
      })

      const lastFocus = new Point({
        x: pinch.lastTouches.touches[0].x + 0.5 * (pinch.lastTouches.touches[1].x - pinch.lastTouches.touches[0].x),
        y: pinch.lastTouches.touches[0].y + 0.5 * (pinch.lastTouches.touches[1].y - pinch.lastTouches.touches[0].y)
      })

      // console.log(scale)
      event.point = currentFocus
      event.scale = pinchOutwards ? scale : -scale,
      event.focusAfterScale = new Point({ x: -lastFocus.x, y: -lastFocus.y })

      this.fire('pinch', event)
    }
  },
  endHandler () {
    this.off(eventNames.move, this.moveHandler)
    this.off(eventNames.end, this.endHandler)
    this.listen()
  }

}
