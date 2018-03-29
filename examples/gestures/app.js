'use strict'

const message = document.querySelector('#message')
const scene = panzoom.createPanzoom(document.querySelector('.scene'))

scene.on('swipe').then(swipe)

document.body.addEventListener('swipe', swipe, true)

function swipe(event) {
  console.log('swipe')
  message.textContent = 'swipe'
}
