import { Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { currencyFormatter } from 'app/utils/helpers';
import React, { useState } from 'react'

export const usePerdiems = ({ setLoading, sweetAlerts, t }) => {

  const [tableData, setTableData] = useState([]);

  const [rowSelected, setRowSelected] = useState({});

  const fnEditRates = (row) => {

  };

  const validDeleteItem = () => {

  }

  const deleteItem = (row) => {

    setRowSelected(row);

  }

  const table = {
    title: t("sidebar.menu.perdiems"),
    columns: [
      { field: 'employeeName', headerName: t('table.adjustmentsForSalaryChange.column.employeeName'), flex: 1 },
      { field: 'classificationName', headerName: t('table.paymentHistory.column.classificationName'), flex: 0.4 },
      { field: 'fixedPerdiem', headerName: t('table.payrolls.column.fixedPerdiem'), flex: 0.2 },
      { field: 'daysWork', headerName: t('table.adjustmentsForSalaryChange.column.daysWork'), flex: 0.4 },
      { field: 'qtyPerdiem', headerName: t('modal.payroll.detail.qtyPerdiem'), flex: 0.4 },
      { field: 'payrollPerdiem', headerName: t('table.common.payrollPerDiem'), flex: 0.4 },
      { field: 'invoicePerdiem', headerName: t('table.common.invoicePerDiem'), flex: 0.4 },
      {
        field: 'total', headerName: t('table.common.total'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 90,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnGetInvoiceQbk(row)}
            color='info'
          />
        ],
      }
    ],
    data: tableData,
    options: {
      pageSize: 20,
      rowsPerPageOptions: [20, 40, 60, 80]
    }
  };

  return {
    setTableData,
    table
  }

}
