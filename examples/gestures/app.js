'use strict'

const messages = document.querySelectorAll('.message')
const scene = panzoom.createPanzoom(document.querySelector('.scene'))

// use promise
scene.promise('swipe').then(swipeHandler1)

// listen to event
document.body.addEventListener('swipe', swipeHandler2, true)

// subscribe
scene.on('swipe', swipeHandler3)

// subscribe once
scene.once('swipe', swipeHandler4)


let counter1 = 0
function swipeHandler1 (direction) {
  messages[0].textContent = `promise ${++counter1} - ${direction}`
  console.log(direction)
}

let counter2 = 0
function swipeHandler2(event) {
  // cancel event
  // event.preventDefault()
  messages[1].textContent = `event ${++counter2} - ${event.detail}`
  // console.log(event)
}

let counter3 = 0
function swipeHandler3(direction) {
  messages[2].textContent = `subscriber ${++counter3} - ${direction}`
  // console.log(direction)
}

let counter4 = 0
function swipeHandler4(direction) {
  messages[3].textContent = `subscriber ${++counter4} - ${direction}`
  // console.log(direction)
}
