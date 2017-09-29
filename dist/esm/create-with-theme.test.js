var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import test from 'ava';
import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';

import isFunction from 'is-function';
import createWithTheme from './create-with-theme';
import channel from './channel';
import createBroadcast from 'brcast';
import { getChannel, Comp, Pure, Trap, mountOptions, getInterceptor } from './test-helpers';

test('createWithTheme\'s type', function (t) {
  var actual = isFunction(createWithTheme);
  t.true(actual, 'createWithTheme should be a function');
});

test('createWithTheme\'s result is function on its own', function (t) {
  var withTheme = createWithTheme();
  var actual = isFunction(withTheme);
  t.true(actual, 'withTheme should be a function');
});

test('withTheme(Comp) result instance type', function (t) {
  var withTheme = createWithTheme();
  var actual = Component.isPrototypeOf(withTheme(Comp));
  t.true(actual, 'withTheme(Comp) should be a React Component');
});

test('withTheme(Comp)\'s default channel', function (t) {
  var withTheme = createWithTheme();
  var actual = getChannel(withTheme(Comp));
  var expected = channel;
  t.is(actual, expected, 'withTheme(Comp) should have default channel');
});

test('withTheme(Comp) custom channel', function (t) {
  var custom = '__CUSTOM__';
  var withTheme = createWithTheme(custom);
  var actual = getChannel(withTheme(Comp));
  var expected = custom;
  t.is(actual, expected, 'createWithTheme() should work with custom channel');
});

test('withTheme(Comp) and stateless component', function (t) {
  var withTheme = createWithTheme();
  var StatelessComp = function StatelessComp() {
    for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }

    return React.createElement('div', props);
  };
  var ThemedComp = withTheme(StatelessComp);
  var theme = { themed: true };
  var broadcast = createBroadcast(theme);
  var wrapper = shallow(React.createElement(
    'div',
    null,
    React.createElement(ThemedComp, null)
  ), mountOptions(broadcast)).childAt(0);
  var actual = wrapper.name();
  var expected = 'WithTheme(StatelessComp)';

  t.is(actual, expected, 'withTheme(Comp) should include wrapped stateless component\'s name in the displayName');
});

test('withTheme(Comp) and statefull component', function (t) {
  var withTheme = createWithTheme();

  var StatefullComp = function (_Component) {
    _inherits(StatefullComp, _Component);

    function StatefullComp() {
      _classCallCheck(this, StatefullComp);

      return _possibleConstructorReturn(this, (StatefullComp.__proto__ || Object.getPrototypeOf(StatefullComp)).apply(this, arguments));
    }

    _createClass(StatefullComp, [{
      key: 'render',
      value: function render() {
        return React.createElement('div', this.props);
      }
    }]);

    return StatefullComp;
  }(Component);

  var ThemedComp = withTheme(StatefullComp);
  var theme = { themed: true };
  var broadcast = createBroadcast(theme);
  var wrapper = shallow(React.createElement(
    'div',
    null,
    React.createElement(ThemedComp, null)
  ), mountOptions(broadcast)).childAt(0);
  var actual = wrapper.name();
  var expected = 'WithTheme(StatefullComp)';

  t.is(actual, expected, 'withTheme(Comp) should include wrapped statefull component\'s name in the displayName');
});

test('withTheme(Comp) unsubscribes on unmounting', function (t) {
  var withTheme = createWithTheme();
  var theme = { themed: true };
  var ComponentWithTheme = withTheme(Trap.Prop);
  var broadcast = createBroadcast(theme);
  var unsubscribed = getInterceptor(false);

  var wrapper = mount(React.createElement(ComponentWithTheme, { intercept: function intercept() {} }), mountOptions(broadcast));
  wrapper.instance().unsubscribe = function () {
    return unsubscribed(true);
  };

  t.false(unsubscribed());

  wrapper.unmount();

  t.true(unsubscribed(), 'withTheme(Comp) should unsubscribe on unmounting');
});

test('withTheme(Comp) without ThemeProvider', function (t) {
  var withTheme = createWithTheme();
  var ComponentWithTheme = withTheme(Trap.Prop);

  t.throws(function () {
    mount(React.createElement(ComponentWithTheme, { intercept: function intercept() {} }));
  }, Error, 'withTheme(Comp) should throw if used without appropriate context');
});

test('withTheme(Comp) receive theme', function (t) {
  var withTheme = createWithTheme();
  var theme = { themed: true };
  var actual = getInterceptor();
  var expected = theme;

  var ComponentWithTheme = withTheme(Trap.Prop);
  var broadcast = createBroadcast(theme);

  mount(React.createElement(ComponentWithTheme, { intercept: actual }), mountOptions(broadcast));

  t.deepEqual(actual(), expected, 'withTheme(Comp) should receive theme');
});

test('withTheme(Comp) receive theme deep into tree', function (t) {
  var withTheme = createWithTheme();
  var theme = { themed: true };
  var actual = getInterceptor();
  var expected = theme;

  var ComponentWithTheme = withTheme(Trap.Prop);
  var broadcast = createBroadcast(expected);

  mount(React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      null,
      React.createElement(ComponentWithTheme, { intercept: actual })
    )
  ), mountOptions(broadcast));

  t.deepEqual(actual(), expected, 'withTheme(Comp) should receive a theme deep down into tree');
});

test('withTheme(Comp) receives theme through PureComponent', function (t) {
  var withTheme = createWithTheme();
  var theme = { themed: true };
  var actual = getInterceptor();
  var expected = theme;

  var ComponentWithTheme = withTheme(Trap.Prop);
  var broadcast = createBroadcast(expected);

  mount(React.createElement(
    Pure,
    null,
    React.createElement(ComponentWithTheme, { intercept: actual })
  ), mountOptions(broadcast));

  t.deepEqual(actual(), expected, 'withTheme(Comp) should receive theme through PureComponent');
});

test('withTheme(Comp) receives theme updates', function (t) {
  var withTheme = createWithTheme();
  var theme = { themed: true };
  var update = { updated: true };
  var actual = getInterceptor();
  var expected = update;

  var ComponentWithTheme = withTheme(Trap.Prop);
  var broadcast = createBroadcast(theme);

  mount(React.createElement(ComponentWithTheme, { intercept: actual }), mountOptions(broadcast));

  broadcast.setState(update);

  t.deepEqual(actual(), expected, 'withTheme(Comp) should receive theme updates');
});

test('withTheme(Comp) receives theme updates even through PureComponent', function (t) {
  var withTheme = createWithTheme();
  var theme = { themed: true };
  var update = { updated: true };
  var actual = getInterceptor();
  var expected = update;

  var ComponentWithTheme = withTheme(Trap.Prop);
  var broadcast = createBroadcast(theme);

  mount(React.createElement(
    Pure,
    null,
    React.createElement(ComponentWithTheme, { intercept: actual })
  ), mountOptions(broadcast));

  broadcast.setState(update);

  t.deepEqual(actual(), expected, 'withTheme(Comp) should receive theme updates even through PureComponent');
});