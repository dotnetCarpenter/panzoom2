import Point from '../models/Point'

export default {
  // required custom properties from option object
  props: {},

  // life cycle handlers
  listen () {
    this.$el.on('touchstart', this.moveHandler)
  },
  unlisten () {},
  destroy () {},

  // private methods
  moveHandler () {},
  endHandler () {},

  // public methods
  methods: {
    zoom (point, multiplier) {}
  }

}
