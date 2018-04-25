'use strict'

const listenButton = document.getElementById('listenButton')
const messages = document.querySelectorAll('.message')

// our custom referent
const catchSwipe = {
  gestures: [panzoom.gestures.Swipe],

  // default options to referent and gestures
  // - can be overriden via the options argument to panzoom()
  options: {
    distance: '70%'
  },

  // life-cycle method
  listen: function () {
    // use promise
    this.promise('swipe').then(swipeHandler1)

    // listen to event
    document.body.addEventListener('swipe', swipeHandler2, true)

    // subscribe
    this.on('swipe', swipeHandler3)

    // subscribe once
    this.once('swipe', swipeHandler4)

    if (this.options.domEvents) {
      this.on('swipe', this.delegateEvent)
    }
  },
  // life-cycle method
  unlisten: function () {
    document.body.removeEventListener('swipe', swipeHandler2, true)

    this.off('swipe') // will remove all event listeners for the 'swipe' event
    // scene.off('swipe', swipeHandler1) // promise can not be unlisten to - off all swipe event listeners or turn off swipe completely
    // scene.off('swipe', swipeHandler3) // this will work
    // scene.off('swipe', swipeHandler4) // once can not be unlisten to - off all swipe event listeners or turn off swipe completely
  },
  // custom method
  delegateEvent: function (event) {
    const swipeEvent = new CustomEvent('swipe', { detail: event.direction })
    if (!this.el.dispatchEvent(swipeEvent)) {
      console.log('Swipe::action - event was cancelled')
    }
  }
}

const scene = panzoom(document.querySelector('.scene'), catchSwipe, { domEvents: true })
// scene.listen() is called automatically

listenButton.onclick = function () {
  // unlisten will remove all event listeners
  if (scene.isListening) scene.unlisten()
  else scene.listen()

  listenButton.textContent = getButtonText(scene)
}

function getButtonText (scene) {
  return scene.isListening ? 'Unlisten' : 'Listen'
}


let counter1 = 0
const title1 = 'promise (once)'
messages[0].textContent = title1
function swipeHandler1 (event) {
  messages[0].textContent = title1 + ' ' + ++counter1 + ' - ' + event.direction
  console.log(event)
}

let counter2 = 0
const title2 = 'event'
messages[1].textContent = title2
function swipeHandler2(event) {
  // cancel event
  // event.preventDefault()
  messages[1].textContent = title2 + ' ' + ++counter2 + ' - ' + event.detail
  console.log(event.detail)
}

let counter3 = 0
const title3 = 'subscriber'
messages[2].textContent = title3
function swipeHandler3(event) {
  messages[2].textContent = title3 + ' ' + ++counter3 + ' - ' + event.direction
  console.log(event)
}

let counter4 = 0
const title4 = 'subscriber once'
messages[3].textContent = title4
function swipeHandler4(event) {
  messages[3].textContent = title4 + ' ' + ++counter4 + ' - ' + event.direction
  console.log(event)
}
