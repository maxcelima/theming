'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _isFunction = require('is-function');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _createThemeProvider = require('./create-theme-provider');

var _createThemeProvider2 = _interopRequireDefault(_createThemeProvider);

var _channel = require('./channel');

var _channel2 = _interopRequireDefault(_channel);

var _testHelpers = require('./test-helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import createBroadcast from './create-broadcast';
var createBroadcast = require('brcast');

(0, _ava2.default)('createThemeProvider\'s type', function (t) {
  var actual = (0, _isFunction2.default)(_createThemeProvider2.default);
  t.true(actual, 'createThemeProvider should be a function');
});

(0, _ava2.default)('createThemeProvider\'s result instance type', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();
  var actual = _react.Component.isPrototypeOf(ThemeProvider);
  t.true(actual, 'createThemeProvider() should be a React Component');
});

(0, _ava2.default)('ThemeProvider default channel', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();
  var actual = (0, _testHelpers.getChannel)(ThemeProvider);
  var expected = _channel2.default;
  t.is(actual, expected, 'createThemeProvider() should have default channel');
});

(0, _ava2.default)('ThemeProvider custom channel', function (t) {
  var custom = '__CUSTOM__';
  var ThemeProvider = (0, _createThemeProvider2.default)(custom);
  var actual = (0, _testHelpers.getChannel)(ThemeProvider);
  var expected = custom;
  t.is(actual, expected, 'createThemeProvider() should have custom channel if one is provided');
});

(0, _ava2.default)('ThemeProvider unsubscribes on unmounting', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();
  var theme = { themed: true };
  var broadcast = createBroadcast(theme);
  var unsubscribed = (0, _testHelpers.getInterceptor)(false);

  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(ThemeProvider, { theme: theme }), (0, _testHelpers.mountOptions)(broadcast));

  t.false(unsubscribed());

  wrapper.instance().unsubscribe = function () {
    return unsubscribed(true);
  };
  wrapper.unmount();

  t.true(unsubscribed(), 'ThemeProvider should unsubscribe on unmounting');
});

(0, _ava2.default)('ThemeProvider and not a plain object theme', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();

  t.throws(function () {
    (0, _enzyme.mount)(_react2.default.createElement(ThemeProvider, { theme: false }));
  }, Error, 'ThemeProvider should throw if theme is not a plain object');
});

(0, _ava2.default)('ThemeProvider and broken function theme', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();
  var theme = { themed: true };
  var incorrectAugment = function incorrectAugment() {
    return false;
  };

  t.throws(function () {
    (0, _enzyme.mount)(_react2.default.createElement(
      ThemeProvider,
      { theme: theme },
      _react2.default.createElement(ThemeProvider, { theme: incorrectAugment })
    ));
  }, Error, 'ThemeProvider should throw if function theme returns not a plain object');
});

(0, _ava2.default)('ThemeProvider passes theme', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();
  var theme = { themed: true };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  (0, _enzyme.mount)(_react2.default.createElement(
    ThemeProvider,
    { theme: theme },
    _react2.default.createElement(_testHelpers.Trap.Context, { intercept: actual })
  ));

  t.deepEqual(actual(), expected, 'ThemeProvider should pass a theme');
});

(0, _ava2.default)('ThemeProvider passes theme instance', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();
  var theme = { themed: true };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  (0, _enzyme.mount)(_react2.default.createElement(
    ThemeProvider,
    { theme: theme },
    _react2.default.createElement(_testHelpers.Trap.Context, { intercept: actual })
  ));

  t.is(actual(), expected, 'ThemeProvider should pass theme instance, if it is not nested');
});

(0, _ava2.default)('ThemeProvider passes theme deep into tree', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();
  var theme = { themed: true };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  (0, _enzyme.mount)(_react2.default.createElement(
    ThemeProvider,
    { theme: theme },
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_testHelpers.Trap.Context, { intercept: actual })
      )
    )
  ));

  t.deepEqual(actual(), expected, 'ThemeProvider should pass a theme deep down into tree');
});

(0, _ava2.default)('ThemeProvider passes theme through PureComponent', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();
  var theme = { themed: true };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  (0, _enzyme.mount)(_react2.default.createElement(
    ThemeProvider,
    { theme: expected },
    _react2.default.createElement(
      _testHelpers.Pure,
      null,
      _react2.default.createElement(_testHelpers.Trap.Context, { intercept: actual })
    )
  ));

  t.deepEqual(actual(), expected, 'ThemeProvider should pass a theme through PureComponent');
});

(0, _ava2.default)('ThemeProvider themes objects merging', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();
  var theme = { themed: true };
  var patch = { merged: true };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = { themed: true, merged: true };

  (0, _enzyme.mount)(_react2.default.createElement(
    ThemeProvider,
    { theme: theme },
    _react2.default.createElement(
      ThemeProvider,
      { theme: patch },
      _react2.default.createElement(_testHelpers.Trap.Context, { intercept: actual })
    )
  ));
  // console.log({ actual: actual() });
  // t.is(1, 1);
  t.deepEqual(actual(), expected, 'ThemeProvider should merge themes');
});

(0, _ava2.default)('ThemeProvider theme augmenting', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();
  var theme = { themed: true };
  var augment = function augment(outerTheme) {
    return Object.assign({}, outerTheme, { augmented: true });
  };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = { themed: true, augmented: true };

  (0, _enzyme.mount)(_react2.default.createElement(
    ThemeProvider,
    { theme: theme },
    _react2.default.createElement(
      ThemeProvider,
      { theme: augment },
      _react2.default.createElement(_testHelpers.Trap.Context, { intercept: actual })
    )
  ));

  t.deepEqual(actual(), expected, 'ThemeProvider should augmented theme');
});

(0, _ava2.default)('ThemeProvider propagates theme updates', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();
  var theme = { themed: true };
  var update = { updated: true };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = update;

  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
    ThemeProvider,
    { theme: theme },
    _react2.default.createElement(_testHelpers.Trap.Context, { intercept: actual })
  ));

  wrapper.setProps({ theme: expected });

  t.deepEqual(actual(), expected, 'ThemeProvider should pass theme update');
});

(0, _ava2.default)('ThemeProvider propagates theme updates even through PureComponent', function (t) {
  var ThemeProvider = (0, _createThemeProvider2.default)();
  var theme = { themed: true };
  var update = { updated: true };
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = update;

  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
    ThemeProvider,
    { theme: theme },
    _react2.default.createElement(
      _testHelpers.Pure,
      null,
      _react2.default.createElement(_testHelpers.Trap.Context, { intercept: actual })
    )
  ));

  wrapper.setProps({ theme: expected });

  t.deepEqual(actual(), expected, 'ThemeProvider should pass theme update even through PureComponent');
});