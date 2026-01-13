import React, { useEffect, useState } from 'react'
import { request } from 'app/utils/core';
import { useTranslation } from 'react-i18next';
import { ListAlt } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { currencyFormatter } from 'app/utils/helpers';

export const useAccounts = ({setLoading}) => {
  const {t} = useTranslation();
  const [currentItem, setCurrentItem] = useState({});
  const [tableData, setTableData] = useState([]);
  const [openModalDetail, setOpenModalDetail] = useState(false);

  const fnGetData = ()=>{
    setLoading(true);
    request.GET('/inventory/cxp/getResume', (resp)=>{
      const data= resp.data.map((item)=>{
        item.id = item.providerId
        return item
      });
      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnViewDetail = (item)=>{
    setCurrentItem(item);
    setOpenModalDetail(true);
  }

  const table = {
    title: t("table.accountsPayable.title"),
    columns: [
      { field: 'providerCode', headerName: t("table.providers.column.dni"), flex: 0.6 },
      {
        field: 'providerName',
        headerName: t("table.common.provider"),
        flex: 1.5,
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
            icon={<ListAlt />}
            label={t("button.details")}
            onClick={() => fnViewDetail(row)}
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
    fnGetData();
  },[]);

  return (
    {
      table,
      currentItem,
      openModalDetail,
      setOpenModalDetail,
      fnGetData
    }
  )
}
