'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _brcast = require('brcast');

var _brcast2 = _interopRequireDefault(_brcast);

var _enzyme = require('enzyme');

var _isFunction = require('is-function');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _testHelpers = require('./test-helpers');

var _channel = require('./channel');

var _channel2 = _interopRequireDefault(_channel);

var _createThemeListener = require('./create-theme-listener');

var _createThemeListener2 = _interopRequireDefault(_createThemeListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(0, _ava2.default)('createThemeListener\'s type', function (t) {
  var actual = (0, _isFunction2.default)(_createThemeListener2.default);
  t.true(actual, 'createThemeListener should be a function');
});

(0, _ava2.default)('createThemeListener\'s result\'s type', function (t) {
  var actual = (0, _isPlainObject2.default)((0, _createThemeListener2.default)());
  t.true(actual, 'createThemeListener() should be an object');
});

(0, _ava2.default)('themeListener\'s fields', function (t) {
  var actual = Object.keys((0, _createThemeListener2.default)());
  var expected = ['contextTypes', 'initial', 'subscribe'];

  t.deepEqual(actual, expected, 'themeListener should have contextTypes and bind fields');
});

(0, _ava2.default)('themeListener\'s default channel', function (t) {
  var themeListener = (0, _createThemeListener2.default)();
  var actual = (0, _testHelpers.getChannel)(themeListener);
  var expected = _channel2.default;

  t.is(actual, expected, 'themeListener should use default channel by default');
});

(0, _ava2.default)('themeListener\'s custom channel', function (t) {
  var customChannel = '__CUSTOM__';
  var themeListener = (0, _createThemeListener2.default)(customChannel);
  var actual = (0, _testHelpers.getChannel)(themeListener);
  var expected = customChannel;

  t.is(actual, expected, 'themeListener should have custom channel if one is passed');
});

(0, _ava2.default)('themeListener\'s initial and subscribe', function (t) {
  var themeListener = (0, _createThemeListener2.default)();
  var initial = themeListener.initial,
      subscribe = themeListener.subscribe;

  var actual = [initial, subscribe].every(_isFunction2.default);

  t.true(actual, 'themeListener\'s init, subscribe and unsubscribe should be a function');
});

var getTrap = function getTrap(themeListener) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    _inherits(ThemeListenerTrap, _Component);

    function ThemeListenerTrap(props, context) {
      _classCallCheck(this, ThemeListenerTrap);

      var _this = _possibleConstructorReturn(this, (ThemeListenerTrap.__proto__ || Object.getPrototypeOf(ThemeListenerTrap)).call(this, props, context));

      _this.props.intercept(themeListener.initial(context));
      return _this;
    }

    _createClass(ThemeListenerTrap, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.unsubscribe = themeListener.subscribe(this.context, this.props.intercept);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (typeof this.unsubscribe === 'function') {
          this.unsubscribe();
        }
      }
      // eslint-disable-next-line

    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement('div', null);
      }
    }]);

    return ThemeListenerTrap;
  }(_react.Component), _class.propTypes = {
    intercept: _propTypes2.default.func.isRequired
  }, _class.contextTypes = themeListener.contextTypes, _temp;
};

(0, _ava2.default)('themeListener without ThemeProvider', function (t) {
  var themeListener = (0, _createThemeListener2.default)();
  var Trap = getTrap(themeListener);

  t.throws(function () {
    (0, _enzyme.mount)(_react2.default.createElement(Trap, { intercept: function intercept() {} }));
  }, Error, 'themeListener should throw if used without appropriate context');
});

(0, _ava2.default)('themeListener and init', function (t) {
  var themeListener = (0, _createThemeListener2.default)();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var broadcast = (0, _brcast2.default)(theme);
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  (0, _enzyme.mount)(_react2.default.createElement(Trap, { intercept: actual }), (0, _testHelpers.mountOptions)(broadcast));

  t.deepEqual(actual(), expected, 'init should get initial theme');
});

(0, _ava2.default)('themeListener, init and nested react tree', function (t) {
  var themeListener = (0, _createThemeListener2.default)();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var broadcast = (0, _brcast2.default)(theme);
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  (0, _enzyme.mount)(_react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(Trap, { intercept: actual })
    )
  ), (0, _testHelpers.mountOptions)(broadcast));

  t.deepEqual(actual(), expected, 'init should get initial theme through nested react tree');
});

(0, _ava2.default)('themeListener, init and PureComponent', function (t) {
  var themeListener = (0, _createThemeListener2.default)();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var broadcast = (0, _brcast2.default)(theme);
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  (0, _enzyme.mount)(_react2.default.createElement(
    _testHelpers.Pure,
    null,
    _react2.default.createElement(Trap, { intercept: actual })
  ), (0, _testHelpers.mountOptions)(broadcast));

  t.deepEqual(actual(), expected, 'init should get initial theme through PureComponent');
});

(0, _ava2.default)('themeListener and subscribe', function (t) {
  var themeListener = (0, _createThemeListener2.default)();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var update = { updated: true };
  var broadcast = (0, _brcast2.default)(theme);
  var actual = (0, _testHelpers.getInterceptor)(theme);
  var expected = update;

  (0, _enzyme.mount)(_react2.default.createElement(Trap, { intercept: actual }), (0, _testHelpers.mountOptions)(broadcast));

  broadcast.setState(update);

  t.deepEqual(actual(), expected, 'subscribe should get theme update');
});

(0, _ava2.default)('themeListener, subscribe and nested react tree', function (t) {
  var themeListener = (0, _createThemeListener2.default)();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var update = { updated: true };
  var broadcast = (0, _brcast2.default)(theme);
  var actual = (0, _testHelpers.getInterceptor)(theme);
  var expected = update;

  (0, _enzyme.mount)(_react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(Trap, { intercept: actual })
    )
  ), (0, _testHelpers.mountOptions)(broadcast));

  broadcast.setState(update);

  t.deepEqual(actual(), expected, 'subscribe should get theme update through nested tree');
});

(0, _ava2.default)('themeListener, subscribe and PureComponent', function (t) {
  var themeListener = (0, _createThemeListener2.default)();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var update = { updated: true };
  var broadcast = (0, _brcast2.default)(theme);
  var actual = (0, _testHelpers.getInterceptor)(theme);
  var expected = update;

  (0, _enzyme.mount)(_react2.default.createElement(
    _testHelpers.Pure,
    null,
    _react2.default.createElement(Trap, { intercept: actual })
  ), (0, _testHelpers.mountOptions)(broadcast));

  broadcast.setState(update);

  t.deepEqual(actual(), expected, 'subscribe should get theme update through PureComponent');
});

(0, _ava2.default)('themeListener and unsubscribe', function (t) {
  var themeListener = (0, _createThemeListener2.default)();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var broadcast = (0, _brcast2.default)(theme);
  var unsubscribed = (0, _testHelpers.getInterceptor)(false);

  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Trap, { intercept: function intercept() {} }), (0, _testHelpers.mountOptions)(broadcast));
  wrapper.instance().unsubscribe = function () {
    return unsubscribed(true);
  };

  t.false(unsubscribed());

  wrapper.unmount();

  t.true(unsubscribed(), 'unsubscribe should happen on unmount');
});