import { filter, each } from '../utils'

export default LooseMap

function LooseMap () {
  let map = new Map()
  return {
    set (key, value) {
      if (typeof key === 'object') {
        map.set(filter(match(key), map)[0] || key, value)
      } else {
        map.set(key, value)
      }
    },
    get (key) {
      return map.get(key)
    },
    delete (key) {
      map.delete(key)
    },
    has (key) {
      return map.has(key)
    }
  }
}

function match (searchKey) {
  return (value, key) => {
    debugger
  }
}
