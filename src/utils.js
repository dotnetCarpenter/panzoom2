/**
 * Returns a new function that is a composition of supplied functions from right to left.
 * @example c = compose(x => x + 1, x => x.val), c({ val: 1 }) -> 2
 * @param {...function} fs
 * @returns {function}
 */
export function compose (...fs) {
  return x => fs.reduceRight((x, a) => a(x), x)
}

