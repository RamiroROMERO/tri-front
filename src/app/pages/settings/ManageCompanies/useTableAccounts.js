import React, { useState, useEffect } from 'react'
import { Add, Delete, Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Icon } from '@mui/material';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useTableAccounts = ({setLoading, sweetAlerts, t, controlAdmin, companyId}) => {
  const [tableData, setTableData] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [openModalAddAccount, setOpenModalAddAcount] = useState(false);
  const [openModalEditAccount, setOpenModalEditAccount] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);

  const fnGetData = ()=>{
    setLoading(true);
    request.GET(`/qbAccounts?companyId=${companyId}`, (resp)=>{
      const data= resp.QBAccounts.map((item)=>{
        item.statusIcon = item.status == 1 ? "check_box" : "check_box_outline_blank"
        return item;
      });
      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnEditDocto = (item)=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setOpenModalEditAccount(true);
  }

  const fnDeleteDocto = (item)=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setOpenMsgDelete(true);
  }

  const fnOkDelete = ()=>{
    if(validInt(currentItem.id)<=0){
      return;
    }
    setLoading(true);
    request.DELETE(`/qbAccounts`, resp=>{
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
    },{id: currentItem.id});
  }

  const fnNewDocto = ()=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem({});
    setOpenModalAddAcount(true);
  }

  const [table, setTable] = useState({
    title: t('table.manageCompanies.title'),
      columns: [
        {field: 'name', headerName: t('table.common.name'), flex: 1},
        {field: 'email', headerName: t('table.manageCompanies.column.email'), flex: 0.8},
        {field: 'type', headerName: t('table.manageCompanies.column.type'), flex: 0.7},
        {field: 'statusIcon', headerName: t('table.common.status'), flex: 0.3,
          renderCell: ({row, field})=>{
            return (<Icon>{row[field]}</Icon>)
          }
        },
        {
          field: 'actions',
          type: 'actions',
          headerName: t("table.common.actions"),
          width: 100,
          getActions: ({ row }) => [
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
        }
      ],
      data: [],
      freeActions: [{
        Icon: () => <Add />,
        label: t("datatable.buttons.newDocument"),
        onClick: fnNewDocto
      }],
      options: {
        pageSize: 10,
        rowsPerPageOptions: [10, 20, 30, 50]
      }
  });

  useEffect(()=>{
    fnGetData();
  },[]);

  useEffect(()=>{
    setTable({...table, data: tableData});
  },[tableData]);

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDelete
  }

  return (
    {
      table,
      propsToModalConfirm,
      currentItem,
      openModalAddAccount,
      setOpenModalAddAcount,
      openModalEditAccount,
      setOpenModalEditAccount,
      fnGetData
    }
  )
}
