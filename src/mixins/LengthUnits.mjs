function percentToPixel (container, matrix) {
  const box = container.getBoundingClientRect()
  return {
    tx: box.width * (this.tx * .01),
    ty: box.height * (this.ty * .01),
    tz: this.tz
  }
}

export {
  percentToPixel
}
