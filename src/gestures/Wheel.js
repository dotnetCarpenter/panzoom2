import Point from '../models/Point'

export default {
  options: {
    preventDefault: false
  },

  // life cycle handlers
  listen () {
    this.on('wheel', this.moveHandler, { passive: !this.options.preventDefault })
    console.log('Wheel::listen')
  },
  unlisten () {
    console.log('Wheel::unlisten')
    this.off('wheel', this.moveHandler)
  },

  moveHandler (event) {
    if (this.options.preventDefault) event.preventDefault()

    // touchpads can give event.deltaY == 0, which is something we never want to handle
    if (event.deltaY === 0) return

    event.point = event.touches[0]
    this.fire('wheelEvent', event)
  }

}
