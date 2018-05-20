/**
 * Returns a new function that is a composition of supplied functions from right to left.
 * @example c = compose(x => x + 1, x => x.val), c({ val: 1 }) -> 2
 * @param {...function} fs
 * @returns {function}
 */
export function compose (...fs) {
  return x => reduceRight((x, a) => a(x), x, fs)
}

export function reduceRight(f, init, list) {
  return reduce(f, init, list.reverse())
}

/**
 * Returns a new function where some of the arguments are pre defined.
 * @param {function} f The function to partially apply arguments to
 * @param {number} [arity] Optionally specify how many arguments the function f will take, before being called. Useful for variadic functions
 * @returns {function}
 */
export function partial (f, context) {
  let arity = f.length

  return function partial (...xs) {
    if (arity < xs.length) throw new TypeError((f.name || 'anonymous') + ' does not accept ' + xs.length + ' arguments')
    return arity === xs.length ? f.apply(context, xs) : partial.bind(context, ...xs)
  }
}

export function reduce (f, init, list) {
  let result = init
  each((value, key) => {
    result = f(result, value, key)
  }, list)
  return result
}

export function filter (f, list) {
  const seq = []
  each((value, key) => {
    if (f(value, key)) seq.push(value)
  }, list)
  return seq
}

/**
 * map
 * @param {function} f
 * @param {array|object} list
 * @returns {array}
 */
export function map (f, list) {
  const seq = []
  each((value, key) => {
    seq.push(f(value, key))
  }, list)
  return seq
}

/**
 *
 * @param {function} f
 * @param {array|object} list
 * @returns {array}
 */
export function each (f, list) {
  for (let key in list) {
    if (!list.hasOwnProperty(key)) continue
    f(list[key], key)
  }
}
