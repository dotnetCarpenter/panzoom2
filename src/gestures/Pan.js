import Point from '../models/Point'

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

    eventNames = event.getEventTypeNames()

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

    event.direction = event.getDirection(lastTouches)

    this.fire('pan', event)
  },

  endHandler () {
    this.off(eventNames.move, this.moveHandler)
    this.off(eventNames.end, this.endHandler)
    this.listen()
  }
}
