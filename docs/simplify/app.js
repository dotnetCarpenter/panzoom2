'use strict'

const listenButton = document.getElementById('listenButton')
const elements = {
  container: document.querySelector('.container'),
  scene: document.querySelector('.scene')
}

let zoom
listenButton.onclick = function () {
  const elValue = document.querySelector('input[type="radio"]:checked').value
  const el = elements[elValue]

  if (zoom && zoom.isListening) {
    zoom.unlisten()
  } else {
    zoom = panzoom(el)
    console.dir(zoom)
  }

  listenButton.textContent = getButtonText(zoom)
}

function getButtonText (referent) {
  return referent.isListening ? 'Unlisten' : 'Listen'
}
