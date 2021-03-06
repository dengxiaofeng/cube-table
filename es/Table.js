function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * Feature:
 *  - fixed not need to set width
 *  - support `rowExpandable` to config row expand logic
 *  - add `summary` to support `() => ReactNode`
 *
 * Update:
 *  - `dataIndex` is `array[]` now
 *  - `expandable` wrap all the expand related props
 *
 * Removed:
 *  - expandIconAsCell
 *  - useFixedHeader
 *  - rowRef
 *  - columns[number].onCellClick
 *  - onRowClick
 *  - onRowDoubleClick
 *  - onRowMouseEnter
 *  - onRowMouseLeave
 *  - getBodyWrapper
 *  - bodyStyle
 *
 * Deprecated:
 *  - All expanded props, move into expandable
 */
import * as React from 'react';
import classNames from 'classnames';
import warning from "rc-util/es/warning";
import ResizeObserver from 'rc-resize-observer';
import getScrollBarSize from "rc-util/es/getScrollBarSize";
import ColumnGroup from './sugar/ColumnGroup';
import Column from './sugar/Column';
import FixedHeader from './Header/FixedHeader';
import Header from './Header/Header';
import TableContext from './context/TableContext';
import BodyContext from './context/BodyContext';
import Body from './Body';
import useColumns from './hooks/useColumns';
import { useFrameState, useTimeoutLock } from './hooks/useFrame';
import { getPathValue, mergeObject, validateValue, newArr } from './utils/valueUtil';
import ResizeContext from './context/ResizeContext';
import useStickyOffsets from './hooks/useStickyOffsets';
import ColGroup from './ColGroup';
import { getExpandableProps, getDataAndAriaProps } from './utils/legacyUtil';
import Panel from './Panel';
import Footer from './Footer';
import { findAllChildrenKeys, renderExpandIcon } from './utils/expandUtil'; // Used for conditions cache

var EMPTY_DATA = []; // Used for customize scroll

var EMPTY_SCROLL_TARGET = {};
export var INTERNAL_HOOKS = 'rc-table-internal-hook';

