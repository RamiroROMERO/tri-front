import React, { useEffect, useState } from 'react'
import { Icon } from '@mui/material';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Delete, Edit, Engineering, Paid, PermContactCalendar, SwitchAccount } from '@mui/icons-material';
import { CheckBox } from 'app/components/Checkbox';

export const useCustomers = ({ setLoading, sweetAlerts, screenControl, adminControl }) => {
  const { t } = useTranslation();
  const { optCreate, optUpdate, optDelete } = screenControl;
  const enableEditRate = adminControl.find(ctrl => ctrl.privilegeId === 38)?.status || 0;
  const [currentItem, setCurrentItem] = useState({});
  const [tableData, setTableData] = useState([]);
  const [listClassifications, setListClassificactions] = useState([]);
  const [listCompanyQuickbook, setListCompanyQuickbook] = useState([]);
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openModalContacts, setOpenModalContacts] = useState(false);
  const [openModalClassifications, setOpenModalClassifications] = useState(false);
  const [openModalRates, setOpenModalRates] = useState(false);
  const [openModalQuickbookCust, setOpenModalQuickbookCust] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [showActives, setShowActives] = useState(true);
  const [titleModalNew, setTitleModalNew] = useState('');

  const fnGetData = (status = showActives) => {
    const urlGet = status ? `/customers?active=1` : `/customers`;
    setLoading(true);
    request.GET(urlGet, (resp) => {
      const data = resp.customers.map((item) => {
        item.statusIcon = item.active == 1 ? "check_box" : "check_box_outline_blank";
        item.invoiceTypeName = item.invoiceType == 1 ? "For Project" : "Global";
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
    setTitleModalNew("dialog.customers.title");
    if (optCreate === 0) {
      return;
    }
    setCurrentItem({});
    setOpenModalNew(true);
  }

  const fnEdit = (item) => {
    setTitleModalNew("dialog.customers.title.edit");
    setCurrentItem(item);
    setOpenModalNew(true);
  }

  const fnDelete = (item) => {
    if (optDelete === 0) {
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
    request.DELETE(`/customers`, resp => {
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

  const fnAddContacts = (item) => {
    setCurrentItem(item);
    setOpenModalContacts(true);
  }

  const fnAddClassifications = (item) => {
    setCurrentItem(item);
    setOpenModalClassifications(true);
  }

  const fnEditRates = (item) => {
    setCurrentItem(item);
    setOpenModalRates(true);
  }

  const fnQbkCustomer = (item) => {
    setCurrentItem(item);
    setOpenModalQuickbookCust(true);
  }

  const onActiveChange = e => {
    const active = e.target.checked;
    setShowActives(active);
    fnGetData(active);
  }

  const table = {
    title: t("table.customers.title"),
    columns: [
      { field: 'code', headerName: t('table.common.code'), flex: 0.3 },
      { field: 'name', headerName: t('table.common.name'), flex: 1 },
      { field: 'maxReghoursPayroll', headerName: t('table.common.payrollRTMax'), flex: 0.3 },
      { field: 'maxReghoursInvoice', headerName: t('table.common.invoiceRTMax'), flex: 0.3 },
      { field: 'invoiceTypeName', headerName: t('dialog.customers.invoiceType'), flex: 0.5 },
      {
        field: 'statusIcon', headerName: t('table.common.status'), flex: 0.5,
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
            onClick={() => fnEdit(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label={t("button.delete")}
            onClick={() => fnDelete(row)}
            color='error'
          />,
          <GridActionsCellItem
            icon={<PermContactCalendar />}
            label={t("action.addContact")}
            onClick={() => fnAddContacts(row)}
            color='primary'
            showInMenu
          />,
          <GridActionsCellItem
            icon={<Engineering />}
            label={t("action.addClassification")}
            onClick={() => fnAddClassifications(row)}
            color='primary'
            showInMenu
          />,
          <GridActionsCellItem
            icon={<Paid />}
            label={t("action.editRate")}
            onClick={() => fnEditRates(row)}
            color='primary'
            showInMenu
            disabled={enableEditRate === 1 ? false : true}
          />,
          <GridActionsCellItem
            icon={<SwitchAccount />}
            label={t("action.qbkCustomer")}
            onClick={() => fnQbkCustomer(row)}
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
      onClick: fnNew
    }],
    customControls: [
      <CheckBox label={t("modal.input.checkbox.status")}
        name="showActives"
        checked={showActives}
        onChange={onActiveChange}
      />
    ]
  };

  useEffect(() => {
    fnGetData();

    setLoading(true);
    request.GET('/classifications', (resp) => {
      const classifications = resp.classifications.map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      });
      setListClassificactions(classifications);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET(`/qbAccounts?status=1`, (resp) => {
      const QBAccounts = resp.QBAccounts.map((item) => {
        return {
          value: item.qbCompanies[0]?.id,
          label: `${item.name} - ${item.qbCompanies[0]?.name || ''}`
        }
      });
      setListCompanyQuickbook(QBAccounts);
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
      openModalContacts,
      setOpenModalContacts,
      openModalClassifications,
      setOpenModalClassifications,
      openModalRates,
      setOpenModalRates,
      openModalQuickbookCust,
      setOpenModalQuickbookCust,
      openMsgDelete,
      setOpenMsgDelete,
      fnOkDelete,
      fnGetData,
      currentItem,
      listClassifications,
      listCompanyQuickbook,
      titleModalNew
    }
  )
}
