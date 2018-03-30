'use strict'

const listenButton = document.getElementById('listenButton')
const messages = document.querySelectorAll('.message')
const scene = panzoom.createPanzoom(document.querySelector('.scene'))

listen()

function listen () {

  // use promise
  scene.promise('swipe').then(swipeHandler1)

  // listen to event
  document.body.addEventListener('swipe', swipeHandler2, true)

  // subscribe
  scene.on('swipe', swipeHandler3)

  // subscribe once
  scene.once('swipe', swipeHandler4)

  // If you have unlisten then you have to enable listen again
  // , but it's irrelevant when you start to listen again.
  scene.listen()

  listenButton.textContent = getButtonText(scene)

  listenButton.onclick = function () {
    // unlisten will remove all event listeners and nullify the swipe module
    scene.unlisten('swipe')
    document.body.removeEventListener('swipe', swipeHandler2, true)

    listenButton.textContent = getButtonText(scene)
    listenButton.onclick = listen
  }
}

function getButtonText (scene) {
  return scene.isListening ? 'Unlisten' : 'Listen'
}

let counter1 = 0
const title1 = 'promise (once)'
messages[0].textContent = title1
function swipeHandler1 (direction) {
  messages[0].textContent = `${title1} ${++counter1} - ${direction}`
  // console.log(direction)
}

let counter2 = 0
const title2 = 'event'
messages[1].textContent = title2
function swipeHandler2(event) {
  // cancel event
  // event.preventDefault()
  messages[1].textContent = `${title2} ${++counter2} - ${event.detail}`
  // console.log(event)
}

let counter3 = 0
const title3 = 'subscriber'
messages[2].textContent = title3
function swipeHandler3(direction) {
  messages[2].textContent = `${title3} ${++counter3} - ${direction}`
  // console.log(direction)
}

let counter4 = 0
const title4 = 'subscriber once'
messages[3].textContent = title4
function swipeHandler4(direction) {
  messages[3].textContent = `${title4} ${++counter4} - ${direction}`
  // console.log(direction)
}
