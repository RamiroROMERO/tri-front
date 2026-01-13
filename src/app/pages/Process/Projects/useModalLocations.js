import React, { useState, useEffect } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { Icon } from '@mui/material';

const useModalLocations = ({t, setLoading, sweetAlerts, dataLocations, fnGetLocations, screenControl}) => {
  const { optCreate, optUpdate, optDelete } = screenControl;
  const [sendForm, setSendForm] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);

  const formValidations = {
    name: [(val) => val.length >= 4, t("alertMessages.warning.nameValid")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: 0,
    name: '',
    status: true
  }, formValidations);

  const {id, name, status} = formState;

  const fnNewDocto = ()=>{
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    onResetForm();
    setSendForm(false);
  }

  const fnEditDocto = (item)=>{
    if (optUpdate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    onBulkForm(item);
  }

  const fnDeleteDocto = (item)=>{
    if (optDelete === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    onBulkForm({id: item.id});
    setOpenMsgDelete(true);
  }

  const fnOkDelete = ()=>{
    if(validInt(id)<=0){
      return;
    }
    setLoading(true);
    request.DELETE(`/locations`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetLocations();
      fnNewDocto();
      setLoading(false);
    }, err=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    },{id});
  }

  const fnSaveDocto = ()=>{
    if (validInt(id) === 0) {
      if (optCreate === 0) {
        sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
        return;
      }
    } else {
      if (optUpdate === 0) {
        sweetAlerts('error', t("alertMessages.warning.unauthorizedUser"));
        return;
      }
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      id,
      name,
      status
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/locations', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetLocations();
        onResetForm();
        setSendForm(false);
        setLoading(false);
      }, err=>{
        const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      })
    }else{
      request.PUT('/locations', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetLocations();
        onResetForm();
        setSendForm(false);
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
  }

  const [table, setTable] = useState({
    title: '',
    columns: [
      {field: 'name', headerName: t('table.location.column.name'), flex: 1.5},
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
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  });

  useEffect(()=>{
    setTable({...table, data: dataLocations});
  },[dataLocations]);

  return (
    {
      table,
      formState,
      formValidation,
      isFormValid,
      sendForm,
      openMsgDelete,
      setOpenMsgDelete,
      onInputChange,
      fnSaveDocto,
      fnNewDocto,
      fnOkDelete
    }
  )
}

export default useModalLocations