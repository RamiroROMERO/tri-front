import React, { useState } from 'react'
import { Add, Autorenew, Delete, Edit, ForwardToInbox, List } from '@mui/icons-material'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next';
import { request } from 'app/utils/core';
import { useEffect } from 'react';
import { currencyFormatter, formatNumber, validFloat } from 'app/utils/helpers';
import { Chip } from '@mui/material';

export const usePurchaseOrder = ({ setLoading, sweetAlerts }) => {
  const { t } = useTranslation();
  const [currentItem, setCurrentItem] = useState({});
  const [tableData, setTableData] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listProjects, setListProjects] = useState([]);
  const [listProviders, setListProviders] = useState([]);
  const [listProducts, setListProducts] = useState([]);
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [openModalProcess, setOpenModalProcess] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [openModalSendEmail, setOpenModalSendEmail] = useState(false);

  const fnGetData = () => {
    setLoading(true);
    request.GET(`/inventory/purchaseOrders?status=1&status=2`, (resp) => {
      const data = resp.data.map((item) => {
        item.customerName = item.invCustomer?.name || ''
        item.projectName = item.invProject?.code + ' | ' + item.invProject?.name || ''
        item.providerName = item.invProvider?.name || ''
        item.statusIcon = item.status === 2 ? "Process" : "Pending"
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

  const fnDetailDocto = (item) => {
    setCurrentItem(item);
    setOpenModalDetail(true);
  }

  const fnEditDocto = (item) => {
    setCurrentItem(item);
    setOpenModalNew(true);
  }

  const fnDeleteDocto = (item) => {
    if (item.status === 2) {
      sweetAlerts('error', t("alertMessages.error.purchaseOrderProcess"));
      return;
    }
    setCurrentItem(item);
    setOpenMsgDelete(true);
  }

  const fnOkDelete = () => {
    setLoading(true);
    request.DELETE(`/inventory/purchaseOrders/${currentItem.id}`, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetData();
      setLoading(false);
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  }

  const fnProcessDocto = (item) => {
    if (item.status === 2) {
      sweetAlerts('error', t("alertMessages.error.purchaseOrderProcess"));
      return;
    }
    setCurrentItem(item);
    setOpenModalProcess(true);
  }

  const fnSendEmail = (item)=>{
    setCurrentItem(item);
    setOpenModalSendEmail(true);
  }

  const table = {
    title: t("table.purchaseOrders.title"),
    columns: [
      { field: 'id', headerName: t("table.common.num"), flex: 0.3, hide: true },
      {
        field: 'date',
        headerName: t("table.common.date"),
        flex: 0.7
      },
      {
        field: 'ocCode',
        headerName: t("table.projects.column.ocCode"),
        flex: 0.5
      },
      {
        field: 'providerName',
        headerName: t("table.common.provider"),
        flex: 0.8,
      },
      {
        field: 'customerName',
        headerName: t("table.common.customer"),
        flex: 1.4,
        hide: true
      },
      {
        field: 'projectName',
        headerName: t("table.common.project"),
        flex: 1,
      },
      {
        field: 'total',
        headerName: t("table.common.value"),
        flex: 0.7,
        type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'statusIcon',
        headerName: t("table.common.status"),
        flex: 0.5,
        renderCell: ({ row, field }) => {
          return (<Chip label={row[field]} color={row[field] === "Process" ? 'success' : 'warning'} variant={"outlined"} />)
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<List />}
            label={t("button.details")}
            onClick={() => fnDetailDocto(row)}
            color='primary'
            showInMenu
          />,
          <GridActionsCellItem
            icon={<Autorenew />}
            label={t("button.process")}
            onClick={() => fnProcessDocto(row)}
            color='secondary'
            showInMenu
          />,
          <GridActionsCellItem
            icon={<ForwardToInbox />}
            label={t("button.sendEmail")}
            onClick={() => fnSendEmail(row)}
            color='primary'
            showInMenu
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

    setLoading(true);
    request.GET('/inventory/customers?status=1', (resp) => {
      const customers = resp.data.map((item) => {
        return {
          value: item.id,
          label: `${item.code} | ${item.name}`,
        }
      });
      setListCustomers(customers);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/inventory/projects', (resp) => {
      const projects = resp.data.map((item) => {
        return {
          value: item.id,
          label: `${item.code} | ${item.name}`,
          customerId: item.customerId
        }
      });
      setListProjects(projects);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/inventory/providers?status=1', (resp) => {
      const providers = resp.data.map((item) => {
        return {
          value: item.id,
          label: `${item.dni} | ${item.name}`,
        }
      });
      setListProviders(providers);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/inventory/products', (resp) => {
      const productList = resp.data.map((item) => {
        return {
          value: item.id,
          label: `${item.code} | ${item.name} | ${item.invTrademark.name}`,
          code: item.code,
          name: item.name,
          costValue: item.costValue,
          taxPercent: item.taxPercent,
          measureUnit: item.invMeasureUnit?.name || ''
        }
      });
      setListProducts(productList);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }, []);

  return (
    {
      table,
      openModalNew,
      setOpenModalNew,
      openModalDetail,
      setOpenModalDetail,
      openMsgDelete,
      setOpenMsgDelete,
      openModalProcess,
      setOpenModalProcess,
      openModalSendEmail,
      setOpenModalSendEmail,
      fnOkDelete,
      fnGetData,
      currentItem,
      listCustomers,
      listProjects,
      listProviders,
      listProducts
    }
  )
}
