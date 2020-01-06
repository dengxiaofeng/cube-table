import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import { getCellFixedInfo } from '../utils/fixUtil';
import ResizeContext from '../context/ResizeContext';

function HeaderRow(_ref) {
  var cells = _ref.cells,
      stickyOffsets = _ref.stickyOffsets,
      flattenColumns = _ref.flattenColumns,
      RowComponent = _ref.rowComponent,
      CellComponent = _ref.cellComponent,
      onHeaderRow = _ref.onHeaderRow,
      index = _ref.index;

  var _React$useContext = React.useContext(TableContext),
      prefixCls = _React$useContext.prefixCls;

  var _React$useContext2 = React.useContext(ResizeContext),
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
    var fixedInfo = getCellFixedInfo(cell.colStart, cell.colEnd, flattenColumns, stickyOffsets);
    var additionalProps;

    if (column && column.onHeaderCell) {
      additionalProps = cell.column.onHeaderCell(column);
    }

    var cellNode = React.createElement(Cell, Object.assign({}, cell, {
      ellipsis: column.ellipsis,
      align: column.align,
      component: CellComponent,
      prefixCls: prefixCls,
      key: cellIndex
    }, fixedInfo, {
      additionalProps: additionalProps
    }));

    if (measure) {
      cellNode = React.createElement(ResizeObserver, {
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
export default HeaderRow;