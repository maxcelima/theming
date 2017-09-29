import test from 'ava';
import React, { Component } from 'react';
import { mount } from 'enzyme';

import isFunction from 'is-function';
import createThemeProvider from './create-theme-provider';
import channel from './channel';
// import createBroadcast from './create-broadcast';
var createBroadcast = require('brcast');

import { getChannel, Trap, Pure, getInterceptor, mountOptions } from './test-helpers';

test('createThemeProvider\'s type', function (t) {
  var actual = isFunction(createThemeProvider);
  t.true(actual, 'createThemeProvider should be a function');
});

test('createThemeProvider\'s result instance type', function (t) {
  var ThemeProvider = createThemeProvider();
  var actual = Component.isPrototypeOf(ThemeProvider);
  t.true(actual, 'createThemeProvider() should be a React Component');
});

test('ThemeProvider default channel', function (t) {
  var ThemeProvider = createThemeProvider();
  var actual = getChannel(ThemeProvider);
  var expected = channel;
  t.is(actual, expected, 'createThemeProvider() should have default channel');
});

test('ThemeProvider custom channel', function (t) {
  var custom = '__CUSTOM__';
  var ThemeProvider = createThemeProvider(custom);
  var actual = getChannel(ThemeProvider);
  var expected = custom;
  t.is(actual, expected, 'createThemeProvider() should have custom channel if one is provided');
});

test('ThemeProvider unsubscribes on unmounting', function (t) {
  var ThemeProvider = createThemeProvider();
  var theme = { themed: true };
  var broadcast = createBroadcast(theme);
  var unsubscribed = getInterceptor(false);

  var wrapper = mount(React.createElement(ThemeProvider, { theme: theme }), mountOptions(broadcast));

  t.false(unsubscribed());

  wrapper.instance().unsubscribe = function () {
    return unsubscribed(true);
  };
  wrapper.unmount();

  t.true(unsubscribed(), 'ThemeProvider should unsubscribe on unmounting');
});

test('ThemeProvider and not a plain object theme', function (t) {
  var ThemeProvider = createThemeProvider();

  t.throws(function () {
    mount(React.createElement(ThemeProvider, { theme: false }));
  }, Error, 'ThemeProvider should throw if theme is not a plain object');
});

test('ThemeProvider and broken function theme', function (t) {
  var ThemeProvider = createThemeProvider();
  var theme = { themed: true };
  var incorrectAugment = function incorrectAugment() {
    return false;
  };

  t.throws(function () {
    mount(React.createElement(
      ThemeProvider,
      { theme: theme },
      React.createElement(ThemeProvider, { theme: incorrectAugment })
    ));
  }, Error, 'ThemeProvider should throw if function theme returns not a plain object');
});

test('ThemeProvider passes theme', function (t) {
  var ThemeProvider = createThemeProvider();
  var theme = { themed: true };
  var actual = getInterceptor();
  var expected = theme;

  mount(React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(Trap.Context, { intercept: actual })
  ));

  t.deepEqual(actual(), expected, 'ThemeProvider should pass a theme');
});

test('ThemeProvider passes theme instance', function (t) {
  var ThemeProvider = createThemeProvider();
  var theme = { themed: true };
  var actual = getInterceptor();
  var expected = theme;

  mount(React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(Trap.Context, { intercept: actual })
  ));

  t.is(actual(), expected, 'ThemeProvider should pass theme instance, if it is not nested');
});

test('ThemeProvider passes theme deep into tree', function (t) {
  var ThemeProvider = createThemeProvider();
  var theme = { themed: true };
  var actual = getInterceptor();
  var expected = theme;

  mount(React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        null,
        React.createElement(Trap.Context, { intercept: actual })
      )
    )
  ));

  t.deepEqual(actual(), expected, 'ThemeProvider should pass a theme deep down into tree');
});

test('ThemeProvider passes theme through PureComponent', function (t) {
  var ThemeProvider = createThemeProvider();
  var theme = { themed: true };
  var actual = getInterceptor();
  var expected = theme;

  mount(React.createElement(
    ThemeProvider,
    { theme: expected },
    React.createElement(
      Pure,
      null,
      React.createElement(Trap.Context, { intercept: actual })
    )
  ));

  t.deepEqual(actual(), expected, 'ThemeProvider should pass a theme through PureComponent');
});

test('ThemeProvider themes objects merging', function (t) {
  var ThemeProvider = createThemeProvider();
  var theme = { themed: true };
  var patch = { merged: true };
  var actual = getInterceptor();
  var expected = { themed: true, merged: true };

  mount(React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(
      ThemeProvider,
      { theme: patch },
      React.createElement(Trap.Context, { intercept: actual })
    )
  ));
  // console.log({ actual: actual() });
  // t.is(1, 1);
  t.deepEqual(actual(), expected, 'ThemeProvider should merge themes');
});

test('ThemeProvider theme augmenting', function (t) {
  var ThemeProvider = createThemeProvider();
  var theme = { themed: true };
  var augment = function augment(outerTheme) {
    return Object.assign({}, outerTheme, { augmented: true });
  };
  var actual = getInterceptor();
  var expected = { themed: true, augmented: true };

  mount(React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(
      ThemeProvider,
      { theme: augment },
      React.createElement(Trap.Context, { intercept: actual })
    )
  ));

  t.deepEqual(actual(), expected, 'ThemeProvider should augmented theme');
});

test('ThemeProvider propagates theme updates', function (t) {
  var ThemeProvider = createThemeProvider();
  var theme = { themed: true };
  var update = { updated: true };
  var actual = getInterceptor();
  var expected = update;

  var wrapper = mount(React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(Trap.Context, { intercept: actual })
  ));

  wrapper.setProps({ theme: expected });

  t.deepEqual(actual(), expected, 'ThemeProvider should pass theme update');
});

test('ThemeProvider propagates theme updates even through PureComponent', function (t) {
  var ThemeProvider = createThemeProvider();
  var theme = { themed: true };
  var update = { updated: true };
  var actual = getInterceptor();
  var expected = update;

  var wrapper = mount(React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(
      Pure,
      null,
      React.createElement(Trap.Context, { intercept: actual })
    )
  ));

  wrapper.setProps({ theme: expected });

  t.deepEqual(actual(), expected, 'ThemeProvider should pass theme update even through PureComponent');
});