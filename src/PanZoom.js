import Swipe from './models/Swipe'

class PanZoom {
  constructor (options) {
    this.el = null
    this.swipe = null
  }

  listen () {
    console.log('PanZoom::listen')

    this.swipe = new Swipe()
    this.swipe.setElement(this.el)
    this.swipe.listen(this.fire)
  }

  unlisten () {
    console.log('PanZoom::unlisten')

    this.swipe.unlisten()
    this.swipe = null
  }

  setElement (el) {
    this.el = el
  }
}

export default PanZoom