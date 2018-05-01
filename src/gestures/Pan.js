import Point from '../models/Point'

let lastTouches = null
let eventNames = null

function errorHandler (error) {
  console.error(error)
}

export default {
  options: {
    preventDefault: false
  },

  // life cycle handlers
  listen () {
    this.on('mousedown', this.startHandler, { reject: errorHandler })
    this.on('touchstart.passive', this.startHandler, { reject: errorHandler })
    console.log('Pan::listen')
  },
  unlisten () {
    this.off('mousedown', this.startHandler)
    this.off('touchstart.passive', this.startHandler)
    console.log('Pan::unlisten')
  },

  // custom methods
  startHandler (event) {
    this.unlisten()

    // TODO: take timestamp into consideration - call endHandler if enough time has passed
    lastTouches = event

    eventNames = event.getEventTypeNames()

    this.on(this.options.preventDefault ? eventNames.move : eventNames.move + '.passive', this.moveHandler, error => {
      console.error(error)
      this.unlisten()
    })
    this.on(eventNames.end, this.endHandler, { reject: errorHandler })
  },

  moveHandler (event) {
    // TODO: take timestamp into consideration - call endHandler if enough time has passed

    event.delta = event.touches[0].delta(lastTouches.touches[0])
    event.direction = event.getDirection(lastTouches)
    // console.log(event.delta)

    this.fire('pan', event)
  },

  endHandler () {
    this.off(this.options.preventDefault ? eventNames.move : eventNames.move + '.passive', this.moveHandler)
    this.off(eventNames.end, this.endHandler)
    this.listen()
  }
}
