function percentToPixel (percentage, side = 'width') {
  const box = this.el.getBoundingClientRect()
  return box[side] * percentage * .01
}

function percentToPixelMatrix () {
  const box = this.el.getBoundingClientRect()
  return {
    tx: box.width * (this.tx * .01),
    ty: box.height * (this.ty * .01),
    tz: this.tz
  }
}

function remToPixel (rem) {
  const fontSize = window.getComputedStyle(documentElement).fontSize
  return rem * fontSize
}

function emToPixel (em) {
  const fontSize = window.getComputedStyle(this.el).fontSize
  return em * fontSize
}

function cmToPixel (cm) {
  return cm * 96/2.54
}

function mmToPixel (mm) {
  return cmToPixel(mm) / 10
}

function getUnit (value) {
  return String(value).indexOf('%') > -1 ? '%' : 'px'
}

export {
  percentToPixel,
  percentToPixelMatrix,
  remToPixel,
  emToPixel,
  cmToPixel,
  mmToPixel,
  getUnit
}
