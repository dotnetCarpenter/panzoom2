import { PixelUnit } from './LengthUnit'

class Translate3d {
  constructor ({tx, ty, tz} = {tx: 0, ty: 0, tz: 0}) {
    this.tx = parseFloat(tx)
    this.ty = parseFloat(ty)
    this.tz = parseFloat(tz)

    this.unit = new PixelUnit()
  }

  setUnit (unit) {
    this.unit = unit
  }

  toString () {
    return `translate3d(${this.tx + this.unit}, ${this.ty + this.unit}, ${this.tz + this.unit});`
  }
}

export default Translate3d
