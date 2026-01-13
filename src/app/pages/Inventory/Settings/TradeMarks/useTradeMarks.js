import { useEffect, useState } from 'react';
import { Icon } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Delete, Edit } from '@mui/icons-material';
import { validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const useTradeMarks = ({ setLoading, sweetAlerts, t }) => {
  const [tableData, setTableData] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [openModalNew, setOpenModalNew] = useState(false);

  const fnGetData = () => {
    setLoading(true);
    request.GET('/inventory/trademarks', (resp) => {
      const data = resp.data.map((item) => {
        item.statusIcon = item.status == 1 ? "check_box" : "check_box_outline_blank"
        return item;
      });
      setTableData(data);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnCreateNewDocto = () => {
    setCurrentItem({});
    setOpenModalNew(true);
  }

  const fnDeleteDocto = (item) => {
    setCurrentItem(item);
    setOpenMsgDelete(true);
  }

  const fnOkDelete = () => {
    if (validInt(currentItem.id) <= 0) {
      return;
    }
    setLoading(true);
    request.DELETE(`/inventory/trademarks/${currentItem.id}`, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetData();
      setLoading(false);
    }, err => {
      const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
      setLoading(false);
    }, { id: currentItem.id });
  }

  const fnEditDocto = (item) => {
    setCurrentItem(item);
    setOpenModalNew(true);
  }

  const table = {
    title: t("table.tradeMarks.title"),
    columns: [
      { field: 'name', headerName: t("table.common.name"), flex: 1 },
      {
        field: 'statusIcon',
        headerName: t("table.common.status"),
        sortable: false,
        flex: 0.3,
        renderCell: ({ row, field }) => {
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
            label={t("button.delete")}
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

  useEffect(() => {
    fnGetData();
  }, [])

  return (
    {
      table,
      openMsgDelete,
      setOpenMsgDelete,
      fnOkDelete,
      fnGetData,
      currentItem,
      openModalNew,
      setOpenModalNew
    }
  )
}
