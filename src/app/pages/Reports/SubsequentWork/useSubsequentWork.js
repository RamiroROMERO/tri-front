import { ImportExport } from '@mui/icons-material';
import { request } from 'app/utils/core';
import React, { useState } from 'react'

export const useSubsequentWork = ({ t, tableData }) => {

  const table = {
    title: t("table.subsequenceWork.title"),
    columns: [
      { field: 'code', headerName: t('input.code'), flex: 0.5 },
      { field: 'name', headerName: t('input.name'), flex: 0.8 },
      { field: 'classification', headerName: t('table.invoiceDetail.textField.classification'), flex: 0.5 },
      { field: 'prevProject', headerName: t('table.dailiesPayrolls.column.prevProject'), flex: 0.5 },
      { field: 'prevHours', headerName: t('table.dailiesPayrolls.column.prevWeek'), flex: 0.5 },
      { field: 'currProject', headerName: t('table.dailiesPayrolls.column.currentProject'), flex: 0.5 },
      { field: 'currHours', headerName: t('table.dailiesPayrolls.column.currentWeek'), flex: 0.5 }
    ],
    data: tableData,
    // freeActions: [{
    //   Icon: () => <ImportExport />,
    //   label: t("action.exportToExcel"),
    //   onClick: fnExportToXLSX,
    //   color: 'primary',
    // }],
    options: {
      pageSize: 20,
      rowsPerPageOptions: [20, 40, 60, 80]
    }
  };


  return {
    table
  }
}
