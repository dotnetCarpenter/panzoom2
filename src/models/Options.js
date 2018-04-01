import Swipe from '../gestures/Swipe'
import Pinch from '../gestures/Pinch'
import Pan from '../gestures/Pan'
import Wheel from '../gestures/Wheel'

class Options {
  constructor ({gestures, min = .5, max = 20}) {
    this.min = parseFloat(min)
    this.max = parseFloat(max)

    if (gestures && !Array.isArray(gestures)) throw new TypeError('gestures most be an array')

    this.configurations = gestures
      ? new Map(gestures)
      : new Map([
        ['swipe', {}],
        ['pinch', { threshold: .2 }],
        ['pan', {}],
        ['wheel', { zoomFactor: 0.03 }],
      ])

    this.factories = new Map([
      ['swipe', opt => new Swipe(opt || this.configurations.get('swipe'))],
      ['pinch', opt => new Pinch(opt || this.configurations.get('pinch'))],
      ['pan', opt => new Pan(opt || this.configurations.get('pan'))],
      ['wheel', opt => new Wheel(opt || this.configurations.get('wheel'))],
    ])
  }

  getFactory (name) {
    return this.factories.get(name)
  }
}

export default Options
