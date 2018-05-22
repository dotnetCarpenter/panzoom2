import Pinch from '../gestures/Pinch'
import Wheel from '../gestures/Wheel'
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
  gestures: {
    Pinch,
    Wheel
  },

  // default options
  options: {
    zoomFactor: 0.03,
    domEvents: false,
    preventDefault: true
  },

  // life cycle handlers
  listen () {
    console.log('zoom::listen')

    translate3d = Translate3d.parse(this.el.style.transform)
    if (!translate3d) translate3d = new Translate3d()

    translate3d.setElement(this.el) // enable percentage stuff

    this.el.style.transformOrigin = 'top left'

    this.on('wheelEvent', this.eventHandler, error => {
      console.error(error)
    })
  },
  unlisten () {
    console.log('zoom::unlisten')

    this.off('wheelEvent', this.eventHandler)
  },

  destroy () {
    translate3d = null
  },

  eventHandler (event) {
    if (this.options.domEvents) {
      const zoomEvent = new CustomEvent('zoom', {
        detail: event,
        bubbles: true,
        cancelable: true,
      })

      if (!this.el.dispatchEvent(zoomEvent)) {
        console.log('Zoom::eventHandler - event was cancelled')
        return
      }
    }

    if (this.options.preventDefault) event.preventDefault()
    // TODO: add async zoom operation here?
    this.zoom(event.point, getScaleMultiplier(event.deltaY, this.options.zoomFactor))
  },

  zoom (point, multiplier) {
    translate3d.tx = point.x - multiplier * (point.x - translate3d.tx)
    translate3d.ty = point.y - multiplier * (point.y - translate3d.ty)
    translate3d.tz *= multiplier
    this.el.style.transform = Translate3d.getMatrixString(translate3d)
  }
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
