var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import test from 'ava';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createBroadcast from 'brcast';
import { mount } from 'enzyme';
import isFunction from 'is-function';
import isPainObject from 'is-plain-object';
import { getChannel, Pure, mountOptions, getInterceptor } from './test-helpers';
import CHANNEL from './channel';
import createThemeListener from './create-theme-listener';

test('createThemeListener\'s type', function (t) {
  var actual = isFunction(createThemeListener);
  t.true(actual, 'createThemeListener should be a function');
});

test('createThemeListener\'s result\'s type', function (t) {
  var actual = isPainObject(createThemeListener());
  t.true(actual, 'createThemeListener() should be an object');
});

test('themeListener\'s fields', function (t) {
  var actual = Object.keys(createThemeListener());
  var expected = ['contextTypes', 'initial', 'subscribe'];

  t.deepEqual(actual, expected, 'themeListener should have contextTypes and bind fields');
});

test('themeListener\'s default channel', function (t) {
  var themeListener = createThemeListener();
  var actual = getChannel(themeListener);
  var expected = CHANNEL;

  t.is(actual, expected, 'themeListener should use default channel by default');
});

test('themeListener\'s custom channel', function (t) {
  var customChannel = '__CUSTOM__';
  var themeListener = createThemeListener(customChannel);
  var actual = getChannel(themeListener);
  var expected = customChannel;

  t.is(actual, expected, 'themeListener should have custom channel if one is passed');
});

test('themeListener\'s initial and subscribe', function (t) {
  var themeListener = createThemeListener();
  var initial = themeListener.initial,
      subscribe = themeListener.subscribe;

  var actual = [initial, subscribe].every(isFunction);

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
        return React.createElement('div', null);
      }
    }]);

    return ThemeListenerTrap;
  }(Component), _class.propTypes = {
    intercept: PropTypes.func.isRequired
  }, _class.contextTypes = themeListener.contextTypes, _temp;
};

test('themeListener without ThemeProvider', function (t) {
  var themeListener = createThemeListener();
  var Trap = getTrap(themeListener);

  t.throws(function () {
    mount(React.createElement(Trap, { intercept: function intercept() {} }));
  }, Error, 'themeListener should throw if used without appropriate context');
});

test('themeListener and init', function (t) {
  var themeListener = createThemeListener();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var broadcast = createBroadcast(theme);
  var actual = getInterceptor();
  var expected = theme;

  mount(React.createElement(Trap, { intercept: actual }), mountOptions(broadcast));

  t.deepEqual(actual(), expected, 'init should get initial theme');
});

test('themeListener, init and nested react tree', function (t) {
  var themeListener = createThemeListener();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var broadcast = createBroadcast(theme);
  var actual = getInterceptor();
  var expected = theme;

  mount(React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      null,
      React.createElement(Trap, { intercept: actual })
    )
  ), mountOptions(broadcast));

  t.deepEqual(actual(), expected, 'init should get initial theme through nested react tree');
});

test('themeListener, init and PureComponent', function (t) {
  var themeListener = createThemeListener();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var broadcast = createBroadcast(theme);
  var actual = getInterceptor();
  var expected = theme;

  mount(React.createElement(
    Pure,
    null,
    React.createElement(Trap, { intercept: actual })
  ), mountOptions(broadcast));

  t.deepEqual(actual(), expected, 'init should get initial theme through PureComponent');
});

test('themeListener and subscribe', function (t) {
  var themeListener = createThemeListener();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var update = { updated: true };
  var broadcast = createBroadcast(theme);
  var actual = getInterceptor(theme);
  var expected = update;

  mount(React.createElement(Trap, { intercept: actual }), mountOptions(broadcast));

  broadcast.setState(update);

  t.deepEqual(actual(), expected, 'subscribe should get theme update');
});

test('themeListener, subscribe and nested react tree', function (t) {
  var themeListener = createThemeListener();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var update = { updated: true };
  var broadcast = createBroadcast(theme);
  var actual = getInterceptor(theme);
  var expected = update;

  mount(React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      null,
      React.createElement(Trap, { intercept: actual })
    )
  ), mountOptions(broadcast));

  broadcast.setState(update);

  t.deepEqual(actual(), expected, 'subscribe should get theme update through nested tree');
});

test('themeListener, subscribe and PureComponent', function (t) {
  var themeListener = createThemeListener();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var update = { updated: true };
  var broadcast = createBroadcast(theme);
  var actual = getInterceptor(theme);
  var expected = update;

  mount(React.createElement(
    Pure,
    null,
    React.createElement(Trap, { intercept: actual })
  ), mountOptions(broadcast));

  broadcast.setState(update);

  t.deepEqual(actual(), expected, 'subscribe should get theme update through PureComponent');
});

test('themeListener and unsubscribe', function (t) {
  var themeListener = createThemeListener();
  var Trap = getTrap(themeListener);
  var theme = { themed: true };
  var broadcast = createBroadcast(theme);
  var unsubscribed = getInterceptor(false);

  var wrapper = mount(React.createElement(Trap, { intercept: function intercept() {} }), mountOptions(broadcast));
  wrapper.instance().unsubscribe = function () {
    return unsubscribed(true);
  };

  t.false(unsubscribed());

  wrapper.unmount();

  t.true(unsubscribed(), 'unsubscribe should happen on unmount');
});