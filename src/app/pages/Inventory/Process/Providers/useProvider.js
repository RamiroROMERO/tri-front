import React, { useEffect, useState } from 'react'
import { AccountBalanceWallet, Add, Delete, Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { request } from 'app/utils/core';
import { Icon } from '@mui/material';
import { validInt } from 'app/utils/helpers';

export const useProvider = ({setLoading, sweetAlerts}) => {
  const {t} = useTranslation();
  const [currentItem, setCurrentItem] = useState({});
  const [tableData, setTableData] = useState([]);
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);

  const fnGetData = ()=>{
    setLoading(true);
    request.GET('/inventory/providers', (resp)=>{
      const data= resp.data.map((item)=>{
        item.statusIcon = (item.status === 1 || item.status === true) ? "check_box" : "check_box_outline_blank"
        return item;
      });
      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnCreateNewDocto = ()=>{
    setCurrentItem({});
    setOpenModalNew(true);
  }

  const fnEditDocto = (item)=>{
    setCurrentItem(item);
    setOpenModalNew(true);
  }

  const fnDeleteDocto = (item)=>{
    setCurrentItem(item);
    setOpenMsgDelete(true);
  }

  const fnOkDelete = ()=>{
    if(validInt(currentItem.id)<=0){
      return;
    }
    setLoading(true);
    request.DELETE(`/inventory/providers/${currentItem.id}`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetData();
      setLoading(false);
    }, err=>{
      const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
      setLoading(false);
    });
  }

  const fnAddBankAccounts = ()=>{}

  const table = {
    title: t("table.providers.title"),
    columns: [
      { field: 'dni', headerName: t("table.providers.column.dni"), width: 5, flex: 0.7 },
      {
        field: 'name',
        headerName: t("table.common.name"),
        flex: 1.4,
      },
      {
        field: 'phone',
        headerName: t("table.providers.column.phone"),
        flex: 0.5,
      },
      {
        field: 'address',
        headerName: t("table.providers.column.address"),
        flex: 1,
      },
      {
        field: 'statusIcon',
        headerName: t("table.common.status"),
        sortable: false,
        flex: 0.3,
        renderCell: ({row, field})=>{
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
        getActions: ({ row }) => [
          // <GridActionsCellItem
          //   icon={<AccountBalanceWallet />}
          //   label= {t("button.addBanksAccounts")}
          //   onClick={() => fnAddBankAccounts(row)}
          //   showInMenu
          // />,
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnEditDocto(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label= {t("button.delete")}
            onClick={() => fnDeleteDocto(row)}
            color='error'
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
      onClick: fnCreateNewDocto
    }]
  }

  useEffect(()=>{
    fnGetData();
  }, []);

  return (
    {
      table,
      openModalNew,
      setOpenModalNew,
      openMsgDelete,
      setOpenMsgDelete,
      fnOkDelete,
      fnGetData,
      currentItem
    }
  )
}
