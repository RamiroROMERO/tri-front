import React, { useEffect, useState } from 'react'
import { request } from 'app/utils/core';
import { roundTwoDecimals, validFloat } from 'app/utils/helpers';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Edit, Paid } from '@mui/icons-material';
import { Icon } from '@mui/material';

export const useModalRates = ({ t, setLoading, employeeId, employeeName }) => {
  const [tableData, setTableData] = useState([]);
  const [currentItemRate, setCurrentItemRate] = useState({});
  const [openModalEditRate, setOpenModalEditRate] = useState(false);
  const [openModalViewRates, setOpenModalViewRates] = useState(false);

  const fnGetData = () => {
    setLoading(true);
    request.GET(`/employeeCustomers?employeeId=${employeeId}`, (resp) => {
      const data = resp.employeeCustomers.map((item) => {
        item.rate = validFloat(item.rate).toFixed(4)
        item.rateOvertime = validFloat(item.rateOvertime).toFixed(4)
        item.rateInvoice = validFloat(item.rateInvoice).toFixed(4)
        item.rateInvoiceOvertime = validFloat(item.rateInvoiceOvertime).toFixed(4)
        item.payPerdiem = validFloat(item.payPerdiem).toFixed(4)
        item.invoicePerdiem = validFloat(item.invoicePerdiem).toFixed(4)
        item.customerName = item.customer?.name || ''
        item.fixedPerdiemIcon = item.fixedPerdiem == 1 ? "check_box" : "check_box_outline_blank"
        item.delRecordIcon = item.delRecord == 1 ? "check_box" : "check_box_outline_blank"
        item.statusIcon = item.status == 1 ? "check_box" : "check_box_outline_blank"
        return item;
      });
      setTableData(data);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnNewDocto = () => {
    setCurrentItemRate({});
    setOpenModalEditRate(true);
  }

  const fnEditDocto = (item) => {
    setCurrentItemRate(item);
    setOpenModalEditRate(true);
  }

  const fnViewRatesHistory = (item) => {
    setCurrentItemRate(item);
    setOpenModalViewRates(true);
  }

  const table = {
    title: t("table.rates.title"),
    columns: [
      { field: 'customerName', headerName: t('table.common.customer'), flex: 1 },
      { field: 'rate', headerName: t('table.activeEmployees.column.payRate'), flex: 0.5 },
      { field: 'rateOvertime', headerName: t('table.payrolls.column.overtimeRate'), flex: 0.5 },
      { field: 'rateInvoice', headerName: t('table.employees.column.rateInvoice'), flex: 0.5 },
      { field: 'rateInvoiceOvertime', headerName: t('table.employees.column.rateInvoiceOvertime'), flex: 0.5 },
      {
        field: 'statusIcon',
        headerName: t("table.common.status"),
        sortable: false,
        flex: 0.3,
        renderCell: ({ row, field }) => {
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {
        field: 'delRecordIcon',
        headerName: t("table.employees.column.deleted"),
        sortable: false,
        flex: 0.3,
        renderCell: ({ row, field }) => {
          return (<Icon>{row[field]}</Icon>)
        }
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
            onClick={() => fnEditDocto(row)}
            color='warning'
          />,
          <GridActionsCellItem
            icon={<Paid />}
            label={t("action.viewHistoryRates")}
            onClick={() => fnViewRatesHistory(row)}
            color='info'
          />
        ],
      },
    ],
    data: tableData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    },
    freeActions: [{
      Icon: () => <Add />,
      label: t("datatable.buttons.newDocument"),
      onClick: fnNewDocto
    }],
  };

  useEffect(() => {
    fnGetData();
  }, []);

  return (
    {
      table,
      openModalEditRate,
      setOpenModalEditRate,
      openModalViewRates,
      setOpenModalViewRates,
      currentItemRate,
      fnGetData
    }
  )
}
