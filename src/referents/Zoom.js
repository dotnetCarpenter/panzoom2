import pinch from '../gestures/pinch2'
import wheel from '../gestures/wheel2'

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
    this.$el.on('wheelEventData', this.transform, error => {
      console.error(error)
    })
    console.log('zoom::listen')
  },
  unlisten () {},

  destroy () {
    this.$gestures.pinch.destroy()
    this.$gestures.wheel.destroy()
  },

  methods: {

    transform (event) {
      console.log('transform')
      event.preventDefault()

      const wheelEventData = {
        point: event.point,
        scale: this.options.zoomFactor * -event.deltaY
      }
      console.log(wheelEventData)
    },

    zoom (point, multiplier) {
      console.log('zoom', this)
    }
  }

}
