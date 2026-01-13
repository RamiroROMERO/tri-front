import React, { useEffect, useState } from 'react'
import { Delete, Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useModalContacts = ({t, setLoading, sweetAlerts, customerId}) => {
  const [tableData, setTableData] = useState([]);
  const [sendForm, setSendForm] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);

  const formValidations = {
    name: [(val) => val.length >= 4, t("alertMessages.warning.nameValid")],
    phone: [(val)=>val!=="", t("alertMessages.warning.phone")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: 0,
    name: '',
    email: '',
    phone: ''
  }, formValidations);

  const {id, name, email, phone} = formState;

  const fnGetData = ()=>{
    setLoading(true);
    request.GET(`/inventory/customerContacts?customerId=${customerId}`, (resp)=>{
      const data = resp.data.map((item)=>{
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
    request.DELETE(`/inventory/customerContacts/${id}`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetData();
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


  const fnSave = () =>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      id,
      customerId,
      name,
      email,
      phone
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/inventory/customerContacts', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
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
      request.PUT(`/inventory/customerContacts/${id}`, newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
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

  const table = {
    title: t("table.contacts.title"),
    columns: [
      {field: 'name', headerName: t('table.common.name'), flex: 1},
      {field: 'phone', headerName: t('table.common.phone'), flex: 0.5},
      {field: 'email', headerName: t('table.common.email'), flex: 0.6},
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 110,
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
      },
    ],
    data: tableData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  };

  useEffect(()=>{
    fnGetData();
  },[]);

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
      fnSave,
      fnNewDocto,
      fnOkDelete
    }
  )
}
