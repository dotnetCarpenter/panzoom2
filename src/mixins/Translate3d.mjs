import * as units from './LengthUnits'

/**
 * tz Is a <length> representing the z component of the translating vector. It can't be a <percentage> value; in that case the property containing the transform is considered invalid.
 */
class Translate3d {
  constructor (tx, ty, tz) {
    Object.assign(this, units)

    this.tx = parseFloat(tx || 0)
    this.ty = parseFloat(ty || 0)
    this.tz = parseFloat(tz || 0)

    this.unit = this.getUnit(tx)
    this.el = null
  }

  setUnit (unit) {
    this.unit = this.getUnit(unit)
  }

  setElement (el) {
    this.el = el
  }

  toString () {
    switch (this.unit) {
      case '%':
        if (!this.el) throw new Error('Translate3d.el must be set')

        const matrix = this.toObject()

        return `translate3d(${matrix.tx}px, ${matrix.ty}px, ${matrix.tz}px);`
      case 'px':
        return `translate3d(${this.tx}px, ${this.ty}px, ${this.tz}px);`
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
      ? this.percentToPixelMatrix(/* this.el, matrix */)
      : matrix
  }
}

export default Translate3d
