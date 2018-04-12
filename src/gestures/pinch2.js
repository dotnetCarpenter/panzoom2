import Point from '../models/Point'

export default {
  // required custom properties from option object
  props: {},

  // life cycle handlers
  listen () {
    this.$el.on('touchstart', this.moveHandler)
    console.log('pinch2::listen')
  },
  unlisten () {},
  destroy () {},

  // private methods
  moveHandler (event) {
    console.log('pinch2::moveHandler', event)
  },
  endHandler () {},

  // public methods
  methods: {
    zoom (point, multiplier) {}
  }

}