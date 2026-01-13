import React, { useState } from 'react'
import { Add, Delete, Edit, Info } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useTableProjects = ({ t, tableData, customerName, sweetAlerts, setLoading, customerId, fnGetProjects, fnGetListCustomers, screenControl }) => {
  const { optCreate, optUpdate, optDelete } = screenControl;
  const [currentItem, setCurrentItem] = useState({});
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [openEditStatus, setOpenEditStatus] = useState(false);
  const [openModalViewInfo, setOpenModalViewInfo] = useState(false);
  const [titleModalNew, setTitleModalNew] = useState('');

  const fnNewDocto = () => {
    setCurrentItem({});
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setTitleModalNew("dialog.addNewProject.title");
    setOpenModalNew(true);
  }

  const fnEditDocto = (item) => {
    setCurrentItem(item);
    setTitleModalNew("dialog.editProject.title");
    setOpenModalNew(true);
  }

  const fnDeleteDocto = (item) => {
    if (optDelete === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setOpenMsgDelete(true);
  }

  const fnViewInfoDocto = (item) => {
    setCurrentItem(item)
    setOpenModalViewInfo(true);
  }

  const fnEditStatus = (item) => {
    if (optUpdate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setOpenEditStatus(true);
  }

  const fnOkDelete = () => {
    if (validInt(currentItem.id) <= 0) {
      return;
    }
    setLoading(true);
    request.DELETE(`/projects`, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetProjects(customerId);
      fnGetListCustomers();
      setLoading(false);
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    }, { id: currentItem.id });
  }

  const table = {
    title: `${t("table.projects2.title")} for ${customerName}`,
    columns: [
      { field: 'code', headerName: t('table.projects2.column.code'), flex: 1.2 },
      { field: 'name', headerName: t('table.projects2.column.name'), flex: 1.5 },
      { field: 'locationName', headerName: t('table.projects2.column.location'), flex: 0.6 },
      { field: 'qtyWeeks', headerName: t('table.projects2.column.weeksWork'), flex: 0.5 },
      {
        field: 'statusName',
        headerName: t("table.common.status"),
        flex: 0.5,
        renderCell: ({ row, field }) => {
          return (<Chip label={row[field]} color={row[field] === "Finalized" ? 'success' : (row[field] === "In Progress" ? 'warning' : 'error')} variant={"outlined"} onClick={() => fnEditStatus(row)} />)
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 100,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Info />}
            label={t("button.info")}
            onClick={() => fnViewInfoDocto(row)}
            color='primary'
          />,
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
      }
    ],
    data: tableData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    },
    freeActions: [{
      Icon: () => <Add />,
      label: t("datatable.buttons.newDocument"),
      onClick: fnNewDocto
    }],
  };

  return (
    {
      table,
      openModalNew,
      setOpenModalNew,
      openMsgDelete,
      setOpenMsgDelete,
      openEditStatus,
      setOpenEditStatus,
      fnOkDelete,
      currentItem,
      titleModalNew,
      setOpenModalViewInfo,
      openModalViewInfo
    }
  )
}
