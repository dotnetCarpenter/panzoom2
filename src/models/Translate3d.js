import { PixelUnit } from './LengthUnit'

class Translate3d {
  constructor ({tx = 0, ty = 0, tz = 0}) {
    this.tx = parseFloat(tx)
    this.ty = parseFloat(ty)
    this.tz = parseFloat(tz)

    this.unit = new PixelUnit()
  }

  setUnit (unit) {
    this.unit = unit
  }

  valueOf () {
    return `translate3d(${this.tx + this.unit}, ${this.ty + this.unit}px, ${this.tz + this.unit}px);`
  }
}

export default Translate3d
