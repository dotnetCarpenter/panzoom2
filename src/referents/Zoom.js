import Pinch from '../gestures/Pinch'
import Wheel from '../gestures/Wheel'

export default {
  gestures: {
    Pinch,
    Wheel
  },

  // required custom properties from option object
  props: {},

  // life cycle handlers
  setup () {
    this.$el.on('pinch')
  },
  moveHandler () {},
  endHandler () {},
  unlisten () {},
  destroy () {},

  // public methods to expose
  methods: {
    zoom (point, multiplier) {}
  }

}
