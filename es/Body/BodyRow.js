function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import * as React from 'react';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import BodyContext from '../context/BodyContext';
import { getColumnKey } from '../utils/valueUtil';
import ResizeContext from '../context/ResizeContext';
import { getCellFixedInfo } from '../utils/fixUtil';
import ExpandedRow from './ExpandedRow';

function BodyRow(props) {
  var className = props.className,
      style = props.style,
      stickyOffsets = props.stickyOffsets,
      record = props.record,
      index = props.index,
      getRowKey = props.getRowKey,
      rowExpandable = props.rowExpandable,
      onRow = props.onRow,
      _props$indent = props.indent,
      indent = _props$indent === void 0 ? 0 : _props$indent,
      RowComponent = props.rowComponent,
      cellComponent = props.cellComponent,
      measureColumnWidth = props.measureColumnWidth,
      childrenColumnName = props.childrenColumnName;

  var _React$useContext = React.useContext(TableContext),
      prefixCls = _React$useContext.prefixCls;

  var _React$useContext2 = React.useContext(BodyContext),
      fixHeader = _React$useContext2.fixHeader,
      fixColumn = _React$useContext2.fixColumn,
      componentWidth = _React$useContext2.componentWidth,
      flattenColumns = _React$useContext2.flattenColumns,
      expandableType = _React$useContext2.expandableType,
      expandRowByClick = _React$useContext2.expandRowByClick,
      onTriggerExpand = _React$useContext2.onTriggerExpand,
      rowClassName = _React$useContext2.rowClassName,
      expandedRowClassName = _React$useContext2.expandedRowClassName,
      indentSize = _React$useContext2.indentSize,
      expandIcon = _React$useContext2.expandIcon,
      expandedRowRender = _React$useContext2.expandedRowRender,
      expandIconColumnIndex = _React$useContext2.expandIconColumnIndex;

  var _React$useContext3 = React.useContext(ResizeContext),
      onColumnResize = _React$useContext3.onColumnResize;

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      expandRended = _React$useState2[0],
      setExpandRended = _React$useState2[1];

  var expanded = props.expandedKeys.has(props.recordKey);
  React.useEffect(function () {
    if (expanded) {
      setExpandRended(true);
    }
  }, [expanded]); // Move to Body to enhance performance

  var fixedInfoList = flattenColumns.map(function (column, colIndex) {
    return getCellFixedInfo(colIndex, colIndex, flattenColumns, stickyOffsets);
  });
  var rowSupportExpand = expandableType === 'row' && (!rowExpandable || rowExpandable(record)); // Only when row is not expandable and `children` exist in record

  var nestExpandable = expandableType === 'nest';
  var hasNestChildren = childrenColumnName in record && record[childrenColumnName];
  var mergedExpandable = rowSupportExpand || nestExpandable; // =========================== onRow ===========================

  var additionalProps;

  if (onRow) {
    additionalProps = onRow(record, index);
  }

  var onClick = function onClick(event) {
    if (expandRowByClick && mergedExpandable) {
      onTriggerExpand(record, event);
    }

    if (additionalProps && additionalProps.onClick) {
      var _additionalProps;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_additionalProps = additionalProps).onClick.apply(_additionalProps, [event].concat(args));
    }
  }; // ======================== Base tr row ========================


  var computeRowClassName;

  if (typeof rowClassName === 'string') {
    computeRowClassName = rowClassName;
  } else if (typeof rowClassName === 'function') {
    computeRowClassName = rowClassName(record, index, indent);
  }

  var baseRowNode = React.createElement(RowComponent, Object.assign({}, additionalProps, {
    className: classNames(className, "".concat(prefixCls, "-row"), "".concat(prefixCls, "-row-level-").concat(indent), computeRowClassName, additionalProps && additionalProps.className),
    style: _objectSpread({}, style, {}, additionalProps ? additionalProps.style : null),
    onClick: onClick
  }), flattenColumns.map(function (column, colIndex) {
    var render = column.render,
        dataIndex = column.dataIndex,
        columnClassName = column.className;
    var key = getColumnKey(column, colIndex);
    var fixedInfo = fixedInfoList[colIndex]; // ============= Used for nest expandable =============

    var appendCellNode;

    if (colIndex === (expandIconColumnIndex || 0) && nestExpandable) {
      appendCellNode = React.createElement(React.Fragment, null, React.createElement("span", {
        style: {
          paddingLeft: "".concat(indentSize * indent, "px")
        },
        className: "".concat(prefixCls, "-row-indent indent-level-").concat(indent)
      }), expandIcon({
        prefixCls: prefixCls,
        expanded: expanded,
        expandable: hasNestChildren,
        record: record,
        onExpand: onTriggerExpand
      }));
    }

    var additionalCellProps;

    if (column.onCell) {
      additionalCellProps = column.onCell(record, index);
    }

    var cellNode = React.createElement(Cell, Object.assign({
      className: columnClassName,
      ellipsis: column.ellipsis,
      align: column.align,
      component: cellComponent,
      prefixCls: prefixCls,
      key: key,
      record: record,
      index: index,
      dataIndex: dataIndex,
      render: render
    }, fixedInfo, {
      appendNode: appendCellNode,
      additionalProps: additionalCellProps
    }));

    if (measureColumnWidth) {
      return React.createElement(ResizeObserver, {
        key: key,
        onResize: function onResize(_ref) {
          var width = _ref.width;
          onColumnResize(colIndex, width);
        }
      }, cellNode);
    }

    return cellNode;
  })); // ======================== Expand Row =========================

  var expandRowNode;

  if (rowSupportExpand && (expandRended || expanded)) {
    var expandContent = expandedRowRender(record, index, indent + 1, expanded);
    var computedExpandedRowClassName = expandedRowClassName && expandedRowClassName(record, index, indent);
    expandRowNode = React.createElement(ExpandedRow, {
      expanded: expanded,
      className: classNames("".concat(prefixCls, "-expanded-row"), "".concat(prefixCls, "-expanded-row-level-").concat(indent + 1), computedExpandedRowClassName),
      prefixCls: prefixCls,
      fixHeader: fixHeader,
      fixColumn: fixColumn,
      component: RowComponent,
      componentWidth: componentWidth,
      cellComponent: cellComponent,
      colSpan: flattenColumns.length
    }, expandContent);
  } // ========================= Nest Row ==========================


  var nestRowNode;

  if (hasNestChildren && expanded) {
    debugger;
    nestRowNode = (record[childrenColumnName] || []).map(function (subRecord, subIndex) {
      var subKey = getRowKey(subRecord, subIndex);
      return React.createElement(BodyRow, Object.assign({}, props, {
        key: subKey,
        record: subRecord,
        recordKey: subKey,
        index: subIndex,
        indent: indent + 1,
        measureColumnWidth: false
      }));
    });
  }

  return React.createElement(React.Fragment, null, baseRowNode, expandRowNode, nestRowNode);
}

BodyRow.displayName = 'BodyRow';
export default BodyRow;