import pinch from '../gestures/pinch2'
import wheel from '../gestures/wheel2'

export default {
  gestures: {
    pinch,
    wheel
  },

  // required custom properties from option object
  props: {},

  // life cycle handlers
  listen () {
    this.$el.on('pinch', this.transform)
    console.log('zoom::listen')
  },
  unlisten () {},
  destroy () {
    this.$gestures.pinch.destroy()
    this.$gestures.wheel.destroy()
  },

  // private methods
  transform (event) {
    console.log('transform', event)
  },

  // public methods to expose
  methods: {
    zoom (point, multiplier) {}
  }

}
