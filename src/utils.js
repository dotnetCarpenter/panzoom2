/**
 * Returns a new function that is a composition of supplied functions from right to left.
 * @example c = compose(x => x + 1, x => x.val), c({ val: 1 }) -> 2
 * @param {...function} fs
 * @returns {function}
 */
export function compose (...fs) {
  return x => fs.reduceRight((x, a) => a(x), x)
}

/**
 * map
 * @param {function} f
 * @param {array|object} list
 * @returns {array}
 */
export function map (f, list) {
  const m = []
  each((value, key) => {
    m.push(f(value, key))
  }, list)
  return m
}

/**
 *
 * @param {function} f
 * @param {array|object} list
 * @returns {array}
 */
export function each (f, list) {
  for (let key in list) {
    f(list[key], key)
  }
}

/**
 * Detect mouse or touch move and end event names.
 * Given an event getEventTypeNames will return an
 * object, where move is touchmove/mousemove and
 * end is touchend/mouseup.
 * @param {event} event
 * @returns {object} { move: String, end: String }
 */
export function getEventTypeNames (event) {
  return event.type === 'touchstart'
  ? { move: 'touchmove', end: 'touchend' }
  : { move: 'mousemove', end: 'mouseup' }
}
