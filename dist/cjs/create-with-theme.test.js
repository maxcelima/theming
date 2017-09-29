'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _isFunction = require('is-function');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _createWithTheme = require('./create-with-theme');

var _createWithTheme2 = _interopRequireDefault(_createWithTheme);

var _channel = require('./channel');

var _channel2 = _interopRequireDefault(_channel);

var _brcast = require('brcast');

var _brcast2 = _interopRequireDefault(_brcast);

var _testHelpers = require('./test-helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(0, _ava2.default)('createWithTheme\'s type', function (t) {
  var actual = (0, _isFunction2.default)(_createWithTheme2.default);
  t.true(actual, 'createWithTheme should be a function');
});

(0, _ava2.default)('createWithTheme\'s result is function on its own', function (t) {
  var withTheme = (0, _createWithTheme2.default)();
  var actual = (0, _isFunction2.default)(withTheme);
  t.true(actual, 'withTheme should be a function');
});

(0, _ava2.default)('withTheme(Comp) result instance type', function (t) {
  var withTheme = (0, _createWithTheme2.default)();
  var actual = _react.Component.isPrototypeOf(withTheme(_testHelpers.Comp));
  t.true(actual, 'withTheme(Comp) should be a React Component');
});

(0, _ava2.default)('withTheme(Comp)\'s default channel', function (t) {
  var withTheme = (0, _createWithTheme2.default)();
  var actual = (0, _testHelpers.getChannel)(withTheme(_testHelpers.Comp));
  var expected = _channel2.default;
  t.is(actual, expected, 'withTheme(Comp) should have default channel');
});

(0, _ava2.default)('withTheme(Comp) custom channel', function (t) {
  var custom = '__CUSTOM__';
  var withTheme = (0, _createWithTheme2.default)(custom);
  var actual = (0, _testHelpers.getChannel)(withTheme(_testHelpers.Comp));
  var expected = custom;
  t.is(actual, expected, 'createWithTheme() should work with custom channel');
});

(0, _ava2.default)('withTheme(Comp) and stateless component', function (t) {
  var withTheme = (0, _createWithTheme2.default)();
  var StatelessComp = function StatelessComp() {
    for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }

    return _react2.default.createElement('div', props);
  };
  var ThemedComp = withTheme(StatelessComp);
  var theme = { themed: true };
  var broadcast = (0, _brcast2.default)(theme);
  var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(ThemedComp, null)
  ), (0, _testHelpers.mountOptions)(broadcast)).childAt(0);
  var actual = wrapper.name();
  var expected = 'WithTheme(StatelessComp)';

  t.is(actual, expected, 'withTheme(Comp) should include wrapped stateless component\'s name in the displayName');
});

(0, _ava2.default)('withTheme(Comp) and statefull component', function (t) {
  var withTheme = (0, _createWithTheme2.default)();

  var StatefullComp = function (_Component) {
    _inherits(StatefullComp, _Component);

    function StatefullComp() {
      _classCallCheck(this, StatefullComp);

      return _possibleConstructorReturn(this, (StatefullComp.__proto__ || Object.getPrototypeOf(StatefullComp)).apply(this, arguments));
    }

    _createClass(StatefullComp, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement('div', this.props);
      }
    }]);

    return StatefullComp;
  }(_react.Component);

  var ThemedComp = withTheme(StatefullComp);
  var theme = { themed: true };
  var broadcast = (0, _brcast2.default)(theme);
  var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(ThemedComp, null)
  ), (0, _testHelpers.mountOptions)(broadcast)).childAt(0);
  var actual = wrapper.name();
  var expected = 'WithTheme(StatefullComp)';

  t.is(actual, expected, 'withTheme(Comp) should include wrapped statefull component\'s name in the displayName');
});

