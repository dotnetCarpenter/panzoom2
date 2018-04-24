'use strict'

const listenButton = document.getElementById('listenButton')
const initializeButton = document.getElementById('initializeButton')
const destroyButton = document.getElementById('destroyButton')

const elements = {
  container: document.querySelector('.container'),
  scene: document.querySelector('.scene')
}

let zoom
initializeButton.onclick = function initialize () {
  const el = getEl()

  zoom = panzoom(el)
  console.dir(zoom)
}
listenButton.onclick = function () {
  if (zoom && zoom.isListening) {
    zoom.unlisten()
  } else if (zoom && !zoom.isListening) {
    zoom.listen()
  } else {
    initialize()
  }

  listenButton.textContent = getButtonText(zoom)
}
destroyButton.onclick = function () {
  zoom.destroy()
}

function getEl () {
  const elValue = document.querySelector('input[type="radio"]:checked').value
  return elements[elValue]
}

function getButtonText (referent) {
  return referent.isListening ? 'Unlisten' : 'Listen'
}
