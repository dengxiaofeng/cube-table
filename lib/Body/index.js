"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _BodyRow = _interopRequireDefault(require("./BodyRow"));

var _TableContext = _interopRequireDefault(require("../context/TableContext"));

var _ExpandedRow = _interopRequireDefault(require("./ExpandedRow"));

var _BodyContext = _interopRequireDefault(require("../context/BodyContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Body(_ref) {
  var data = _ref.data,
      getRowKey = _ref.getRowKey,
      measureColumnWidth = _ref.measureColumnWidth,
      stickyOffsets = _ref.stickyOffsets,
      expandedKeys = _ref.expandedKeys,
      onRow = _ref.onRow,
      rowExpandable = _ref.rowExpandable,
      emptyNode = _ref.emptyNode,
      childrenColumnName = _ref.childrenColumnName;

  var _React$useContext = React.useContext(_TableContext.default),
      prefixCls = _React$useContext.prefixCls,
      getComponent = _React$useContext.getComponent;

  var _React$useContext2 = React.useContext(_BodyContext.default),
      fixHeader = _React$useContext2.fixHeader,
      fixColumn = _React$useContext2.fixColumn,
      flattenColumns = _React$useContext2.flattenColumns,
      componentWidth = _React$useContext2.componentWidth;

  return React.useMemo(function () {
    var WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
    var trComponent = getComponent(['body', 'row'], 'tr');
    var tdComponent = getComponent(['body', 'cell'], 'td');
    var rows;

    if (data.length) {
      rows = data.map(function (record, index) {
        var key = getRowKey(record, index);
        return [React.createElement(_BodyRow.default, {
          key: key,
          record: record,
          recordKey: key,
          index: index,
          measureColumnWidth: measureColumnWidth && index === 0,
          rowComponent: trComponent,
          cellComponent: tdComponent,
          stickyOffsets: stickyOffsets,
          expandedKeys: expandedKeys,
          onRow: onRow,
          getRowKey: getRowKey,
          rowExpandable: rowExpandable,
          childrenColumnName: childrenColumnName
        })];
      });
    } else {
      rows = React.createElement(_ExpandedRow.default, {
        expanded: true,
        className: "".concat(prefixCls, "-placeholder"),
        prefixCls: prefixCls,
        fixHeader: fixHeader,
        fixColumn: fixColumn,
        component: trComponent,
        componentWidth: componentWidth,
        cellComponent: tdComponent,
        colSpan: flattenColumns.length
      }, emptyNode);
    }

    return React.createElement(WrapperComponent, {
      className: "".concat(prefixCls, "-tbody")
    }, rows);
  }, [data, prefixCls, measureColumnWidth, stickyOffsets, expandedKeys, getRowKey, getComponent, componentWidth]);
}

var MemoBody = React.memo(Body);
MemoBody.displayName = 'Body';
var _default = MemoBody;
exports.default = _default;