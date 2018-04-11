'use strict'

const listenButton = document.getElementById('listenButton')
const container = document.querySelector('.container')
const scene = document.querySelector('.scene')

listenButton.onclick = function () {
  panzoom(container)
}
