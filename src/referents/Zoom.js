import pinch from '../gestures/pinch2'
import wheel from '../gestures/wheel2'
import Translate3d from '../models/Translate3d'

let translate3d = null

export default {
  /**
   * @property gestures
   * Supplied gestures can be an object or array
   * but note that gestures are changed into
   * observable gestures and the gestures property
   * will always be an array after initialization.
   */
  gestures: [
    pinch,
    wheel
  ],

  // default options
  options: {
    zoomFactor: 0.03
  },

  isListening: false,

  // life cycle handlers
  listen () {
    console.log('zoom::listen')

    translate3d = Translate3d.parse(this.el.style.transform)
    translate3d.setElement(this.el) // enable percentage stuff
    // TODO: Figure what to do with transformOrigin
    this.el.style.transformOrigin = '0 0 0;'

    this.on('wheelEvent', this.transform, error => {
      console.error(error)
    })
  },
  unlisten () {
    console.log('zoom::unlisten')

    this.off('wheelEvent', this.transform)
  },

  destroy () {
    translate3d = null
  },

  // methods: {

    transform (event) {
      event.preventDefault()

      this.zoom(event.point, getScaleMultiplier(event.deltaY, this.options.zoomFactor))
    },

    zoom (point, multiplier) {
      translate3d.tx = point.x - multiplier * (point.x - translate3d.tx)
      translate3d.ty = point.y - multiplier * (point.y - translate3d.ty)
      translate3d.tz *= multiplier
      this.el.style.transform = Translate3d.getMatrixString(translate3d)
    }
  // }

}

function getScaleMultiplier(delta, zoomFactor) {
  let scaleMultiplier = 1
  if (delta > 0) {
    // zoom out
    scaleMultiplier = (1 - zoomFactor)
  } else if (delta < 0) {
    // zoom in
    scaleMultiplier = (1 + zoomFactor)
  }

  return scaleMultiplier
}
