import React, { useEffect, useState } from 'react'
import { Add, Apartment, Delete, Edit, PermContactCalendar } from '@mui/icons-material';
import { Icon } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { request } from 'app/utils/core';
import { CheckBox } from 'app/components/Checkbox';
import { validInt } from 'app/utils/helpers';

export const useCustomers = ({setLoading, sweetAlerts}) => {
  const {t} = useTranslation();
  const [currentItem, setCurrentItem] = useState({});
  const [tableData, setTableData] = useState([]);
  const [listStatus, setListStatus] = useState([]);
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openModalContacts, setOpenModalContacts] = useState(false);
  const [openModalProjects, setOpenModalProjects] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [showActives, setShowActives] = useState(true);

  const fnGetData = (status=showActives)=>{
    const urlGet = status?"/inventory/customers?status=1":"/inventory/customers";
    setLoading(true);
    request.GET(urlGet, (resp)=>{
      const data= resp.data.map((item)=>{
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
    request.DELETE(`/inventory/customers/${currentItem.id}`, resp=>{
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

  const fnAddContacts = (item)=>{
    setCurrentItem(item);
    setOpenModalContacts(true);
  }

  const fnAddProjects = (item)=>{
    setCurrentItem(item);
    setOpenModalProjects(true);
  }

  const onActiveChange = e=>{
    const active = e.target.checked;
    setShowActives(active);
    fnGetData(active);
  }

  const table = {
    title: t("table.customers.title"),
    columns: [
      {field: 'code', headerName: t('table.common.code'), flex: 0.3},
      {field: 'name', headerName: t('table.common.name'), flex: 1},
      {field: 'phone', headerName: t('table.common.phone'), flex: 0.5},
      {field: 'address', headerName: t('table.customers.column.address'), flex: 1},
      {field: 'statusIcon', headerName: t('table.common.status'), flex: 0.5,
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
          />,
          <GridActionsCellItem
            icon={<PermContactCalendar />}
            label= {t("action.addContact")}
            onClick={() => fnAddContacts(row)}
            color='primary'
            showInMenu
          />,
          <GridActionsCellItem
            icon={<Apartment />}
            label= {t("action.projects")}
            onClick={() => fnAddProjects(row)}
            color='primary'
            showInMenu
          />
        ],
      },
    ],
    data: tableData,
    options: {
      pageSize: 50,
      rowsPerPageOptions: [50, 100, 150, 200]
    },
    freeActions: [{
      Icon: () => <Add />,
      label: t("datatable.buttons.newDocument"),
      onClick: fnNewDocto
    }],
    customControls: [
      <CheckBox label={t("modal.input.checkbox.status")}
        name="showActives"
        checked={showActives}
        onChange={onActiveChange}
      />
    ]
  };

  useEffect(()=>{
    fnGetData();

    setLoading(true);
    request.GET('/status?type=1', (resp)=>{
      const status = resp.data.map((item)=>{
        return {
          value: item.id,
          label: item.name,
        }
      });
      setListStatus(status);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  },[]);

  return (
    {
      table,
      openModalNew,
      setOpenModalNew,
      openModalContacts,
      setOpenModalContacts,
      openModalProjects,
      setOpenModalProjects,
      openMsgDelete,
      setOpenMsgDelete,
      fnOkDelete,
      fnGetData,
      currentItem,
      listStatus
    }
  )
}
