import { Translate3d } from '../dist/panzoom2'

describe('Translate3d', () => {
  it('Translate3d returns a CSS string', t => {
    const translate3d = new Translate3d

    const expected = 'translate3d(0px, 0px, 0px);'
    const actual = String(translate3d)
    t.equal(actual, expected)
  })
})
