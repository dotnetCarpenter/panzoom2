class Swipe {
  constructor (options) {
    this.el = null
  }

  listen () {
    console.log('Swipe::listen')
  }

  unlisten () {
    console.log('Swipe::unlisten')
  }

  setElement (el) {
    this.el = el
  }
}

export default Swipe