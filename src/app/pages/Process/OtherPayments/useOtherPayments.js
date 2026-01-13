import React from 'react';
import { useEffect, useState } from 'react'
import { Add, Delete, Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { request } from 'app/utils/core';
import { currencyFormatter, validInt } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';

export const useOtherPayments = ({ setLoading, sweetAlerts, controlAdmin }) => {
  const { t } = useTranslation();
  const [currentItem, setCurrentItem] = useState({});
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [titleModalNew, setTitleModalNew] = useState('');
  const [tableData, setTableData] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);

  const fnGetData = () => {
    setLoading(true);
    request.GET('/otherPayments', (resp) => {
      const data = resp.data.map(item => {
        item.employeeName = item.employee?.name || '';
        item.week = `${item.customersWeek?.noYear || ''} | ${item.customersWeek?.noWeek || ''}`
        return item;
      });
      setTableData(data);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnNew = () => {
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem({});
    setTitleModalNew("dialog.otherPayments.title");
    setOpenModalNew(true);
  }

  const fnEdit = (item) => {
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setTitleModalNew("dialog.otherPayments.edit.title");
    setOpenModalNew(true);
  }

  const fnDelete = (item) => {
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setOpenMsgDelete(true);
  }

  const fnOkDelete = () => {
    if (validInt(currentItem.id) <= 0) {
      return;
    }
    setLoading(true);
    request.DELETE(`/otherPayments/${currentItem.id}`, resp => {
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
    }, { id: currentItem.id });
  }

  const table = {
    title: t("table.otherPayments.title"),
    columns: [
      { field: 'employeeName', headerName: t('table.common.employee'), flex: 1.2 },
      { field: 'week', headerName: t('table.common.week'), flex: 0.6 },
      { field: 'description', headerName: t('table.common.description'), flex: 1.5 },
      { field: 'isRecurring', headerName: t('modal.input.checkbox.isPaymentRecurring'), flex: 0.5, type: 'boolean' },
      { field: 'total', headerName: t('table.common.amount'), type: 'number', flex: 0.7, valueFormatter: ({ value }) => currencyFormatter.format(value) },
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
            label={t("button.delete")}
            onClick={() => fnDelete(row)}
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
      onClick: fnNew
    }]
  };

  useEffect(() => {
    fnGetData();

    setLoading(true);
    request.GET('/customers/getSL?active=1', (resp) => {
      const customers = resp.customers.map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      });
      setListCustomers(customers);
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
      openMsgDelete,
      setOpenMsgDelete,
      fnOkDelete,
      fnGetData,
      currentItem,
      titleModalNew,
      listCustomers
    }
  )
}
