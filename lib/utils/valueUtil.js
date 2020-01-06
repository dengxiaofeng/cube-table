"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPathValue = getPathValue;
exports.getColumnKey = getColumnKey;
exports.mergeObject = mergeObject;
exports.validateValue = validateValue;
exports.newArr = newArr;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var INTERNAL_KEY_PREFIX = 'RC_TABLE_KEY';

function toArray(arr) {
  if (arr === undefined || arr === null) {
    return [];
  }

  return Array.isArray(arr) ? arr : [arr];
}

function getPathValue(record, path) {
  // Skip if path is empty
  if (!path && typeof path !== 'number') {
    return record;
  }

  var pathList = toArray(path);
  var current = record;

  for (var i = 0; i < pathList.length; i += 1) {
    if (!current) {
      return null;
    }

    var prop = pathList[i];
    current = current[prop];
  }

  return current;
}

function getColumnKey(_ref, index) {
  var key = _ref.key,
      dataIndex = _ref.dataIndex;

  if (key) {
    return key;
  }

  var prefix = toArray(dataIndex).join('-') || INTERNAL_KEY_PREFIX;
  return "".concat(prefix, "_").concat(index);
}

function mergeObject() {
  var merged = {};
  /* eslint-disable no-param-reassign */

  function fillProps(obj, clone) {
    if (clone) {
      Object.keys(clone).forEach(function (key) {
        var value = clone[key];

        if (value && _typeof(value) === 'object') {
          obj[key] = obj[key] || {};
          fillProps(obj[key], value);
        } else {
          obj[key] = value;
        }
      });
    }
  }
  /* eslint-enable */


  for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
    objects[_key] = arguments[_key];
  }

  objects.forEach(function (clone) {
    fillProps(merged, clone);
  });
  return merged;
}

function validateValue(val) {
  return val !== null && val !== undefined;
}
/**
 * Create a packaged array to fast the v8 process speed
 */


function newArr(len) {
  var list = [];

  for (var i = 0; i < len; i += 1) {
    list[i] = null;
  }

  return list;
}