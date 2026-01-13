import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { TableHeadMW } from './TableHeadMW';
import { FormatedCell } from './FormatedCell';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const TableMW = ({ data = [], columns = [], selected, setSelected, options = {} }) => {
  const [order, setOrder] = useState(options.orderRow || 'asc');
  const [orderBy, setOrderBy] = useState(options.rowOrder || columns[0]?.field || null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(options.pageSize || 5);
  const { showMultiSelect } = options;
  const tableFields = columns.filter(elem => !elem.hidden).map(elem => elem.field);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id || null);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    if (showMultiSelect) {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setSelected(newSelected);
    } else {
      setSelected([]);
      let newSelected = [id];
      setSelected(newSelected);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const visibleRows = useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, data],
  );

  const propsToTablePagination = {
    rowsPerPageOptions: options.rowsPerPageOptions || [5, 10, 25],
    component: "div",
    count: data.length,
    rowsPerPage: rowsPerPage,
    page: page,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table
          sx={{ minWidth: 750, borderCollapse: 'separate', border: '1px solid rgb(236, 236, 236)' }}
          aria-labelledby="tableTitle"
          size='small'
          stickyHeader
        >
          <TableHeadMW
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            columns={columns}
            showMultiSelect={showMultiSelect}
          />
          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  {showMultiSelect && (<TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      onClick={(event) => handleClick(event, row.id)}
                      checked={isItemSelected}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  </TableCell>)}
                  {
                    tableFields.map((elem, keyCol) => {
                      let dataColumn = columns.find(item => item.field === elem);
                      const { pinning, pinningDirection, pinningPosition, style } = dataColumn;
                      let cellStyle = {};
                      style && (cellStyle = {...style})
                      if (pinning) cellStyle = {...cellStyle, position: 'sticky', background: '#F5F7FA', zIndex: 9 };
                      if (pinning && pinningDirection == 'left') cellStyle.left = `${pinningPosition}px`;
                      if (pinning && pinningDirection == 'right') cellStyle.right = `${pinningPosition}px`;
                      if (elem !== 'actions' && !dataColumn.type) return (
                      <TableCell key={`${index}-${keyCol}`} style={{ ...cellStyle }} component="th" scope='row' >
                        {
                        row[elem]
                        }
                      </TableCell>)
                      if(elem!=='actions' && dataColumn.type)return(
                        <FormatedCell key={`${index}-${keyCol}`}  value= {row[elem]} style={{...cellStyle}} dataColumn={dataColumn} />
                      )
                      return (
                        <TableCell key={`${index}-${keyCol}`} style={{ ...cellStyle }}>
                          <>
                            {dataColumn.getActions({ row })}
                          </>
                        </TableCell>)
                    })
                  }
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination {...propsToTablePagination} />
    </Box>
  );
}