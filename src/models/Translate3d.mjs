import * as units from '../mixins/LengthUnits'

/**
 * tz Is a <length> representing the z component of the translating vector. It can't be a <percentage> value; in that case the property containing the transform is considered invalid.
 */
class Translate3d {
  constructor (tx, ty, tz) {
    this.tx = parseFloat(tx || 0)
    this.ty = parseFloat(ty || 0)
    this.tz = parseFloat(tz || 0)

    this.unit = String(tx).indexOf('%') > -1 ? '%' : 'px'
    this.container = null

    Object.assign(this, units)
  }

  setUnit (unit) {
    this.unit = unit
  }

  setContainer (container) {
    this.container = container
  }

  toString () {
    switch (this.unit) {
      case '%':
        if (!this.container) throw new Error('Translate3d.container must be set')

        const matrix = this.toObject()

        return `translate3d(${matrix.tx}px, ${matrix.ty}px, ${matrix.tz}px);`
        break
      case 'px':
        return `translate3d(${this.tx}px, ${this.ty}px, ${this.tz}px);`
        break
      default:
        throw new Error('Not implemented')
    }
  }

  toObject () {
    const matrix = {
      tx: this.tx,
      ty: this.ty,
      tz: this.tz
    }

    return this.unit === '%'
      ? this.percentToPixel(this.container, matrix)
      : matrix
  }
}

export default Translate3d
