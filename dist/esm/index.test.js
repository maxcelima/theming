import test from 'ava';
import React from 'react';
import { mount } from 'enzyme';
import isFunction from 'is-function';
import isPlainObject from 'is-plain-object';
import { Trap, Pure, Comp, getInterceptor, getChannel } from './test-helpers';

import { channel, createTheming, ThemeProvider, withTheme } from './index';

test('createTheming\'s type', function (t) {
  var actual = isFunction(createTheming);
  t.true(actual, 'createTheming should be a function');
});

test('createTheming()\'s type', function (t) {
  var theming = createTheming();
  var actual = isPlainObject(theming);
  t.true(actual, 'createTheming() should be an object');
});

test('createTheming()\'s key names', function (t) {
  var theming = createTheming();
  var actual = Object.keys(theming);
  var expected = ['channel', 'withTheme', 'ThemeProvider', 'themeListener'];

  t.deepEqual(actual, expected, 'createTheming()\' keys are withTheme and ThemeProvider');
});

test('theming default channel', function (t) {
  var defaultChannel = channel;
  var theming = createTheming();
  var actual = {
    themeProviderChannel: getChannel(theming.ThemeProvider),
    withThemeChannel: getChannel(theming.withTheme(Comp))
  };
  var expected = {
    themeProviderChannel: defaultChannel,
    withThemeChannel: defaultChannel
  };

  t.deepEqual(actual, expected, 'createTheming() hocs have default channel by default');
});

test('theming custom channel', function (t) {
  var customChannel = '__CUSTOM__';
  var theming = createTheming(customChannel);
  var actual = {
    themeProviderChannel: getChannel(theming.ThemeProvider),
    withThemeChannel: getChannel(theming.withTheme(Comp))
  };
  var expected = {
    themeProviderChannel: customChannel,
    withThemeChannel: customChannel
  };

  t.deepEqual(actual, expected, 'createTheming() hocs have custom channel if one is provided');
});

test('Theming and initial theme', function (t) {
  var theme = { themed: true };
  var ComponentWithTheme = withTheme(Trap.Prop);
  var actual = getInterceptor();
  var expected = theme;

  mount(React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(ComponentWithTheme, { intercept: actual })
  ));

  t.deepEqual(actual(), expected, 'Theming passes initial theme');
});

test('Theming, intitial theme and deep react tree', function (t) {
  var theme = { themed: true };
  var ComponentWithTheme = withTheme(Trap.Prop);
  var actual = getInterceptor();
  var expected = theme;

  mount(React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(ComponentWithTheme, { intercept: actual })
  ));

  t.deepEqual(actual(), expected, 'Theming should pass initial theme through deep react tree');
});

test('Theming, intitial theme and Pure Component', function (t) {
  var theme = { themed: true };
  var ComponentWithTheme = withTheme(Trap.Prop);
  var actual = getInterceptor();
  var expected = theme;

  mount(React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(
      Pure,
      null,
      React.createElement(ComponentWithTheme, { intercept: actual })
    )
  ));

  t.deepEqual(actual(), expected, 'Theming should pass initial theme through PureComponent');
});

test('Theming and updates', function (t) {
  var theme = { themed: true };
  var update = { updated: true };
  var ComponentWithTheme = withTheme(Trap.Prop);
  var actual = getInterceptor();
  var expected = update;

  var wrapper = mount(React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(ComponentWithTheme, { intercept: actual })
  ));

  wrapper.setProps({ theme: update });

  t.deepEqual(actual(), expected, 'default theming should pass theme update');
});

test('Theming, updates and PureComponent', function (t) {
  var theme = { themed: true };
  var update = { updated: true };
  var ComponentWithTheme = withTheme(Trap.Prop);
  var actual = getInterceptor();
  var expected = update;

  var wrapper = mount(React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(
      Pure,
      null,
      React.createElement(ComponentWithTheme, { intercept: actual })
    )
  ));

  wrapper.setProps({ theme: update });

  t.deepEqual(actual(), expected, 'default theming should pass theme update through Pure Component');
});