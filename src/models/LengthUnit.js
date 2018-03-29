
class LengthUnit {
  constructor (name) {
    this.name = name
  }
}

class PixelUnit extends LengthUnit {
  constructor () {
    super('px')
  }

  valueOf () {
    return this.name
  }
}

export {
  LengthUnit,
  PixelUnit
}
