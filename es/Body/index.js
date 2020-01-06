import * as React from 'react';
import BodyRow from './BodyRow';
import TableContext from '../context/TableContext';
import ExpandedRow from './ExpandedRow';
import BodyContext from '../context/BodyContext';

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

  var _React$useContext = React.useContext(TableContext),
      prefixCls = _React$useContext.prefixCls,
      getComponent = _React$useContext.getComponent;

  var _React$useContext2 = React.useContext(BodyContext),
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
        return [React.createElement(BodyRow, {
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
      rows = React.createElement(ExpandedRow, {
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
export default MemoBody;