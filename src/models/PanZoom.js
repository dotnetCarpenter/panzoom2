
class PanZoom {
  constructor (options) {
    this.el = null
  }

  listen () {
    console.log('listen')
  }

  unlisten () {
    console.log('unlisten')
  }

  setElement (el) {
    this.el = el
  }
}

export default PanZoom