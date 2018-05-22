'use strict'

// our custom referent
const catchPinch = {
  gestures: [panzoom.gestures.Pinch],

  // life-cycle method
  listen: function () {
    // use promise
    this.on('pinch', pinchHandler)
  },

  unlisten: function () {
    this.off('pinch')
  }
}

const initializeButton = document.getElementById('initializeButton')
const listenButton = document.getElementById('listenButton')
const messages = document.querySelectorAll('.message')
const domScene = document.querySelector('.scene')
const focusCircle = document.querySelector('.focusCircle')
let scene

initializeButton.onclick = function () {
  if (scene) {
    scene.destroy()
    console.log(scene)
    scene = null

    initializeButton.textContent = 'Initialize'
    listenButton.style.display = 'none'
  } else {
    scene  = panzoom(domScene, catchPinch, {pinchThreshold: 0})
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


let counter1 = 0
const title1 = 'pinch'
messages[0].textContent = title1
function pinchHandler (event) {
  // if (event.scale < 0) debugger
  focusCircle.style.top = event.point.y + 'px'
  focusCircle.style.left = event.point.x + 'px'

  messages[0].textContent = title1 + ' (' + ++counter1 + '): ' + event.scale
  // console.log(event)
}
