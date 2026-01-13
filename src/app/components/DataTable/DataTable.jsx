import { useState } from 'react'
import { TableMW } from './TableMW'
import { HeaderDataTable } from './HeaderDataTable'
import { useEffect } from 'react';

export const DataTable = ({ title = '', columns = [], data = [], options = {}, freeActions = [], selectedRows = undefined, setSelectedRows = undefined }) => {

  const [dataSearch, setDataSearch] = useState(data);
  const [countDataSearch, setCountDataSearch] = useState(0);
  const [selectedIntRows, setSelectedIntRows] = useState([]);
  const [tableColumns, setTableColumns] = useState(columns.map(elem => { !elem.hidden && (elem.hidden = false); return elem; }))
  const [fieldsToSearch, setFieldsToSearch] = useState(columns.map(item => item.field));

  const changeColumns = (field) => {

    columns = columns.map(elem => {
      if (elem.field === field) {
        elem.hidden = !elem.hidden
      }
      return elem;
    });
    setTableColumns(columns.filter(item => !item.hidden));
  }

  const propsToHeaderDataTable = {
    title,
    data,
    columns: columns,
    changeColumns,
    fieldsToSearch,
    setDataSearch,
    setCountDataSearch,
    freeActions,
    buttonShowHideColumns: options.showHideColumns || false
  };

  const propsToTable = {
    data: dataSearch,
    columns: tableColumns,
    showMultiSelect: false,
    selected: selectedRows || selectedIntRows,
    setSelected: setSelectedRows || setSelectedIntRows,
    options
  };

  useEffect(() => {
    changeColumns();
    setFieldsToSearch(columns.map(item => item.field))
  }, [columns])

  useEffect(() => {
    if (options.showHideColumns) {
      columns = columns.map(elem => {
        if (!elem.hidden) {
          elem.hidden = false;
        }
        return elem;
      });
    }
  }, []);

  useEffect(() => {
    setDataSearch(data);
  }, [data]);

  return (
    <>
      <HeaderDataTable {...propsToHeaderDataTable} />
      <TableMW {...propsToTable} />
    </>

  )
}
