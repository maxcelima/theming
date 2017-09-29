'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _isFunction = require('is-function');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _testHelpers = require('./test-helpers');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('createTheming\'s type', function (t) {
  var actual = (0, _isFunction2.default)(_index.createTheming);
  t.true(actual, 'createTheming should be a function');
});

(0, _ava2.default)('createTheming()\'s type', function (t) {
  var theming = (0, _index.createTheming)();
  var actual = (0, _isPlainObject2.default)(theming);
  t.true(actual, 'createTheming() should be an object');
});

(0, _ava2.default)('createTheming()\'s key names', function (t) {
  var theming = (0, _index.createTheming)();
  var actual = Object.keys(theming);
  var expected = ['channel', 'withTheme', 'ThemeProvider', 'themeListener'];

  t.deepEqual(actual, expected, 'createTheming()\' keys are withTheme and ThemeProvider');
});

(0, _ava2.default)('theming default channel', function (t) {
  var defaultChannel = _index.channel;
  var theming = (0, _index.createTheming)();
  var actual = {
    themeProviderChannel: (0, _testHelpers.getChannel)(theming.ThemeProvider),
    withThemeChannel: (0, _testHelpers.getChannel)(theming.withTheme(_testHelpers.Comp))
  };
  var expected = {
    themeProviderChannel: defaultChannel,
    withThemeChannel: defaultChannel
  };

  t.deepEqual(actual, expected, 'createTheming() hocs have default channel by default');
});

(0, _ava2.default)('theming custom channel', function (t) {
  var customChannel = '__CUSTOM__';
  var theming = (0, _index.createTheming)(customChannel);
  var actual = {
    themeProviderChannel: (0, _testHelpers.getChannel)(theming.ThemeProvider),
    withThemeChannel: (0, _testHelpers.getChannel)(theming.withTheme(_testHelpers.Comp))
  };
  var expected = {
    themeProviderChannel: customChannel,
    withThemeChannel: customChannel
  };

  t.deepEqual(actual, expected, 'createTheming() hocs have custom channel if one is provided');
});

(0, _ava2.default)('Theming and initial theme', function (t) {
  var theme = { themed: true };
  var ComponentWithTheme = (0, _index.withTheme)(_testHelpers.Trap.Prop);
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  (0, _enzyme.mount)(_react2.default.createElement(
    _index.ThemeProvider,
    { theme: theme },
    _react2.default.createElement(ComponentWithTheme, { intercept: actual })
  ));

  t.deepEqual(actual(), expected, 'Theming passes initial theme');
});

(0, _ava2.default)('Theming, intitial theme and deep react tree', function (t) {
  var theme = { themed: true };
  var ComponentWithTheme = (0, _index.withTheme)(_testHelpers.Trap.Prop);
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  (0, _enzyme.mount)(_react2.default.createElement(
    _index.ThemeProvider,
    { theme: theme },
    _react2.default.createElement(ComponentWithTheme, { intercept: actual })
  ));

  t.deepEqual(actual(), expected, 'Theming should pass initial theme through deep react tree');
});

(0, _ava2.default)('Theming, intitial theme and Pure Component', function (t) {
  var theme = { themed: true };
  var ComponentWithTheme = (0, _index.withTheme)(_testHelpers.Trap.Prop);
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = theme;

  (0, _enzyme.mount)(_react2.default.createElement(
    _index.ThemeProvider,
    { theme: theme },
    _react2.default.createElement(
      _testHelpers.Pure,
      null,
      _react2.default.createElement(ComponentWithTheme, { intercept: actual })
    )
  ));

  t.deepEqual(actual(), expected, 'Theming should pass initial theme through PureComponent');
});

(0, _ava2.default)('Theming and updates', function (t) {
  var theme = { themed: true };
  var update = { updated: true };
  var ComponentWithTheme = (0, _index.withTheme)(_testHelpers.Trap.Prop);
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = update;

  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
    _index.ThemeProvider,
    { theme: theme },
    _react2.default.createElement(ComponentWithTheme, { intercept: actual })
  ));

  wrapper.setProps({ theme: update });

  t.deepEqual(actual(), expected, 'default theming should pass theme update');
});

(0, _ava2.default)('Theming, updates and PureComponent', function (t) {
  var theme = { themed: true };
  var update = { updated: true };
  var ComponentWithTheme = (0, _index.withTheme)(_testHelpers.Trap.Prop);
  var actual = (0, _testHelpers.getInterceptor)();
  var expected = update;

  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
    _index.ThemeProvider,
    { theme: theme },
    _react2.default.createElement(
      _testHelpers.Pure,
      null,
      _react2.default.createElement(ComponentWithTheme, { intercept: actual })
    )
  ));

  wrapper.setProps({ theme: update });

  t.deepEqual(actual(), expected, 'default theming should pass theme update through Pure Component');
});