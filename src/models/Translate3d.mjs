import { PixelUnit, PercentageUnit } from './LengthUnit'

class Translate3d {
  constructor (tx, ty, tz) {
    this.tx = parseFloat(tx || 0)
    this.ty = parseFloat(ty || 0)
    this.tz = parseFloat(tz || 0)

    this.unit = new PixelUnit()
  }

  setUnit (unit) {
    this.unit = unit
  }

  toString () {
    switch (this.unit) {
      case (this.unit instanceof PercentageUnit && this.unit):
        return 'yay'
        break
      case (this.unit instanceof PixelUnit && this.unit):
        return `translate3d(${this.tx + this.unit}, ${this.ty + this.unit}, ${this.tz + this.unit});`
        break
      default:
        throw new Error('Not implemented')
    }
  }

  toObject () {
    return {
      tx: this.tx,
      ty: this.ty,
      tz: this.tz
    }
  }
}

export default Translate3d
