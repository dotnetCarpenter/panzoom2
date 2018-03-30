'use strict'

const messages = document.querySelectorAll('.message')
const scene = panzoom.createPanzoom(document.querySelector('.scene'))

// use promise
scene.once('swipe').then(swipeHandler1)

// listen to event
document.body.addEventListener('swipe', swipeHandler2, true)

// subscribe
scene.on('swipe', swipeHandler3)


let counter1 = 0
function swipeHandler1 (event) {
  messages[0].textContent = 'promise ' + ++counter1
}

let counter2 = 0
function swipeHandler2(event) {
  // cancel event
  // event.preventDefault()
  messages[1].textContent = 'event ' + ++counter2
}

let counter3 = 0
function swipeHandler3(event) {
  messages[2].textContent = 'subscriber ' + ++counter3
}
