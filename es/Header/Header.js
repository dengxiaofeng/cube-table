import * as React from 'react';
import HeaderRow from './HeaderRow';
import TableContext from '../context/TableContext';

function parseHeaderRows(rootColumns, measureColumnWidth) {
  var rows = []; // Record which cell should wrapped with resize observer used for fixed

  var measureCells = [];

  function fillRowCells(columns, colIndex) {
    var rowIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    // Init rows
    rows[rowIndex] = rows[rowIndex] || [];
    var currentColIndex = colIndex;
    var colSpans = columns.map(function (column) {
      var cell = {
        key: column.key,
        className: column.className || '',
        children: column.title,
        column: column,
        colStart: currentColIndex
      };
      var colSpan = 1;

      if ('children' in column) {
        colSpan = fillRowCells(column.children, currentColIndex, rowIndex + 1).reduce(function (total, count) {
          return total + count;
        }, 0);
        cell.hasSubColumns = true;
      }

      if ('colSpan' in column) {
        colSpan = column.colSpan;
      }

      if ('rowSpan' in column) {
        cell.rowSpan = column.rowSpan;
      }

      cell.colSpan = colSpan;
      cell.colEnd = cell.colStart + colSpan - 1;
      rows[rowIndex].push(cell);
      currentColIndex += colSpan; // Measure only happen on single node

      if (measureColumnWidth && colSpan === 1 && !measureCells[cell.colStart]) {
        cell.measure = true;
        measureCells[cell.colStart] = true;
      }

      return colSpan;
    });
    return colSpans;
  } // Generate `rows` cell data


  fillRowCells(rootColumns, 0); // Handle `rowSpan`

  var rowCount = rows.length;

  var _loop = function _loop(rowIndex) {
    rows[rowIndex].forEach(function (cell) {
      if (!('rowSpan' in cell) && !cell.hasSubColumns) {
        // eslint-disable-next-line no-param-reassign
        cell.rowSpan = rowCount - rowIndex;
      }
    });
  };

  for (var rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    _loop(rowIndex);
  }

  return rows;
}

function Header(_ref) {
  var stickyOffsets = _ref.stickyOffsets,
      columns = _ref.columns,
      flattenColumns = _ref.flattenColumns,
      measureColumnWidth = _ref.measureColumnWidth,
      onHeaderRow = _ref.onHeaderRow;

  var _React$useContext = React.useContext(TableContext),
      getComponent = _React$useContext.getComponent;

  var rows = React.useMemo(function () {
    return parseHeaderRows(columns, measureColumnWidth);
  }, [columns]);
  var WrapperComponent = getComponent(['header', 'wrapper'], 'thead');
  var trComponent = getComponent(['header', 'row'], 'tr');
  var thComponent = getComponent(['header', 'cell'], 'th');
  return React.createElement(WrapperComponent, null, rows.map(function (row, rowIndex) {
    var rowNode = React.createElement(HeaderRow, {
      key: rowIndex,
      flattenColumns: flattenColumns,
      cells: row,
      stickyOffsets: stickyOffsets,
      rowComponent: trComponent,
      cellComponent: thComponent,
      onHeaderRow: onHeaderRow,
      index: rowIndex
    });
    return rowNode;
  }));
}

export default Header;