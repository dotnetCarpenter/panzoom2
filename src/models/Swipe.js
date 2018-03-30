class Swipe {
  constructor (options) {
    this.el = null
  }

  listen (action) {
    console.log('Swipe::listen')

    this.action = event => {
      action('swipe', event)
    }

    this.el.addEventListener('click', this.action)
  }

  unlisten () {
    console.log('Swipe::unlisten')
    this.el.removeEventListener('click', this.action)
  }

  setElement (el) {
    this.el = el
  }

}
export default Swipe