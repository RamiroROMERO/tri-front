import React, { useEffect, useState } from 'react'
import { PriceCheck } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { request } from 'app/utils/core';
import { currencyFormatter } from 'app/utils/helpers';

export const useModalDetail = ({t, setLoading, currentItem}) => {
  const [currentItemDeta, setCurrentItemDeta] = useState({});
  const [tableData, setTableData] = useState([]);
  const [openModalValuePay, setOpenModalValuePay] = useState(false);

  const fnGetDataDetail = ()=>{
    setLoading(true);
    request.GET(`/inventory/cxp?providerId=${currentItem.providerId}`, (resp)=>{
      const data= resp.data;
      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnApplyPay = (item)=>{
    setCurrentItemDeta(item);
    setOpenModalValuePay(true);
  }

  const table = {
    title: '',
    columns: [
      {
        field: 'purchaseNumber',
        headerName: t("table.accountsPayable.detail.noInvoice"),
        flex: 0.7
      },
      {
        field: 'dateIn',
        headerName: t("table.common.dateIn"),
        flex: 0.5
      },
      {
        field: 'dateOut',
        headerName: t("table.common.dateOut"),
        flex: 0.5
      },
      {
        field: 'value',
        headerName: t("table.accountsPayable.detail.valueInvoice"),
        flex: 0.5,
        type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'payment',
        headerName: t("table.accountsPayable.detail.valuePaid"),
        flex: 0.5,
        type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'rest',
        headerName: t("table.accountsPayable.detail.valuePending"),
        flex: 0.5,
        type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 90,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<PriceCheck />}
            label={t("button.details")}
            onClick={() => fnApplyPay(row)}
            color='info'
          />
        ],
      },
    ],
    data: tableData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  }

  useEffect(()=>{
    fnGetDataDetail();
  },[]);

  return (
    {
      table,
      currentItemDeta,
      openModalValuePay,
      setOpenModalValuePay,
      fnGetDataDetail
    }
  )
}
