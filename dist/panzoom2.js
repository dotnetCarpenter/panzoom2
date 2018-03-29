(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.panzoom2 = {})));
}(this, (function (exports) { 'use strict';

  class LengthUnit {
    constructor (name) {
      this.name = name;
    }
  }

  class PixelUnit extends LengthUnit {
    constructor () {
      super('px');
    }

    valueOf () {
      return this.name
    }
  }

  class Translate3d {
    constructor ({tx = 0, ty = 0, tz = 0}) {
      this.tx = parseFloat(tx);
      this.ty = parseFloat(ty);
      this.tz = parseFloat(tz);

      this.unit = new PixelUnit();
    }

    setUnit (unit) {
      this.unit = unit;
    }

    valueOf () {
      return `translate3d(${this.tx + this.unit}, ${this.ty + this.unit}px, ${this.tz + this.unit}px);`
    }
  }

  exports.Translate3d = Translate3d;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
