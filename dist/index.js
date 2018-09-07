'use strict';

exports.__esModule = true;
var _convertToObject = exports._convertToObject = function _convertToObject(text) {
  for (var _len = arguments.length, vars = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    vars[_key - 1] = arguments[_key];
  }

  return function (props) {
    var parsedTags = text.reduce(function (acc, item, i) {
      var v = vars[i] || '';

      // If it's a function, call it with props
      if (typeof v === 'function') v = v(props);

      // Merge with the rest
      return acc + item + v;
    }, '');

    var rules = parsedTags.split(';').map(function (item) {
      return item.trim();
    }).filter(function (item) {
      return !!item;
    });

    // Create and return the object
    return rules.reduce(function (acc, item) {
      var _Object$assign;

      var _item$split$map = item.split(':').map(function (i) {
        return i.trim();
      }),
          key = _item$split$map[0],
          val = _item$split$map[1];

      return Object.assign(acc, (_Object$assign = {}, _Object$assign[key] = val, _Object$assign));
    }, {});
  };
};

var styledMap = function styledMap() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return function (props) {
    var mapOfStyles = void 0;

    if (Array.isArray(args[0])) {
      // Are we using a tagged template literal?
      mapOfStyles = _convertToObject.apply(undefined, args)(props);
    } else {
      // Regular object usage:
      mapOfStyles = args[args.length - 1];
    }

    var styleKeys = Object.keys(mapOfStyles);

    // If the first argument is a string, styled-map works differently:
    if (typeof args[0] === 'string') {
      // We use the value of a prop, rather than the key
      var val = props[args[0]];

      if (mapOfStyles[val]) return mapOfStyles[val];
    } else {
      // Otherwise we do things the normal way:
      var matchingKeys = styleKeys.filter(function (key) {
        return props[key];
      });

      // If we have a matching key, return it (or the last if we have multiple):
      if (matchingKeys.length) return mapOfStyles[matchingKeys.pop()];
    }

    // If nothing has matched so far, look for a "default" item in our map:
    if (Object.prototype.hasOwnProperty.call(mapOfStyles, 'default')) {
      return mapOfStyles.default;
    }

    // Else just return the last item, whatever it is:
    return mapOfStyles[styleKeys.pop()];
  };
};

var _dotProp = exports._dotProp = function _dotProp(string, object) {
  return string.split('.').reduce(function (acc, key) {
    return acc[key];
  }, object);
};

var mapToTheme = exports.mapToTheme = function mapToTheme(key) {
  return function (props) {
    return styledMap(_dotProp(key, props.theme))(props);
  };
};

exports.default = styledMap;