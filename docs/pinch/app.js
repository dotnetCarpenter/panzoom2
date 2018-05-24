'use strict'

// our custom referent
const catchPinch = {
  gestures: [panzoom.gestures.Pinch],

  // life-cycle method
  listen: function () {
    this.on('pinch', pinchHandler)
    this.on('pinchstart', pinchStartHandler)
    this.on('pinchend', pinchEndHandler)
  },

  unlisten: function () {
    this.off('pinch')
    this.off('pinchstart')
    this.off('pinchend')
  }
}

const initializeButton = document.getElementById('initializeButton')
const listenButton = document.getElementById('listenButton')
const messages = document.querySelectorAll('.message')

const domScene = document.querySelector('div.scene')
const svgOverlay = document.querySelector('svg.scene')

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
    scene  = panzoom(domScene, catchPinch, {pinchThreshold: .08})
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

function pinchHandler (event) {
  // if (event.scale < 0) debugger
  setCircle(focusCircle, event.point)
  setCircle(firstCircle, event.touches[0])
  setCircle(secondCircle, event.touches[1])

  messages[0].textContent = title + ' (' + ++counter + '): ' + event.scale.toFixed(3)

  messages[1].textContent = d1 + event.touches[0].distance(lastTouches.touches[0]).toFixed(3)
  messages[2].textContent = d2 + event.touches[1].distance(lastTouches.touches[1]).toFixed(3)

  if (lastTouches) {
    const line = createSvgElement('line')
    setSvgAttribute(line, 'x1', lastTouches.touches[0].x)
    setSvgAttribute(line, 'x2', lastTouches.touches[1].x)
    setSvgAttribute(line, 'y1', lastTouches.touches[0].y)
    setSvgAttribute(line, 'y2', lastTouches.touches[1].y)
    svgOverlay.appendChild(line)
  }
}

function pinchStartHandler (event) {
  lastTouches = event

  event.touches
    .forEach(function (point) {
      svgOverlay.appendChild(createSvgCircle(point))
    })
}

function createSvgCircle (point) {
  const circle = createSvgElement('circle')
  setSvgAttribute(circle, 'r', 5)
  setSvgAttribute(circle, 'cx', point.x)
  setSvgAttribute(circle, 'cy', point.y)
  return circle
}

function createSvgElement (name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name)
}
function setSvgAttribute (el, name, value) {
  el.setAttribute(name, value)
}

function pinchEndHandler (event) {}

function setCircle (circle, point) {
  circle.style.top = point.y + 'px'
  circle.style.left = point.x + 'px'
}
