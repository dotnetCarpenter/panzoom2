class Point {
  constructor ({x = 0, y = 0}) {
    this.x = parseFloat(x)
    this.y = parseFloat(y)
  }

  /**
   * Substract point from this point
   * @param {Point} point
   * @returns {Point}
   */
  delta (point) {
    return new Point({
      x: this.x - point.x,
      y: this.y - point.y
    })
  }

  /**
   * Calculate the distance bewteen 2 points
   * @param {Point} point
   * @returns {number}
   */
  distance (point) {
    const delta = this.delta(point)
    return Math.sqrt(
      delta.x ** 2,
      delta.y ** 2
    )
  }
}

export default Point
