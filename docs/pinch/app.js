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
let scene // panzoom object
let lastTouches // start event
let firstTouchesCircles = []

initializeButton.onclick = function () {
  if (scene) {
    scene.destroy()
    console.log(scene)
    scene = null
    svgOverlay.innerHTML = ''

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
  if (scene.isListening) {
    scene.unlisten()
    svgOverlay.innerHTML = ''
  } else {
    scene.listen()
  }

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

  appendToSvg(createLine('d1', translatePointToSvgPoint(lastTouches.viewport[0]), translatePointToSvgPoint(event.viewport[0])))
  appendToSvg(createLine('d2', translatePointToSvgPoint(lastTouches.viewport[0]), translatePointToSvgPoint(event.viewport[1])))
}

function pinchStartHandler (event) {
  lastTouches = event

  firstTouchesCircles = event.viewport.map(translatePointToSvgPoint).map(createSvgCircle).map(appendToSvg)
  firstTouchesCircles.forEach(function (circle, n) {
    setAttribute(circle, 'class', n % 2 ? 'd2' : 'd1')
  })
}

function pinchEndHandler (event) {}

function setCircle (circle, point) {
  circle.style.top = point.y + 'px'
  circle.style.left = point.x + 'px'
}

function createLine(cssClass, p1, p2) {
  const line = createSvgElement('line')
  setAttribute(line, 'x1', p1.x)
  setAttribute(line, 'y1', p1.y)
  setAttribute(line, 'x2', p2.x)
  setAttribute(line, 'y2', p2.y)
  setAttribute(line, 'class', cssClass)
  return line
}

function createSvgElement (name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name)
}

function setAttribute (el, name, value) {
  el.setAttribute(name, value)
}

function createSvgCircle (point) {
  const circle = createSvgElement('circle')
  setAttribute(circle, 'r', '5px')
  setAttribute(circle, 'cx', point.x + 'px')
  setAttribute(circle, 'cy', point.y + 'px')
  return circle
}

function appendToSvg (element) {
  return svgOverlay.appendChild(element)
}

function translatePointToSvgPoint (point) {
  const svgPoint = svgOverlay.createSVGPoint()
  svgPoint.x = point.x
  svgPoint.y = point.y
  return svgPoint.matrixTransform(svgOverlay.getScreenCTM().inverse())
}
