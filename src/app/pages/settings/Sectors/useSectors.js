import { Add, Delete, Edit } from '@mui/icons-material';
import { Icon } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

export const useSectors = ({setLoading, sweetAlerts, controlAdmin}) => {
  const [tableData, setTableData] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const {t} = useTranslation();
  const [titleModalNew, setTitleModalNew] = useState('');

  const fnGetData = ()=>{
    setLoading(true);
    request.GET('/sectors', (resp)=>{
      const data= resp.sectors.map((item)=>{
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

  const fnNew = ()=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem({});
    setTitleModalNew("dialog.sectors.title");
    setOpenModalNew(true);
  }

  const fnEdit = (item)=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setTitleModalNew("dialog.sectors.edit.title");
    setOpenModalNew(true);
  }

  const fnDelete = (item)=>{
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
    request.DELETE(`/sectors`, resp=>{
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

  const table = {
    title: t("table.sectors.title"),
    columns: [
      {field: 'name', headerName: t('table.common.name'), flex: 1 },
      {field: 'statusIcon', headerName: t('table.common.status'), flex: 0.3,
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
      }
    ],
    data: tableData,
    actions:[
      {
        tooltip:'action.new',
        icon: 'add',
        onClick: fnNew,
        isFreeAction: true
      },
      {
        tooltip:'action.edit',
        icon: 'edit',
        onClick: fnEdit,
        color: 'warning'
      },
      {
        tooltip:'action.delete',
        icon: 'delete_forever',
        onClick: fnDelete,
        color: 'error'
      }
    ],
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

  useEffect(()=>{
    fnGetData();
  },[]);

  return (
    {
      table,
      openModalNew,
      setOpenModalNew,
      openMsgDelete,
      setOpenMsgDelete,
      fnOkDelete,
      fnGetData,
      currentItem,
      titleModalNew
    }
  )
}
