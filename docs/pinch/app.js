'use strict'

// our custom referent
const catchPinch = {
  gestures: [panzoom.gestures.Pinch],

  // life-cycle method
  listen: function () {
    this.on('pinch', pinchHandler)
    this.on('pinchstart', pinchStartHandler)
  },

  unlisten: function () {
    this.off('pinch')
    this.off('pinchstart')
  }
}

const initializeButton = document.getElementById('initializeButton')
const listenButton = document.getElementById('listenButton')
const messages = document.querySelectorAll('.message')
const domScene = document.querySelector('div.scene')
const focusCircle = document.querySelector('.focusCircle')
const firstCircle = document.querySelector('.firstCircle')
const secondCircle = document.querySelector('.secondCircle')
let scene
let lastTouches

initializeButton.onclick = function () {
  if (scene) {
    scene.destroy()
    console.log(scene)
    scene = null

    initializeButton.textContent = 'Initialize'
    listenButton.style.display = 'none'
    counter = 0
  } else {
    scene  = panzoom(domScene, catchPinch, {pinchThreshold: 0.01})
    // scene.listen() is called automatically
    initializeButton.textContent = 'Destroy'
    listenButton.style.display = 'inline-block'
  }
}

listenButton.onclick = function () {
  // unlisten will remove all event listeners
  if (scene.isListening) scene.unlisten()
  else scene.listen()

  listenButton.textContent = getButtonText(scene)
}

function getButtonText (scene) {
  return scene.isListening ? 'Unlisten' : 'Listen'
}


let counter = 0
const title = 'pinch.scale'
const d1 = 'distance from first touch: '
const d2 = 'distance between two fingers: '
messages[0].textContent = title
messages[1].textContent = d1
messages[2].textContent = d2

function pinchStartHandler (event) {
  lastTouches = event
}

function pinchHandler (event) {
  // if (event.scale < 0) debugger
  setCircle(focusCircle, event.point)
  setCircle(firstCircle, event.touches[0])
  setCircle(secondCircle, event.touches[1])

  messages[0].textContent = title + ' (' + ++counter + '): ' + event.scale.toFixed(3)

  messages[1].textContent = d1 + event.touches[0].distance(lastTouches.touches[0]).toFixed(3)
  messages[2].textContent = d2 + event.touches[1].distance(lastTouches.touches[1]).toFixed(3)
}

function setCircle (circle, point) {
  circle.style.top = point.y + 'px'
  circle.style.left = point.x + 'px'
}
