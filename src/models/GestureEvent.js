import Point from './Point'
import { map } from '../utils'

class GestureEvent {
  constructor (nativeEvent) {
    const event = GestureEvent.normalizeEvent(nativeEvent)
    this.touches = event.touches
    this.page = event.page
    this.type = event.type
    this.deltaY = event.deltaY
    this.target = event.target
    this.preventDefault = event.preventDefault
  }

  getDirection (event) {
    // debugger
    // https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
    const delta = this.touches[0].delta(event.touches[0])

    // TODO: return an enum instead
    // console.log(delta.x, delta.y)
    if (Math.abs(delta.x) > Math.abs(delta.y)) {
      if (delta.x > 0) return 'right'
      else return 'left'
    } else {
      if (delta.y > 0) return 'down'
      else return 'up'
    }
  }

  /**
  * Detect mouse or touch move and end event names.
  * getEventTypeNames will return an
  * object, where move is touchmove/mousemove and
  * end is touchend/mouseup.
  * @returns {object} { move: String, end: String }
  */
  getEventTypeNames () {
    return this.type === 'touchstart'
    ? { move: 'touchmove', end: 'touchend' }
    : { move: 'mousemove', end: 'mouseup' }
  }

  static normalizeEvent (nativeEvent) {
    const event = {
      touches: nativeEvent.touches
        ? map(t => new Point({ x: t.clientX, y: t.clientY }), nativeEvent.touches)
        : [new Point({ x: nativeEvent.clientX, y: nativeEvent.clientY })]
      ,
      page: nativeEvent.touches
        ? map(t => new Point({ x: t.pageX, y: t.pageY }), nativeEvent.touches)
        : [new Point({ x: nativeEvent.pageX, y: nativeEvent.pageY })],
      type: nativeEvent.type,
      deltaY: nativeEvent.deltaY,
      target: nativeEvent.target,
      preventDefault () {
        nativeEvent.preventDefault()
      },
      stopPropagation () {
        nativeEvent.stopPropagation()
      }
    }

    return event
  }

  static addEvent (el, type, listener, options) {
    el.addEventListener(type, listener, options || true)
  }

  static removeEvent (el, type, listener) {
    el.removeEventListener(type, listener, true)
  }

}

export default GestureEvent
