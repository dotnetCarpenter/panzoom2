(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.panzoom = {})));
}(this, (function (exports) { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var LengthUnit = function LengthUnit(name) {
    classCallCheck(this, LengthUnit);

    this.name = name;
  };

  var PixelUnit = function (_LengthUnit) {
    inherits(PixelUnit, _LengthUnit);

    function PixelUnit() {
      classCallCheck(this, PixelUnit);
      return possibleConstructorReturn(this, (PixelUnit.__proto__ || Object.getPrototypeOf(PixelUnit)).call(this, 'px'));
    }

    createClass(PixelUnit, [{
      key: 'valueOf',
      value: function valueOf() {
        return this.name;
      }
    }]);
    return PixelUnit;
  }(LengthUnit);

  var Translate3d = function () {
    function Translate3d() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { tx: 0, ty: 0, tz: 0 },
          tx = _ref.tx,
          ty = _ref.ty,
          tz = _ref.tz;

      classCallCheck(this, Translate3d);

      this.tx = parseFloat(tx);
      this.ty = parseFloat(ty);
      this.tz = parseFloat(tz);

      this.unit = new PixelUnit();
    }

    createClass(Translate3d, [{
      key: 'setUnit',
      value: function setUnit(unit) {
        this.unit = unit;
      }
    }, {
      key: 'toString',
      value: function toString() {
        return 'translate3d(' + (this.tx + this.unit) + ', ' + (this.ty + this.unit) + ', ' + (this.tz + this.unit) + ');';
      }
    }]);
    return Translate3d;
  }();

  exports.Translate3d = Translate3d;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
