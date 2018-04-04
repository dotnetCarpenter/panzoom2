'use strict'

const listenButton = document.getElementById('listenButton')
const container = document.querySelector('.container')
const scene = document.querySelector('.scene')

const options = {
  bounds: scene.getBoundingClientRect(),
  zoomFactor: 0.03,
  pinchThreshold: .3,
  world: container,
  scene: scene
}

const pinch = new panzoom.Pinch({
  threshold: options.pinchThreshold
})
const wheel = new panzoom.Wheel({
  zoomFactor: options.zoomFactor
})
const pan = new panzoom.Pan()

const panAction = panzoom.referents.get('move')
// panAction.with('pan')
panAction.setOptions(options)

const panzoomAction = panzoom.referents.get('zoom')
// panzoomAction.with('pintch', 'wheel')
panzoomAction.setOptions(options)

panzoomAction.on('wheelDelta', function (event) {
  unlistenPan()
  const point = event.point
  panzoomAction.zoom(point.x, point.y, event.scale)
    .then(listenPan)
})

panzoomAction.on('pinch', function (event) {
  unlistenPanzoom()
  const point = event.point
  panzoomAction.zoom(point.x, point.y, event.scale)
    .then(listenPanzoom)
})

listenButton.onclick = function () {
  if (panzoom.isListening) panzoom.unlisten()
  else panzoom.listen()

  listenButton.textContent = panzoomAction.isListening ? 'Unlisten' : 'Listen'
}

function listenPan () {
  panAction.listen()
}
function unlistenPan () {
  panAction.unlisten()
}
function listenPanzoom () {
  panzoomAction.listen()
}
function unlistenPanzoom () {
  panzoomAction.unlisten()
}