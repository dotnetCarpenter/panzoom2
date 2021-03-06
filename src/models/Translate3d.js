import * as units from '../mixins/LengthUnits'

const FLOATING = '(\\-?[\\d\\.e]+)'
const COMMA_SPACE = '\\,?\\s*'
const R_MATRIX = new RegExp(
  '^matrix\\(' +
  FLOATING + COMMA_SPACE +
  FLOATING + COMMA_SPACE +
  FLOATING + COMMA_SPACE +
  FLOATING + COMMA_SPACE +
  FLOATING + COMMA_SPACE +
  FLOATING + '\\)$'
)
class Translate3d {
/**
 * @param {number} tx
 * @param {number} tx
 * @param {number} tz Is a <length> representing the z
 * component of the translating vector. It can't be a
 * <percentage> value; in that case the property
 * containing the transform is considered invalid.
 */
  constructor (tx, ty, tz) {
    Object.assign(this, units)

    this.tx = parseFloat(tx || 0)
    this.ty = parseFloat(ty || 0)
    this.tz = parseFloat(tz || 1)

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
    return Translate3d.getMatrixString(this.toObject())
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

  static getMatrixString (transform) {
    return `matrix(${transform.tz}, 0, 0, ${transform.tz}, ${transform.tx}, ${transform.ty})`
  }

  static parse (cssTransform) {
    const matrix = R_MATRIX.exec(cssTransform)
    return matrix
      ? new Translate3d(matrix[5], matrix[6], matrix[1])
      : null
  }
}

export default Translate3d
