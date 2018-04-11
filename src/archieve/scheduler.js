import { identity } from './utils'

/**
 * Schedule events by group
 * @version 2.0.1
 * @param {number} amount - By default events are grouped by amount. You can change the default behavior with a predicate function to the returned getHandler function.
 * @returns {object} getHandler
 */
function scheduler (amount) {
  if (amount == null || amount < 1) throw new TypeError(`scheduler can not group ${amount} events`)

  let events = []

  const defaultPredicate = ({events, amount}) => events.length === amount
  const defaultUnpack = identity

  return {
    /**
     * Get a listener for events that will execute function 'f' when all events are recieved
     * @param {object} options - only f is required
     * @param {function} options.f - function to execute
     * @param {*} options.type - custom type will be sent to the predicate function, useful for tagging events
     * @param {function} options.predicate - if the function return true then f will be executed
     * @param {function} options.unpack - unpack the events - very important for properties of an event
     * that might be optimized away by the browser, like the target reference
     */
    getHandler ({ f, type, predicate = defaultPredicate, unpack = defaultUnpack }) {
      return function handleEvent (value) {
        if (!events) return // we're done

        events.push(unpack({ type, value }))

        if (predicate({events, amount, type})) {
          f(events)

          events = null // we're done and want to turn this function into a noop
        }
      }
    },
    flush () {
      throw Error('Not implemented')
    }
  }
}

export default scheduler
