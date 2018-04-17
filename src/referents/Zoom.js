import pinch from '../gestures/pinch2'
import wheel from '../gestures/wheel2'
import Translate3d from '../models/Translate3d'

const translate3d = new Translate3d(0, 0, 1)

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

    this.el.style.transformOrigin = '0 0 0;'
    this.on('wheelEventData', this.transform, error => {
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
