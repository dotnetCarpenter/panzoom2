import Point from '../models/Point'

export default {
  // required custom properties from option object
  props: {},

  // life cycle handlers
  listen () {
    this.$el.on('wheel', this.moveHandler)
    console.log('wheel2::listen')
  },
  unlisten () {},
  destroy () {},

  // private methods
  moveHandler (event) {
    console.log('wheel2::moveHandler', event)
  },
  endHandler () {},

  // public methods
  methods: {
    zoom (point, multiplier) {}
  }

}
