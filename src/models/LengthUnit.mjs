
class LengthUnit {
  constructor (value, name) {
    this.value = value
    this.name = name
  }
}

class PixelUnit extends LengthUnit {
  constructor (value) {
    super(parseFloat(value || 0), 'px')
  }

  toString () {
    return this.name
  }
}

class PercentageUnit extends LengthUnit {
  constructor () {
    super(0, '%')
  }

  toString () {
    return this.name
  }
}

export {
  LengthUnit,
  PixelUnit
}
