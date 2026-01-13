import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';


export const TableHeadMW = (props) => {
  const { showMultiSelect = false, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columns = [] } =
    props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <>
      <TableHead>
        <TableRow>
          {showMultiSelect && <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>}
          {columns.map((col) => {
            let cellStyle = {};
            if (col.pinning) cellStyle = { position: 'sticky', zIndex: 10, top: '0px' };
            if (col.pinning && col.pinningDirection == 'left') cellStyle.left = `${col.pinningPosition}px`;
            if (col.pinning && col.pinningDirection == 'right') cellStyle.right = `${col.pinningPosition}px`;
            cellStyle.minWidth = col.minWidth || null;
            return (
              <TableCell
                key={col.field}
                sortDirection={(orderBy === col.field && col.field !== 'actions') ? order : false}
                style={{ ...cellStyle }}
              >
                {col.field !== 'actions' ?
                  <TableSortLabel
                    active={orderBy === col.field}
                    direction={orderBy === col.field ? order : 'asc'}
                    onClick={createSortHandler(col.field)}
                  >
                    {col.headerName}
                    {orderBy === col.field ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel> : (col.headerName)}
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead>
    </>
  );
}

TableHeadMW.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};