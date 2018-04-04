'use strict'

const listenButton = document.getElementById('listenButton')
const scene = document.querySelector('.container')
const stage = document.querySelector('.stage')

let options = new panzoom.Options({
  bounds: scene.getBoundingClientRect(),
  zoomFactor: 0.03,
  threshold: .3,
  el: scene
})
const panzoomAction = panzoom.referents.get('panzoom')
panzoomAction.setOptions(options)

listenButton.onclick = function () {
  if (panzoomAction.isListening) panzoomAction.unlisten()
  else panzoomAction.listen()

  listenButton.textContent = panzoomAction.isListening ? 'Unlisten' : 'Listen'
}
