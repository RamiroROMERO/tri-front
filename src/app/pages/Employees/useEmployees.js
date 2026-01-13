import React, { useState, useEffect } from 'react'
import { request } from 'app/utils/core';
import { formatDateToShow, roundTwoDecimals, validInt } from 'app/utils/helpers';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Delete, Edit, Paid } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Chip, Grid, Icon } from '@mui/material';
import { SimpleSelect } from 'app/components/SimpleSelect';
import { ModalCiaAccounts } from './ModalCiaAccounts';

export const useEmployees = ({ setLoading, sweetAlerts, setActions, screenControl, adminControl }) => {
  const { t } = useTranslation();
  const { optCreate, optUpdate, optDelete } = screenControl;
  const enableEditRate = adminControl.find(ctrl => ctrl.privilegeId === 38)?.status || 0;
  const [classificationList, setClassificationList] = useState([]);
  const [sectorList, setSectorList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [ciaAccountList, setCiaAccountList] = useState([]);
  const [dataCiaAccounts, setdataCiaAccounts] = useState([]);
  const [employeeStatusSelected, setEmployeeStatusSelected] = useState(4);
  const [tableData, setTableData] = useState([]);
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalEditRates, setOpenModalEditRates] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [openModalCiaAccounts, setOpenModalCiaAccounts] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});

  const getData = () => {
    setLoading(true);
    request.GET('/employees/findSelectList', res => {
      const { banks, classifications, customers, sectors, statusList, ciaAccount } = res;

      let currBankList = banks.map(elem => {
        const newItem = {
          label: elem.name,
          value: elem.id
        }
        return newItem;
      });

      let currClassificationList = classifications.map(elem => {
        const newItem = {
          label: elem.name,
          value: elem.id
        };
        return newItem;
      });
      let currSectorList = sectors.map(elem => {
        const newItem = {
          label: elem.name,
          value: elem.id
        };
        return newItem;
      });
      let currStatusList = statusList.map(elem => {
        const newItem = {
          label: elem.name,
          value: elem.id
        };
        return newItem;
      });
      currStatusList.push({ label: 'All', value: 0 });
      let currCustomerList = customers.map(elem => {
        const newItem = {
          label: elem.name,
          value: elem.id,
          perDiemPayroll: elem.perDiemPayroll,
          perDiemInvoice: elem.perDiemInvoice
        };
        return newItem;
      });
      const currCiaAccountList = ciaAccount.map(elem => {
        const newItem = {
          label: elem.name,
          value: elem.name,
          id: elem.id,
          name: elem.name,
          statusIcon: elem.status === 1 ? "check_box" : "check_box_outline_blank"
        };
        return newItem;
      });
      setClassificationList(currClassificationList);
      setSectorList(currSectorList);
      setStatusList(currStatusList);
      setCustomerList(currCustomerList);
      setCustomers(customers);
      setBankList(currBankList);
      setCiaAccountList(currCiaAccountList);
      setLoading(false);
    }, err => {
      console.error(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/ciaAccounts', (resp) => {
      const ciaAccounts = resp.ciaAccounts.map((item) => {
        item.statusIcon = item.status == 1 ? "check_box" : "check_box_outline_blank"
        return item;
      });
      setdataCiaAccounts(ciaAccounts);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  };

  const fnGetEmployeeData = () => {
    setLoading(true);
    const urlGet = validInt(employeeStatusSelected) === 0 ? '/employees' : `/employees?statusId=${employeeStatusSelected}`;
    request.GET(urlGet, resp => {
      const { employees } = resp;
      const data = employees.map((item) => {
        item.rateByHour = roundTwoDecimals(item.rateByHour)
        item.rateOvertime = roundTwoDecimals(item.rateOvertime)
        item.payrollPerDiemAmount = roundTwoDecimals(item.payrollPerDiemAmount)
        item.invoicePerDiemAmount = roundTwoDecimals(item.invoicePerDiemAmount)
        item.fixedSalary = roundTwoDecimals(item.fixedSalary)
        item.address = item.address || ''
        item.sectorId = item.sectorId || ''
        item.customersName = item.employeeCustomers.map((item) => {
          return item.customer.name
        }).toString().replaceAll(',', ', ');
        item.noteBank = item.noteBank || ''
        item.ciaAccount = item.ciaAccount || ''
        item.dateStarted = item.dateStarted;
        item.statusName = item.status?.name || '';
        item.classificationName = item.classification?.name || '';
        item.classificationId = item.classificationId
        return item
      });
      setTableData(data);
      setLoading(false);
    }, err => {
      console.error(err);
      setLoading(false);
    })
  };

  const fnNewRecord = () => {
    if (optCreate === 0) return;
    setSelectedRecord({});
    setOpenModalNew(true);
  };

  const fnEditRecord = (row) => {
    if (optUpdate === 0) return;
    setSelectedRecord(row);
    setOpenModalEdit(true);
  };

  const fnDeleteRecord = (row) => {
    if (optDelete === 0) return;
    setSelectedRecord(row);
    setOpenMsgDelete(true);
  }

  const fnOkDeleteRecord = () => {
    if (validInt(selectedRecord.id) <= 0) {
      return;
    }
    setLoading(true);
    request.DELETE(`/employees`, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetEmployeeData();
      setLoading(false);
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    }, { id: selectedRecord.id });
  };

  const fnEditRates = (row) => {
    setSelectedRecord(row);
    setOpenModalEditRates(true);
  }

  const onStatusChange = e => {
    const status = e.target.value;
    setEmployeeStatusSelected(status);
  }

  const table = {
    title: t("table.employees.title"),
    columns: [
      { field: 'code', headerName: t('table.employees.column.code'), flex: 0.3, isFilter: true },
      { field: 'name', headerName: t('table.employees.column.name'), flex: 0.8, isFilter: true },
      { field: 'classificationName', headerName: t('table.employees.column.classificationName'), flex: 0.7, isFilter: true },
      { field: 'customersName', headerName: t('table.employees.column.customerName'), flex: 0.5 },
      { field: 'dateStarted', headerName: t('table.employees.column.dateStarted'), flex: 0.5, isFilter: true, valueFormatter: ({ value }) => formatDateToShow(value) },
      {
        field: 'statusName',
        headerName: t("table.common.status"),
        flex: 0.5,
        renderCell: ({ row, field }) => {
          return (<Chip label={row[field]} color={row[field] === "Active" ? 'success' : (row[field] === "Inactive" ? 'warning' : 'error')} variant={"outlined"} />)
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Paid />}
            label={t("action.editRate")}
            onClick={() => fnEditRates(row)}
            color='info'
            disabled={enableEditRate === 1 ? false : true}
          />,
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnEditRecord(row)}
            color='info'
            showInMenu
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label={t("button.delete")}
            onClick={() => fnDeleteRecord(row)}
            color='error'
          />
        ],
      },
    ],
    data: tableData,
    options: {
      pageSize: 25,
      rowsPerPageOptions: [25, 50, 75, 100]
    },
    freeActions: [{
      Icon: () => <Add />,
      label: t("datatable.buttons.newDocument"),
      onClick: fnNewRecord
    }],
    customControls: [
      <Grid item xs={12} sm={4} lg={3} >
        <SimpleSelect
          label={t('table.activeEmployees.column.status')}
          name='employeeStatusSelected'
          value={employeeStatusSelected}
          onChange={onStatusChange}
          optionList={statusList}
        />
      </Grid>
    ]
  };

  const fnMenuOptions = () => {
    let actions = [
      { icon: () => <Icon>list_alt_add</Icon>, name: 'button.addCiaAccounts', onClick: () => { setOpenModalCiaAccounts(true) } }
    ];
    setActions(actions)
  }

  useEffect(() => {
    getData();
    fnMenuOptions();
  }, []);

  useEffect(() => {
    fnGetEmployeeData();
  }, [employeeStatusSelected]);

  const dataToModalNew = {
    classificationList,
    sectorList
  };

  const dataToModalEdit = {
    classificationList,
    sectorList,
    statusList,
    bankList,
    customerList,
    ciaAccountList,
    selectedRecord
  };

  const dataToModalEditRates = {
    selectedRecord,
    customers
  };

  const propsToModalCiaAccounts = {
    title: 'dialog.ciaAccounts.title',
    DialogContent: ModalCiaAccounts,
    open: openModalCiaAccounts,
    setOpen: setOpenModalCiaAccounts,
    maxWidth: 'sm',
    data: {
      dataCiaAccounts,
      setLoading,
      sweetAlerts,
      getData
    }
  };

  return {
    classificationList,
    sectorList,
    statusList,
    customerList,
    table,
    dataToModalNew,
    openModalNew,
    setOpenModalNew,
    dataToModalEdit,
    openModalEdit,
    setOpenModalEdit,
    openModalEditRates,
    setOpenModalEditRates,
    dataToModalEditRates,
    fnGetEmployeeData,
    selectedRecord,
    openMsgDelete,
    setOpenMsgDelete,
    fnOkDeleteRecord,
    propsToModalCiaAccounts
  };
};
