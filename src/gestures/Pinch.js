import { mat2d } from 'gl-matrix'
import Point from '../models/Point'

let minDistance = ''
let firstTouch
// let lastDistance = 0
let eventNames = { move: null, end: null }
let pinchStart = true
// let fpsLastTime = 0

export default {
  // custom properties with default values - use {required: true} if you don't want to set a default value
  options: {
    pinchThreshold: .2,
    preventDefault: true
  },

  // life cycle handlers
  listen () {
    this.on(this.options.preventDefault ? 'touchstart' : 'touchstart.passive', this.startHandler, { reject: errorHandler })
  //   console.log('Pinch::listen')
  },

  unlisten () {
    this.off(this.options.preventDefault ? 'touchstart' : 'touchstart.passive', this.startHandler, { reject: errorHandler })
    // console.log('Pinch::unlisten')
  },

  // custom methods
  startHandler (event) {
    // console.log('Pinch::startHandler')
    if (event.touches.length < 2) {
      console.log('aborting because only one finger is detected')
      return
    }

    // KLUDGE: in Chrome we have to preventDefault already in touchStart since touchMove can be too late if Chrome also initiates scroll
    if (this.options.preventDefault) event.preventDefault()

    this.unlisten()

    eventNames = event.getEventTypeNames()
    firstTouch = event

    this.on(this.options.preventDefault ? eventNames.move : eventNames.move + '.passive', this.moveHandler, { reject: errorHandler })
    this.on(eventNames.end, this.endHandler)
  },

  moveHandler (event) {
    // const now = Date.now()
    // const fps = 1000 / (now - fpsLastTime)
    // fpsLastTime = now
    // console.log('fps', fps)

    // console.log('Pinch::moveHandler')
    if (this.options.preventDefault) event.preventDefault()

    // movement (translate)
    const distanceFromFirstTouch = event.touches[0].distance(firstTouch.touches[0])

    // distance between two first fingers
    const distanceBetweenTwoFingers = event.touches[0].distance(firstTouch.touches[1])
    // const distanceBetweenTwoFingers = event.touches[1].distance(lastTouches.touches[1])
    // const distanceBetweenTwoFingers = event.touches[0].distance(event.touches[1])

    // const pinchOutwards = lastDistance && distanceBetweenTwoFingers > lastDistance ? true : false
    // console.log(pinchOutwards ? 'zoom in' : 'zoom out')

    // lastDistance = distanceBetweenTwoFingers

    // const scale = distanceFromFirstTouch / distanceBetweenTwoFingers
    const scale = event.touches[0].distance(event.touches[1]) - firstTouch.touches[0].distance(firstTouch.touches[1])
    // console.log('scale', scale)

    if (scale > this.options.pinchThreshold) {
      // The 2 focus formulars ported from svg.panzoom.js - ask fuzzyma why it's like that - fuzzyma found the algorithm on SO
      const currentFocus = new Point({
        x: event.touches[0].x + 0.5 * (event.touches[1].x - event.touches[0].x),
        y: event.touches[0].y + 0.5 * (event.touches[1].y - event.touches[0].y)
      })

      // const lastFocus = new Point({
      //   x: lastTouches.touches[0].x + 0.5 * (lastTouches.touches[1].x - lastTouches.touches[0].x),
      //   y: lastTouches.touches[0].y + 0.5 * (lastTouches.touches[1].y - lastTouches.touches[0].y)
      // })

      // console.log(scale)
      event.point = currentFocus
      event.scale = scale // pinchOutwards ? scale : -scale
      // event.focusAfterScale = new Point({ x: -lastFocus.x, y: -lastFocus.y })
      // event.lastTouches = lastTouches

      if (pinchStart) {
        pinchStart = false
        this.fire('pinchstart', event)
      } else {
        this.fire('pinch', event)
      }

      // FIXME: scale should be calculated from distance from each finger continuesly instead of first touch
      // lastTouches = event
    }
  },
  endHandler () {
    this.off(this.options.preventDefault ? eventNames.move : eventNames.move + '.passive', this.moveHandler)
    this.off(eventNames.end, this.endHandler)
    pinchStart = true
    this.fire('pinchend')
    this.listen()
  }

}

function errorHandler (error) {
  console.error('Error happen in a Pinch gesture listener ::', error)
}

function addScale (gestureEvent) {

}
