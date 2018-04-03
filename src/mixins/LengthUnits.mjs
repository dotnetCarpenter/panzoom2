function percentToPixelMatrix () {
  const box = this.el.getBoundingClientRect()
  return {
    tx: box.width * (this.tx * .01),
    ty: box.height * (this.ty * .01),
    tz: this.tz
  }
}

function percentToPixel (percentage, side = 'width') {
  const box = this.el.getBoundingClientRect()
  return box[side] * percentage * .01
}

function getUnit (value) {
  return String(value).indexOf('%') > -1 ? '%' : 'px'
}

export {
  percentToPixel,
  percentToPixelMatrix,
  getUnit
}
