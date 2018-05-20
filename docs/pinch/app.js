'use strict'

// our custom referent
const catchPinch = {
  gestures: [panzoom.gestures.Pinch],

  // life-cycle method
  listen: function () {
    // use promise
    this.promise('pinch').then(pinchHandler)
  }
}

const initializeButton = document.getElementById('initializeButton')
const listenButton = document.getElementById('listenButton')
const messages = document.querySelectorAll('.message')
const domScene = document.querySelector('.scene')
let scene

initializeButton.onclick = function () {
  if (scene) {
    scene.destroy()
    console.log(scene)
    scene = null

    initializeButton.textContent = 'Initialize'
    listenButton.style.display = 'none'
  } else {
    scene  = panzoom(domScene, catchPinch)
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
const title1 = 'promise (once)'
messages[0].textContent = title1
function pinchHandler (event) {
  messages[0].textContent = title1 + ' ' + ++counter1 + ' - ' + event.scale
  console.log(event)
}
