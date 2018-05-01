import Point from '../models/Point'

export default {
  options: {
    preventDefault: false
  },

  // life cycle handlers
  listen () {
    this.on(this.options.preventDefault ? 'wheel' : 'wheel.passive', this.moveHandler)
    console.log('Wheel::listen')
  },
  unlisten () {
    console.log('Wheel::unlisten')
    this.off(this.options.preventDefault ? 'wheel' : 'wheel.passive', this.moveHandler)
  },

  moveHandler (event) {
    // touchpads can give event.deltaY == 0, which is something we never want to handle
    if (event.deltaY === 0) return

    event.point = event.touches[0]
    this.fire('wheelEvent', event)
  }

}