(0, _ava2.default)('withTheme(Comp) unsubscribes on unmounting', function (t) {
  var withTheme = (0, _createWithTheme2.default)();
  var theme = { themed: true };
  var ComponentWithTheme = withTheme(_testHelpers.Trap.Prop);
  var broadcast = (0, _brcast2.default)(theme);
  var unsubscribed = (0, _testHelpers.getInterceptor)(false);

  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(ComponentWithTheme, { intercept: function intercept() {} }), (0, _testHelpers.mountOptions)(broadcast));
  wrapper.instance().unsubscribe = function () {
    return unsubscribed(true);
  };

  t.false(unsubscribed());

  wrapper.unmount();

  t.true(unsubscribed(), 'withTheme(Comp) should unsubscribe on unmounting');
});

(0, _ava2.default)('withTheme(Comp) without ThemeProvider', function (t) {
  var withTheme = (0, _createWithTheme2.default)();
  var ComponentWithTheme = withTheme(_testHelpers.Trap.Prop);

  t.throws(function () {
    (0, _enzyme.mount)(_react2.default.createElement(ComponentWithTheme, { intercept: function intercept() {} }));
  }, Error, 'withTheme(Comp) should throw if used without appropriate context');
});

(0, _ava2.default)('withTheme(Comp) receive theme', function (t) {
  var withTheme = (0, _createWithTheme2.default)();
  var theme = { themed: true };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  var ComponentWithTheme = withTheme(_testHelpers.Trap.Prop);
  var broadcast = (0, _brcast2.default)(theme);

  (0, _enzyme.mount)(_react2.default.createElement(ComponentWithTheme, { intercept: actual }), (0, _testHelpers.mountOptions)(broadcast));

  t.deepEqual(actual(), expected, 'withTheme(Comp) should receive theme');
});

(0, _ava2.default)('withTheme(Comp) receive theme deep into tree', function (t) {
  var withTheme = (0, _createWithTheme2.default)();
  var theme = { themed: true };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  var ComponentWithTheme = withTheme(_testHelpers.Trap.Prop);
  var broadcast = (0, _brcast2.default)(expected);

  (0, _enzyme.mount)(_react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(ComponentWithTheme, { intercept: actual })
    )
  ), (0, _testHelpers.mountOptions)(broadcast));

  t.deepEqual(actual(), expected, 'withTheme(Comp) should receive a theme deep down into tree');
});

(0, _ava2.default)('withTheme(Comp) receives theme through PureComponent', function (t) {
  var withTheme = (0, _createWithTheme2.default)();
  var theme = { themed: true };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  var ComponentWithTheme = withTheme(_testHelpers.Trap.Prop);
  var broadcast = (0, _brcast2.default)(expected);

  (0, _enzyme.mount)(_react2.default.createElement(
    _testHelpers.Pure,
    null,
    _react2.default.createElement(ComponentWithTheme, { intercept: actual })
  ), (0, _testHelpers.mountOptions)(broadcast));

  t.deepEqual(actual(), expected, 'withTheme(Comp) should receive theme through PureComponent');
});

(0, _ava2.default)('withTheme(Comp) receives theme updates', function (t) {
  var withTheme = (0, _createWithTheme2.default)();
  var theme = { themed: true };
  var update = { updated: true };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = update;

  var ComponentWithTheme = withTheme(_testHelpers.Trap.Prop);
  var broadcast = (0, _brcast2.default)(theme);

  (0, _enzyme.mount)(_react2.default.createElement(ComponentWithTheme, { intercept: actual }), (0, _testHelpers.mountOptions)(broadcast));

  broadcast.setState(update);

  t.deepEqual(actual(), expected, 'withTheme(Comp) should receive theme updates');
});

(0, _ava2.default)('withTheme(Comp) receives theme updates even through PureComponent', function (t) {
  var withTheme = (0, _createWithTheme2.default)();
  var theme = { themed: true };
  var update = { updated: true };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = update;

  var ComponentWithTheme = withTheme(_testHelpers.Trap.Prop);
  var broadcast = (0, _brcast2.default)(theme);

  (0, _enzyme.mount)(_react2.default.createElement(
    _testHelpers.Pure,
    null,
    _react2.default.createElement(ComponentWithTheme, { intercept: actual })
  ), (0, _testHelpers.mountOptions)(broadcast));

  broadcast.setState(update);

  t.deepEqual(actual(), expected, 'withTheme(Comp) should receive theme updates even through PureComponent');
});