'use strict'

const message = document.querySelector('#message')
const scene = panzoom.createPanzoom(document.querySelector('.scene'))

// use promise
scene.once('swipe').then(event => {
  console.log('swipe promise')
  message.textContent = 'swipe promise'
})

// listen to event
document.body.addEventListener('swipe', swipe, true)

// TODO: subscribe

function swipe(event) {
  // cancel event
  // event.preventDefault()

  message.textContent = 'swipe event'
}
