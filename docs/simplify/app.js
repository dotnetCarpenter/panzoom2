'use strict'

const listenButton = document.getElementById('listenButton')
const elements = {
  container: document.querySelector('.container'),
  scene: document.querySelector('.scene')
}

listenButton.onclick = function () {
  const elValue = document.querySelector('input[type="radio"]:checked').value
  const el = elements[elValue]
  console.dir(
    panzoom(el)
  )
}
