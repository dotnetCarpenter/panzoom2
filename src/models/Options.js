
class Options {
  constructor ({min = .5, max = 20}) {
    this.min = parseFloat(min)
    this.max = parseFloat(max)
  }
}

export default Options
