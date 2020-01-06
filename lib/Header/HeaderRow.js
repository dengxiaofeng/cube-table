"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _rcResizeObserver = _interopRequireDefault(require("rc-resize-observer"));

var _Cell = _interopRequireDefault(require("../Cell"));

var _TableContext = _interopRequireDefault(require("../context/TableContext"));

var _fixUtil = require("../utils/fixUtil");

var _ResizeContext = _interopRequireDefault(require("../context/ResizeContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function HeaderRow(_ref) {
  var cells = _ref.cells,
      stickyOffsets = _ref.stickyOffsets,
      flattenColumns = _ref.flattenColumns,
      RowComponent = _ref.rowComponent,
      CellComponent = _ref.cellComponent,
      onHeaderRow = _ref.onHeaderRow,
      index = _ref.index;

  var _React$useContext = React.useContext(_TableContext.default),
      prefixCls = _React$useContext.prefixCls;

  var _React$useContext2 = React.useContext(_ResizeContext.default),
      onColumnResize = _React$useContext2.onColumnResize;

  var rowProps;

  if (onHeaderRow) {
    rowProps = onHeaderRow(cells.map(function (cell) {
      return cell.column;
    }), index);
  }

  return React.createElement(RowComponent, Object.assign({}, rowProps), cells.map(function (cell, cellIndex) {
    var column = cell.column,
        measure = cell.measure;
    var fixedInfo = (0, _fixUtil.getCellFixedInfo)(cell.colStart, cell.colEnd, flattenColumns, stickyOffsets);
    var additionalProps;

    if (column && column.onHeaderCell) {
      additionalProps = cell.column.onHeaderCell(column);
    }

    var cellNode = React.createElement(_Cell.default, Object.assign({}, cell, {
      ellipsis: column.ellipsis,
      align: column.align,
      component: CellComponent,
      prefixCls: prefixCls,
      key: cellIndex
    }, fixedInfo, {
      additionalProps: additionalProps
    }));

    if (measure) {
      cellNode = React.createElement(_rcResizeObserver.default, {
        key: cellIndex,
        onResize: function onResize(_ref2) {
          var width = _ref2.width;
          onColumnResize(cell.colStart, width);
        }
      }, cellNode);
    }

    return cellNode;
  }));
}

HeaderRow.displayName = 'HeaderRow';
var _default = HeaderRow;
exports.default = _default;