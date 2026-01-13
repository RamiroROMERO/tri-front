import React, { useState } from 'react';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { Modal } from 'app/components/Modal';
import { Detail } from './Detail';
import { useEffect } from 'react';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Delete, Edit } from '@mui/icons-material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Card, CardContent } from '@mui/material';

const Content = ({ setLoading, sweetAlerts, controlAdmin }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [dataForTable, setDataForTable] = useState([]);
  const [rowSelected, setRowSelected] = useState({});
  const {t} = useTranslation();

  const fnEdit = (row)=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setRowSelected(row);
    setOpenModal(true);
  }

  const fnDelete = (row)=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setRowSelected(row);
    setOpenConfirm(true);
  }

  const fnOnSuccessDelete = ()=>{
    if(validInt(rowSelected.id)<=0){
      return;
    }

    setLoading(true);
    request.DELETE('/payrollLineTypes', resp=>{
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
    },{id: rowSelected.id});
  }

  const fnNew = ()=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setRowSelected({});
    setOpenModal(true);
  };

  const table = {
    title: t("pages.payrollLineTypes"),
    columns: [
      {field: 'name', headerName: t('table.payrollLineTypes.column.name'), flex: 1 },
      {field: 'description', headerName: t('table.payrollLineTypes.column.description'), flex: 0.9 },
      {field: 'qtyPrice', headerName: t('table.payrollLineTypes.column.qtyPrice'), type: 'number', flex: 0.5},
      {field: 'qtyMax', headerName: t('table.payrollLineTypes.column.qtyMax'), flex: 0.5},
      {field: 'excedentPrice', headerName: t('table.payrollLineTypes.column.excedentPrice'), flex: 0.5},
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnEdit(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label= {t("button.delete")}
            onClick={() => fnDelete(row)}
            color='error'
          />
        ],
      },
    ],
    data: dataForTable,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    },
    freeActions: [{
      Icon: () => <Add />,
      label: t("datatable.buttons.newDocument"),
      onClick: fnNew
    }]
  };

  const fnGetData = ()=>{
    request.GET('/payrollLineTypes', (data)=>{
      const {payrollLineTypes} = data;
      setDataForTable(payrollLineTypes);
    }, (err)=>{
      console.warn(err);
    });
  }

  const modalOptions = {
    title: 'payrollLineTypes.modal.title',
    open: openModal,
    DialogContent: Detail,
    setOpen: setOpenModal,
    maxWidth: "sm",
    data:{
      rowSelected,
      onRefreshTable: fnGetData,
      setLoading,
      sweetAlerts
    }
  }

  const propsToModalConfirm ={
    open: openConfirm,
    setOpen: setOpenConfirm,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOnSuccessDelete
  }

  useEffect(()=>{
    fnGetData()
  }, []);

  return (
    <>
      <Card>
        <CardContent>
          <XDataGrid {...table} data={dataForTable} />
        </CardContent>
      </Card>
      <Modal {...modalOptions} />
      <ModalConfirm {...propsToModalConfirm} />
    </>
  );
};

export default Content;