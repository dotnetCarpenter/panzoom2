class Swipe {
  constructor (options) {
    this.el = null
  }

  listen (action) {
    console.log('Swipe::listen')
    if (!(action instanceof Function)) throw new TypeError('action most be a function')

    this.action = event => {
      // tell subscribers
      action('swipe', event)
      // tell event listeners
      const swipeEvent = new CustomEvent('swipe', event)
      if (!this.el.dispatchEvent(swipeEvent)) {
        console.log('Swipe::action - event was cancelled')
      }
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