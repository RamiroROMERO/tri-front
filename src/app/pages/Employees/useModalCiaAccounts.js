import React, { useState, useEffect } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import { Icon } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useModalCiaAccounts = ({t, setLoading, sweetAlerts, dataCiaAccounts, getData}) => {
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
    onResetForm();
    setSendForm(false);
  }

  const fnEditDocto = (item)=>{
    onBulkForm(item);
  }

  const fnDeleteDocto = (item)=>{
    onBulkForm({id: item.id});
    setOpenMsgDelete(true);
  }

  const fnOkDelete = ()=>{
    if(validInt(id)<=0){
      return;
    }
    setLoading(true);
    request.DELETE(`/ciaAccounts`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      getData();
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

    if(validInt(id)===0){
      setLoading(true);
      request.POST('/ciaAccounts', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        getData();
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
      })
    }else{
      setLoading(true);
      request.PUT('/ciaAccounts', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        getData();
        fnNewDocto();
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
        {field: 'name', headerName: t('table.common.name'), flex: 1.5},
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
    setTable({...table, data: dataCiaAccounts});
  },[dataCiaAccounts]);

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
