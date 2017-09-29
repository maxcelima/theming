'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Trap = exports.ContextTrap = exports.PropTrap = exports.Pure = exports.Comp = exports.mountOptions = exports.getChannel = exports.getContextTypes = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getInterceptor = getInterceptor;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _channel = require('./channel');

var _channel2 = _interopRequireDefault(_channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getContextTypes = exports.getContextTypes = function getContextTypes(C) {
  return C.contextTypes;
};
var getChannel = exports.getChannel = function getChannel(C) {
  return Object.keys(getContextTypes(C))[0];
};

var mountOptions = exports.mountOptions = function mountOptions(broadcast) {
  return {
    childContextTypes: _defineProperty({}, _channel2.default, _propTypes2.default.object.isRequired),
    context: _defineProperty({}, _channel2.default, broadcast)
  };
};

function getInterceptor(initialState) {
  var state = initialState;
  return function (newState) {
    if (newState) {
      state = newState;
    }
    return state;
  };
}

var Comp = exports.Comp = function Comp(props) {
  return _react2.default.createElement('div', props);
};

var Pure = exports.Pure = function (_PureComponent) {
  _inherits(Pure, _PureComponent);

  function Pure() {
    _classCallCheck(this, Pure);

    return _possibleConstructorReturn(this, (Pure.__proto__ || Object.getPrototypeOf(Pure)).apply(this, arguments));
  }

  _createClass(Pure, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        this.props.children
      );
    }
  }]);

  return Pure;
}(_react.PureComponent);

Pure.propTypes = {
  children: _propTypes2.default.node.isRequired
};

var PropTrap = exports.PropTrap = function (_Component) {
  _inherits(PropTrap, _Component);

  function PropTrap(props) {
    _classCallCheck(this, PropTrap);

    var _this2 = _possibleConstructorReturn(this, (PropTrap.__proto__ || Object.getPrototypeOf(PropTrap)).call(this, props));

    _this2.props.intercept(props.theme);
    return _this2;
  }

  _createClass(PropTrap, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps) {
        this.props.intercept(nextProps.theme);
      }
    }
    // eslint-disable-next-line

  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', null);
    }
  }]);

  return PropTrap;
}(_react.Component);

PropTrap.propTypes = {
  intercept: _propTypes2.default.func.isRequired,
  theme: _propTypes2.default.object.isRequired
};

var ContextTrap = exports.ContextTrap = function (_Component2) {
  _inherits(ContextTrap, _Component2);

  function ContextTrap(props, context) {
    _classCallCheck(this, ContextTrap);

    var _this3 = _possibleConstructorReturn(this, (ContextTrap.__proto__ || Object.getPrototypeOf(ContextTrap)).call(this, props, context));

    _this3.broadcast = _this3.context[_channel2.default];
    if (_this3.broadcast) {
      _this3.props.intercept(_this3.broadcast.getState());
    }
    return _this3;
  }

  _createClass(ContextTrap, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.broadcast) {
        this.unsubscribe = this.broadcast.subscribe(this.props.intercept);
      }
    }
    // eslint-disable-next-line

  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', null);
    }
  }]);

  return ContextTrap;
}(_react.Component);

ContextTrap.propTypes = {
  intercept: _propTypes2.default.func.isRequired
};
ContextTrap.contextTypes = _defineProperty({}, _channel2.default, _propTypes2.default.object.isRequired);
var Trap = exports.Trap = {
  Prop: PropTrap,
  Context: ContextTrap
};