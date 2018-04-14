import Point from '../models/Point'

export default {
  // required custom properties from option object
  props: {},

  // life cycle handlers
  listen () {
    // const moveHandler = this.moveHandler.bind(this)
    const moveHandler = this.moveHandler
    this.$el.on('wheel', moveHandler)
    this.$el.on('wheel', this.methods.zoom)
    console.log('wheel2::listen')
  },
  unlisten () {},
  destroy () {},

  // private methods
  moveHandler (event) {
    console.log('wheel2::moveHandler', event, this)
  },
  endHandler () {},

  // public methods
  methods: {
    zoom (point, multiplier) {
      console.log('zoom', this)
    }
  }

}