function Table(props) {
  var _classNames;

  var prefixCls = props.prefixCls,
      className = props.className,
      rowClassName = props.rowClassName,
      style = props.style,
      data = props.data,
      rowKey = props.rowKey,
      scroll = props.scroll,
      tableLayout = props.tableLayout,
      title = props.title,
      footer = props.footer,
      summary = props.summary,
      id = props.id,
      showHeader = props.showHeader,
      components = props.components,
      emptyText = props.emptyText,
      onRow = props.onRow,
      onHeaderRow = props.onHeaderRow,
      internalHooks = props.internalHooks,
      transformColumns = props.transformColumns,
      internalRefs = props.internalRefs;
  var mergedData = data || EMPTY_DATA;
  var hasData = !!mergedData.length; // ===================== Effects ======================

  var _React$useState = React.useState(0),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      scrollbarSize = _React$useState2[0],
      setScrollbarSize = _React$useState2[1];

  React.useEffect(function () {
    setScrollbarSize(getScrollBarSize());
  }); // ===================== Warning ======================

  if (process.env.NODE_ENV !== 'production') {
    ['onRowClick', 'onRowDoubleClick', 'onRowContextMenu', 'onRowMouseEnter', 'onRowMouseLeave'].forEach(function (name) {
      warning(props[name] === undefined, "`".concat(name, "` is removed, please use `onRow` instead."));
    });
    warning(!('getBodyWrapper' in props), '`getBodyWrapper` is deprecated, please use custom `components` instead.');
  } // ==================== Customize =====================


  var mergedComponents = React.useMemo(function () {
    return mergeObject(components, {});
  }, [components]);
  var getComponent = React.useCallback(function (path, defaultComponent) {
    return getPathValue(mergedComponents, path) || defaultComponent;
  }, [mergedComponents]);
  var getRowKey = React.useMemo(function () {
    if (typeof rowKey === 'function') {
      return rowKey;
    }

    return function (record) {
      var key = record[rowKey];

      if (process.env.NODE_ENV !== 'production') {
        warning(key !== undefined, 'Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.');
      }

      return key;
    };
  }, [rowKey]); // ====================== Expand ======================

  var expandableConfig = getExpandableProps(props);
  var expandIcon = expandableConfig.expandIcon,
      expandedRowKeys = expandableConfig.expandedRowKeys,
      defaultExpandedRowKeys = expandableConfig.defaultExpandedRowKeys,
      defaultExpandAllRows = expandableConfig.defaultExpandAllRows,
      expandedRowRender = expandableConfig.expandedRowRender,
      onExpand = expandableConfig.onExpand,
      onExpandedRowsChange = expandableConfig.onExpandedRowsChange,
      expandRowByClick = expandableConfig.expandRowByClick,
      rowExpandable = expandableConfig.rowExpandable,
      expandIconColumnIndex = expandableConfig.expandIconColumnIndex,
      expandedRowClassName = expandableConfig.expandedRowClassName,
      childrenColumnName = expandableConfig.childrenColumnName,
      indentSize = expandableConfig.indentSize;
  var mergedExpandIcon = expandIcon || renderExpandIcon;
  var mergedChildrenColumnName = childrenColumnName || 'children';
  var expandableType = React.useMemo(function () {
    if (expandedRowRender) {
      return 'row';
    }

    if (mergedData.some(function (record) {
      return mergedChildrenColumnName in record;
    })) {
      return 'nest';
    }

    return false;
  }, [!!expandedRowRender, mergedData]);

  var _React$useState3 = React.useState(function () {
    if (defaultExpandedRowKeys) {
      return defaultExpandedRowKeys;
    }

    if (defaultExpandAllRows) {
      return findAllChildrenKeys(mergedData, getRowKey);
    }

    return [];
  }),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      innerExpandedKeys = _React$useState4[0],
      setInnerExpandedKeys = _React$useState4[1];

  var mergedExpandedKeys = React.useMemo(function () {
    return new Set(expandedRowKeys || innerExpandedKeys || []);
  }, [expandedRowKeys, innerExpandedKeys]);
  var onTriggerExpand = React.useCallback(function (record) {
    var key = getRowKey(record, mergedData.indexOf(record));
    var newExpandedKeys;
    var hasKey = mergedExpandedKeys.has(key);

    if (hasKey) {
      mergedExpandedKeys.delete(key);
      newExpandedKeys = _toConsumableArray(mergedExpandedKeys);
    } else {
      newExpandedKeys = [].concat(_toConsumableArray(mergedExpandedKeys), [key]);
    }

    setInnerExpandedKeys(newExpandedKeys);

    if (onExpand) {
      onExpand(!hasKey, record);
    }

    if (onExpandedRowsChange) {
      onExpandedRowsChange(newExpandedKeys);
    }
  }, [getRowKey, mergedExpandedKeys, mergedData, onExpand, onExpandedRowsChange]); // ====================== Column ======================

  var _React$useState5 = React.useState(0),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      componentWidth = _React$useState6[0],
      setComponentWidth = _React$useState6[1];

  var _useColumns = useColumns(_objectSpread({}, props, {}, expandableConfig, {
    expandable: !!expandedRowRender,
    expandedKeys: mergedExpandedKeys,
    getRowKey: getRowKey,
    onTriggerExpand: onTriggerExpand,
    expandIcon: mergedExpandIcon,
    expandIconColumnIndex: expandIconColumnIndex
  }), internalHooks === INTERNAL_HOOKS ? transformColumns : null),
      _useColumns2 = _slicedToArray(_useColumns, 2),
      columns = _useColumns2[0],
      flattenColumns = _useColumns2[1];

  var columnContext = {
    columns: columns,
    flattenColumns: flattenColumns
  }; // ====================== Scroll ======================

  var scrollHeaderRef = React.useRef();
  var scrollBodyRef = React.useRef();

  var _React$useState7 = React.useState(false),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      pingedLeft = _React$useState8[0],
      setPingedLeft = _React$useState8[1];

  var _React$useState9 = React.useState(false),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      pingedRight = _React$useState10[0],
      setPingedRight = _React$useState10[1];

  var _useFrameState = useFrameState(newArr(flattenColumns.length)),
      _useFrameState2 = _slicedToArray(_useFrameState, 2),
      colWidths = _useFrameState2[0],
      updateColWidths = _useFrameState2[1];

  var stickyOffsets = useStickyOffsets(colWidths, flattenColumns.length);
  var fixHeader = hasData && scroll && validateValue(scroll.y);
  var fixColumn = scroll && validateValue(scroll.x);
  var scrollXStyle;
  var scrollYStyle;
  var scrollTableStyle;

  if (fixHeader) {
    scrollYStyle = {
      overflowY: 'scroll',
      maxHeight: scroll.y
    };
  }

  if (fixColumn) {
    scrollXStyle = {
      overflowX: 'scroll'
    };
    scrollTableStyle = {
      width: scroll.x === true ? 'max-content' : scroll.x,
      minWidth: '100%'
    };
  }

  function onColumnResize(colIndex, width) {
    updateColWidths(function (widths) {
      var newWidth = widths.slice(0, flattenColumns.length);
      newWidth[colIndex] = width;
      return newWidth;
    });
  }

  var _useTimeoutLock = useTimeoutLock(null),
      _useTimeoutLock2 = _slicedToArray(_useTimeoutLock, 2),
      setScrollTarget = _useTimeoutLock2[0],
      getScrollTarget = _useTimeoutLock2[1];

  function forceScroll(scrollLeft, target) {
    /* eslint-disable no-param-reassign */
    if (target && target.scrollLeft !== scrollLeft) {
      target.scrollLeft = scrollLeft;
    }
    /* eslint-enable */

  }

  var onScroll = function onScroll(_ref) {
    var currentTarget = _ref.currentTarget,
        scrollLeft = _ref.scrollLeft;
    var mergedScrollLeft = typeof scrollLeft === 'number' ? scrollLeft : currentTarget.scrollLeft;
    var compareTarget = currentTarget || EMPTY_SCROLL_TARGET;

    if (!getScrollTarget() || getScrollTarget() === compareTarget) {
      setScrollTarget(compareTarget);
      forceScroll(mergedScrollLeft, scrollHeaderRef.current);
      forceScroll(mergedScrollLeft, scrollBodyRef.current);
    }

    if (currentTarget) {
      var scrollWidth = currentTarget.scrollWidth,
          clientWidth = currentTarget.clientWidth;
      setPingedLeft(mergedScrollLeft > 0);
      setPingedRight(mergedScrollLeft < scrollWidth - clientWidth);
    }
  };

  var triggerOnScroll = function triggerOnScroll() {
    if (scrollBodyRef.current) {
      onScroll({
        currentTarget: scrollBodyRef.current
      });
    }
  };

  var onFullTableResize = function onFullTableResize(_ref2) {
    var width = _ref2.width;
    triggerOnScroll();
    setComponentWidth(width);
  }; // Sync scroll bar when init or `fixColumn` changed


  React.useEffect(function () {
    return triggerOnScroll;
  }, []);
  React.useEffect(function () {
    if (fixColumn) {
      triggerOnScroll();
    }
  }, [fixColumn]); // ================== INTERNAL HOOKS ==================

  React.useEffect(function () {
    if (internalHooks === INTERNAL_HOOKS && internalRefs) {
      internalRefs.body.current = scrollBodyRef.current;
    }
  }); // ====================== Render ======================

  var TableComponent = getComponent(['table'], 'table'); // Table layout

  var mergedTableLayout = React.useMemo(function () {
    if (tableLayout) {
      return tableLayout;
    }

    if (fixHeader || fixColumn || flattenColumns.some(function (_ref3) {
      var ellipsis = _ref3.ellipsis;
      return ellipsis;
    })) {
      return 'fixed';
    }

    return 'auto';
  }, [fixHeader, fixColumn, flattenColumns, tableLayout]);
  var groupTableNode; // Header props

  var headerProps = {
    colWidths: colWidths,
    columCount: flattenColumns.length,
    stickyOffsets: stickyOffsets,
    onHeaderRow: onHeaderRow
  }; // Empty

  var emptyNode = React.useMemo(function () {
    if (hasData) {
      return null;
    }

    if (typeof emptyText === 'function') {
      return emptyText();
    }

    return emptyText;
  }, [hasData, emptyText]); // Body

  var bodyTable = React.createElement(Body, {
    data: mergedData,
    measureColumnWidth: fixHeader || fixColumn,
    stickyOffsets: stickyOffsets,
    expandedKeys: mergedExpandedKeys,
    rowExpandable: rowExpandable,
    getRowKey: getRowKey,
    onRow: onRow,
    emptyNode: emptyNode,
    childrenColumnName: mergedChildrenColumnName
  });
  var bodyColGroup = React.createElement(ColGroup, {
    colWidths: flattenColumns.map(function (_ref4) {
      var width = _ref4.width;
      return width;
    }),
    columns: flattenColumns
  });
  var footerTable = summary && React.createElement(Footer, null, summary(mergedData));
  var customizeScrollBody = getComponent(['body']);

  if (process.env.NODE_ENV !== 'production' && typeof customizeScrollBody === 'function' && hasData && !fixHeader) {
    warning(false, '`components.body` with render props is only work on `scroll.y`.');
  }

  if (fixHeader) {
    var bodyContent;

    if (typeof customizeScrollBody === 'function') {
      bodyContent = customizeScrollBody(mergedData, {
        scrollbarSize: scrollbarSize,
        ref: scrollBodyRef,
        onScroll: onScroll
      });
      headerProps.colWidths = flattenColumns.map(function (_ref5, index) {
        var width = _ref5.width;
        var colWidth = index === columns.length - 1 ? width - scrollbarSize : width;

        if (typeof colWidth === 'number' && !Number.isNaN(colWidth)) {
          return colWidth;
        }

        warning(false, 'When use `components.body` with render props. Each column should have a fixed value.');
        return 0;
      });
    } else {
      bodyContent = React.createElement("div", {
        style: _objectSpread({}, scrollXStyle, {}, scrollYStyle),
        onScroll: onScroll,
        ref: scrollBodyRef,
        className: classNames("".concat(prefixCls, "-body"))
      }, React.createElement(TableComponent, {
        style: _objectSpread({}, scrollTableStyle, {
          tableLayout: mergedTableLayout
        })
      }, bodyColGroup, bodyTable, footerTable));
    }

    groupTableNode = React.createElement(React.Fragment, null, showHeader !== false && React.createElement("div", {
      style: _objectSpread({}, scrollXStyle, {
        marginBottom: fixColumn ? -scrollbarSize : null
      }),
      onScroll: onScroll,
      ref: scrollHeaderRef,
      className: classNames("".concat(prefixCls, "-header"))
    }, React.createElement(FixedHeader, Object.assign({}, headerProps, columnContext))), bodyContent);
  } else {
    groupTableNode = React.createElement("div", {
      style: _objectSpread({}, scrollXStyle, {}, scrollYStyle),
      className: classNames("".concat(prefixCls, "-content")),
      onScroll: onScroll,
      ref: scrollBodyRef
    }, React.createElement(TableComponent, {
      style: _objectSpread({}, scrollTableStyle, {
        tableLayout: mergedTableLayout
      })
    }, bodyColGroup, showHeader !== false && React.createElement(Header, Object.assign({}, headerProps, columnContext, {
      measureColumnWidth: !hasData && fixColumn
    })), bodyTable, footerTable));
  }

  var ariaProps = getDataAndAriaProps(props);
  var fullTable = React.createElement("div", Object.assign({
    className: classNames(prefixCls, className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-ping-left"), pingedLeft), _defineProperty(_classNames, "".concat(prefixCls, "-ping-right"), pingedRight), _defineProperty(_classNames, "".concat(prefixCls, "-layout-fixed"), tableLayout === 'fixed'), _defineProperty(_classNames, "".concat(prefixCls, "-fixed-header"), fixHeader), _defineProperty(_classNames, "".concat(prefixCls, "-fixed-column"), fixColumn), _defineProperty(_classNames, "".concat(prefixCls, "-has-fix-left"), flattenColumns[0] && flattenColumns[0].fixed), _defineProperty(_classNames, "".concat(prefixCls, "-has-fix-right"), flattenColumns[flattenColumns.length - 1] && flattenColumns[flattenColumns.length - 1].fixed === 'right'), _classNames)),
    style: style,
    id: id
  }, ariaProps), title && React.createElement(Panel, {
    className: "".concat(prefixCls, "-title")
  }, title(mergedData)), React.createElement("div", {
    className: "".concat(prefixCls, "-container")
  }, groupTableNode), footer && React.createElement(Panel, {
    className: "".concat(prefixCls, "-footer")
  }, footer(mergedData)));

  if (fixColumn) {
    fullTable = React.createElement(ResizeObserver, {
      onResize: onFullTableResize
    }, fullTable);
  }

  return React.createElement(TableContext.Provider, {
    value: {
      prefixCls: prefixCls,
      getComponent: getComponent,
      scrollbarSize: scrollbarSize
    }
  }, React.createElement(BodyContext.Provider, {
    value: _objectSpread({}, columnContext, {
      tableLayout: mergedTableLayout,
      rowClassName: rowClassName,
      expandedRowClassName: expandedRowClassName,
      componentWidth: componentWidth,
      fixHeader: fixHeader,
      fixColumn: fixColumn,
      expandIcon: mergedExpandIcon,
      expandableType: expandableType,
      expandRowByClick: expandRowByClick,
      expandedRowRender: expandedRowRender,
      onTriggerExpand: onTriggerExpand,
      expandIconColumnIndex: expandIconColumnIndex,
      indentSize: indentSize
    })
  }, React.createElement(ResizeContext.Provider, {
    value: {
      onColumnResize: onColumnResize
    }
  }, fullTable)));
}

Table.Column = Column;
Table.ColumnGroup = ColumnGroup;
Table.defaultProps = {
  rowKey: 'key',
  prefixCls: 'rc-table',
  emptyText: function emptyText() {
    return 'No Data';
  }
};
export default Table;