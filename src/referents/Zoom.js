import pinch from '../gestures/pinch2'
import wheel from '../gestures/wheel2'
import Translate3d from '../models/Translate3d'

export default {
  gestures: {
    pinch,
    wheel
  },

  // required custom properties
  options: {
    zoomFactor: 0.03
  },

  // life cycle handlers
  listen () {
    console.log('zoom::listen')

    this.$el.on('wheelEventData', this.transform, error => {
      console.error(error)
    })
  },
  unlisten () {
    console.log('zoom::unlisten')
  },

  destroy () {
    this.$gestures.pinch.destroy()
    this.$gestures.wheel.destroy()
  },

  methods: {

    transform (event) {
      event.preventDefault()

      this.zoom(event.point, this.$options.zoomFactor * -event.deltaY)
    },

    zoom (point, multiplier) {
      this.tx = point.x
      this.ty = point.y
      this.tz = multiplier
      this.el.style.transform = Translate3d.getMatrixString(this)
    }
  }

}
