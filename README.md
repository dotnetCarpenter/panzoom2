[![Build Status](https://travis-ci.org/dotnetCarpenter/panzoom2.svg?branch=master)](https://travis-ci.org/dotnetCarpenter/panzoom2)

panzoom2 BETA
=============

WORK IN PROGRESS

```
npm i panzoom2
```
_[panzoom 2 on npm](https://www.npmjs.com/package/panzoom2)_


## Supported browsers

The project aim to support every [browser that has more than 1% market share, plus IE11](http://browserl.ist/?q=IE+11%2C+%3E+1%25).

## Internet Explorer 11

Required polyfills:

- Promise
- CustomEvent
- Object.assign
- Map

You can use the polyfill service from [Financial Times](https://polyfill.io/v2/docs/)
`<script src="https://cdn.polyfill.io/v2/polyfill.minify.js?features=Promise,Object.assign,CustomEvent,Map&amp;flags=gated&amp;rum=0"></script>`

## Examples

[Overview](https://dotnetcarpenter.github.io/panzoom2/)

- [swipe](https://dotnetcarpenter.github.io/panzoom2/swipe) `Showcase swipe detection and all the ways you can listen and unlisten to an event with panzoom.`
- [gestures](https://dotnetcarpenter.github.io/panzoom2/gestures) `Showcase gesture recognition.`

## Inspiration drawn from

- Andrei Kashcha's [panzoom](https://github.com/anvaka/panzoom/)
- Ulrich-Matthias Schäfer's [svg.panzoom.js](https://github.com/svgdotjs/svg.panzoom.js/)
- Eight Media's [HAMMER.JS](http://hammerjs.github.io/)
- [User-defined gestures for surface computing](https://faculty.washington.edu/wobbrock/pubs/chi-09.02.pdf)
- [Algorithms for 2D Multi-Touch Rotate, Scale & Translate (RST) Gestures](http://www.erikpaluka.com/blog/rst/)
