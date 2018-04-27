/* global panzoom */
const miniReferent = {
  gestures: {
    Pinch: panzoom.gestures.Pinch,
    Pan: panzoom.gestures.Pan,
    Wheel: panzoom.gestures.Wheel,
    Swipe: panzoom.gestures.Swipe
  },
  options: {
    domEvents: true,
    distance: '200px'
  },
  listen: function () {
    if (this.options.domEvents) {
      this.on('pinch', this.fireEvent('pinch'), { reject: function (error) { console.log(error) } })
      this.on('pan', this.fireEvent('pan'), { reject: function (error) { console.log(error) } })
      this.on('wheelEvent', this.fireEvent('wheelEvent'), { reject: function (error) { console.log(error) } })
      this.on('swipe', this.fireEvent('swipe'), { reject: function (error) { console.log(error) } })
    }
  },
  fireEvent: function (name) {
    return function (event) {
      const customEvent = new CustomEvent(name, {
        detail: event,
        bubbles: true,
        cancelable: true,
      })

      if (!this.el.dispatchEvent(customEvent)) {
        console.log(name + ' - event was cancelled')
        return
      }
    }
  }
}
const listenButton = document.getElementById('listenButton')
const domMessages = document.querySelectorAll('.messages__message')
const scene = panzoom(document.querySelector('.scene'), miniReferent)

const messages = setupMessages()
listen(messages)

function setupMessages () {
  return Array.prototype.map.call(domMessages, function (messageEl) {
    const gesture = messageEl.dataset.gesture
    const method = messageEl.dataset.method

    let unpack
    if (messageEl.dataset.method === 'event') {
      switch (gesture) {
        case 'pinch':
          unpack = pinchEventUnpack
          break
        case 'pan':
          unpack = panEventUnpack
          break
        case 'wheelEvent':
          unpack = wheelEventUnpack
          break
        default:
          unpack = eventDetail
      }
    } else {
      switch (gesture) {
        case 'pinch':
          unpack = pinchUnpack
          break
        case 'pan':
          unpack = panUnpack
          break
        case 'wheelEvent':
          unpack = wheelUnpack
          break
        default:
          unpack = identity
      }
    }

    return messagesFactory(gesture, method, messageEl.textContent, messageEl, unpack)
  })
}

function eventDetail (event) {
  return event.detail
}

function identity (x) {
  return x
}

function pinchEventUnpack (event) {
  return pinchUnpack(eventDetail(event))
}

function pinchUnpack (pinchEvent) {
  return pinchEvent.scale.toFixed(2)
    + ' (' + pinchEvent.point.x.toFixed(1) + ', ' + pinchEvent.point.y.toFixed(1) + ') ('
    + pinchEvent.focusAfterScale.x.toFixed(1) + ', ' + pinchEvent.focusAfterScale.y.toFixed(1) + ')'
}

function panEventUnpack (event) {
  return panUnpack(eventDetail(event))
}

function panUnpack (panEvent) {
  return '(' + panEvent.touches[0].x.toFixed(2) + ', ' + panEvent.touches[0].y.toFixed(2) + ')'
}

function wheelEventUnpack (event) {
  return wheelUnpack(eventDetail(event))
}

function wheelUnpack (wheelEvent) {
  return 'deltaY: ' + wheelEvent.deltaY.toFixed(2) + ' (' + wheelEvent.point.x + ', ' + wheelEvent.point.y + ') in page (' + wheelEvent.page[0].x + ', ' + wheelEvent.page[0].y + ')'
}

function messagesFactory (gesture, method, title, messageEl, unpack) {
  const message = {
    gesture: gesture,
    method: method,
    counter: 0,
    messageEl: messageEl,
    handler: function (payload) {
      // if (gesture === 'wheelEvent') console.log('payload', payload)
      message.messageEl.textContent = title + ' ' + ++message.counter + ': ' + unpack(payload)
    }
  }

  return message
}

function listen (messages) {

  const promise = messages.filter(function (m) { return m.method === 'promise' })
  const event = messages.filter(function (m) { return m.method === 'event' })
  const on = messages.filter(function (m) { return m.method === 'on' })
  const once = messages.filter(function (m) { return m.method === 'once' })

  // use promise
  promise.forEach(function (m) {
    scene.promise(m.gesture).then(m.handler)
  })

  // listen to event
  event.forEach(function (m) {
    document.body.addEventListener(m.gesture, m.handler, true)
  })

  // subscribe
  on.forEach(function (m) {
    scene.on(m.gesture, m.handler)
  })

  // subscribe once
  once.forEach(function (m) {
    scene.once(m.gesture, m.handler)
  })

  // If you have unlisten then you have to enable listen again,
  // but it's irrelevant when you start to listen again.
  // .listen() is idempotent
  scene.listen()

  listenButton.textContent = getButtonText(scene)

  listenButton.onclick = function () {


    // .unlisten() will remove all event listeners and nullify the gesture recognizers.
    scene.unlisten()
    // If a gesture name is defined then only that gesture is removed.
    // E.g:
    // on.forEach(function (m) {
    //   scene.unlisten(m.gesture)
    // })

    event.forEach(function (m) {
      document.body.removeEventListener(m.gesture, m.handler, true)
    })

    listenButton.textContent = getButtonText(scene)
    listenButton.onclick = listen.bind(null, messages)
  }
}

function getButtonText (scene) {
  return scene.isListening ? 'Unlisten' : 'Listen'
}
