import React, { useEffect, useState } from 'react'
import { Delete, Edit } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useModalProjects = ({t, setLoading, sweetAlerts, customerId}) => {
  const [tableData, setTableData] = useState([]);

  const [sendForm, setSendForm] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);

  const formValidations = {
    name: [(val) => val.length >= 4, t("alertMessages.warning.nameValid")],
    code: [(val)=>val!=="", t("alertMessages.warning.codeValid")],
    ocCode: [(val)=>val!=="", t("alertMessages.warning.ocCode")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: 0,
    code: '',
    name: '',
    description: '',
    location: '',
    ocCode: '',
    ocCurrent: '00',
    status: 1
  }, formValidations);

  const {id, code, ocCode, ocCurrent, name, description, location, status} = formState;

  const fnGetData = ()=>{
    setLoading(true);
    request.GET(`/inventory/projects?customerId=${customerId}`, (resp)=>{
      const data = resp.data.map((item)=>{
        item.statusName = item.status === 1?'In Progress':item.status === 2?'Finalized':'Paused';
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
    request.DELETE(`/inventory/projects/${id}`, resp=>{
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

  const fnSaveDocto = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      customerId,
      code,
      ocCode,
      ocCurrent,
      name,
      description,
      location,
      status
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/inventory/projects', newData, resp=>{
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
      request.PUT(`/inventory/projects/${id}`, newData, resp=>{
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
    title: t("table.projects2.title"),
    columns: [
      {field: 'code', headerName: t('table.projects2.column.code'), flex: 0.5},
      {field: 'name', headerName: t('table.projects2.column.name'), flex: 1},
      {field: 'location', headerName: t('table.projects2.column.location'), flex: 0.6},
      {
        field: 'statusName',
        headerName: t("table.common.status"),
        flex: 0.5,
        renderCell: ({row, field})=>{
          return (<Chip label={row[field]} color={row[field]==="Finalized"?'success':(row[field]==="In Progress"?'warning':'error')} variant={"outlined"}/>)
        }
      },
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
      onInputChange,
      sendForm,
      openMsgDelete,
      setOpenMsgDelete,
      fnSaveDocto,
      fnNewDocto,
      fnOkDelete
    }
  )
}
