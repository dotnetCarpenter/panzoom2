export default new Map([
  ['wheel', { passive: false, useCapture: true }],
  ['mousedown', { passive: true, useCapture: true }],
  ['mousemove', { passive: true, useCapture: true }],
  ['mouseup', { passive: true, useCapture: true }],
  ['touchstart', { passive: true, useCapture: true }],
  ['touchmove', { passive: false, useCapture: true }],
  ['touchend', { passive: true, useCapture: true }]
])
