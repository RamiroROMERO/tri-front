import React, { useEffect, useState } from 'react'
import { request } from 'app/utils/core';
import { formatDateToRequest, getDaysDiff, roundTwoDecimals, validFloat, validInt } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';
import { DoneAll, ReceiptLong, Rotate90DegreesCcw, Approval } from '@mui/icons-material';
import { Icon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomColumns from './CustomColumns';
import { ModalApplyAll } from './ModalApplyAll';

export const useDailyPayroll = ({ customerData, weekId, weekData, setLoading, sweetAlerts, setActions, pathToReturn, adminControl }) => {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [payrollLineTypes, setPayrollLineTypes] = useState([]);
  const [dataToUpdate, setDataToUpdate] = useState([]);
  const [listProjectsCustomer, setListProjectsCustomer] = useState([]);
  const [listDates, setListDates] = useState({});
  const [classificationList, setClassificationList] = useState([]);
  const [sectorList, setSectorList] = useState([]);
  const [listEmployees, setListEmployees] = useState([]);
  const [totalsHours, setTotalsHours] = useState({});
  const [currentItem, setCurrentItem] = useState({});
  const [openModalEnterHours, setOpenModalEnterHours] = useState(false);
  const [openChangeProject, setOpenChangeProject] = useState(false);
  const [openAddEmployee, setOpenAddEmployee] = useState(false);
  const [openNewEmployee, setOpenNewEmployee] = useState(false);
  const [openModalImportXLSX, setOpenModalImportXLSX] = useState(false);
  const [valueTabSelect, setValueTabSelect] = useState(0);
  const [complementaryData, setComplementaryData] = useState({});

  const [openModalApplyAll, setOpenModallApplyAll] = useState(false);
  const [payrollLinesAll, setPayrollLinesAll] = useState([]);
  const [employeesAll, setEmployeesAll] = useState([]);

  const [openModalEmployeesWithoutHours, setOpenModalEmployeesWithoutHours] = useState(false);
  const enableEmployeesWithoutHours = adminControl.find(ctrl => ctrl.privilegeId === 39)?.status || 0;
  const enableRateDetails = adminControl.find(ctrl => ctrl.privilegeId === 43)?.status || 0;
  const [dataEmployeesWithoutH, setDataEmployeesWithoutH] = useState([]);

  const [sortGridModel, setSortGridModel] = useState([
    {
      field: 'employeeName',
      sort: 'asc'
    }
  ]);


  const defaultColumns = [
    { field: 'employeeName', headerName: t('table.common.employee'), flex: 1, editable: false }
  ]

  const fnSaveAll = () => {

    if (dataToUpdate.length === 0) {
      return;
    }

    request.PUT('/dailiesPayrolls/bulkUpdate', { data: dataToUpdate }, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setDataToUpdate([]);
      setLoading(false);
      fnGetPayroll();
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setDataToUpdate([]);
      setLoading(false);
    });
  }

  const [table, setTable] = useState({
    title: `${t("table.dailiesPayrolls.title")}`,
    columns: [
      ...defaultColumns
    ],
    data: [],
    freeActions: [{
      Icon: () => <DoneAll />,
      label: t("action.saveAll"),
      onClick: () => { fnSaveAll() },
      color: 'secondary',
      disabled: true,
      showLabel: true
    }
      // {Icon: () => <Approval />,
      //   label: t("action.applyAll"),
      //   onClick: () => { setOpenModallApplyAll(true) },
      //   color: 'primary',
      //   showLabel: true}
    ],
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50],
      disableSelection: false,
      initialState: {
        sorting: {
          sortModel: [{ field: 'employeeName', sort: 'asc' }],
        },
      }
    },
    extraData: {
      dataToUpdate
    }
  });

  const fnUpdateDataToUpdate = (row) => {
    let index;
    let newData = dataToUpdate.find((item, i) => {
      index = i
      return item.employee.id === row.employee.id && item.isOvertime === row.isOvertime
    });
    if (newData) {
      dataToUpdate[index] = row
    } else {
      dataToUpdate.push(row)
    }
    setDataToUpdate([...dataToUpdate]);
  }

  const fnUpdateTotalsHours = (data) => {
    let period = validFloat(customerData.maxReghoursPayroll) === 0 ? 40 : validFloat(customerData.maxReghoursPayroll);
    // setMaxRegHoursPayroll(customerData.maxRegHoursPayroll||40);
    const totals = data.reduce((acc, curr) => {
      acc.totalHours += validFloat(curr.totalHours);
      if (validFloat(curr.totalHoursRegular) > period) {
        acc.totalRegularHours += period;
        acc.totalExtraTimeHours += (validFloat(curr.totalHoursRegular) - validFloat(period));
      } else {
        acc.totalRegularHours += validFloat(curr.totalHoursRegular);
      }
      acc.totalExtraTimeHours += validFloat(curr.totalHoursOvertime);
      curr.weeklyPayrollsOvertimes.map(item => {
        switch (item.overtimeId) {
          case 2:
            acc.totalOvertimeHours += validFloat(item.qty)
            break
          case 3:
            acc.totalHolidayHours += validFloat(item.qty)
            break
          case 4:
            acc.totalDoubleTimeHours += validFloat(item.qty)
            break
          case 5:
            acc.totalRegHoursFixed += validFloat(item.qty)
            break
          case 6:
            acc.totalVACHours += validFloat(item.qty)
            break
          default:
            break;
        }
        return item;
      });

      return acc
    }, { totalRegularHours: 0, totalExtraTimeHours: 0, totalExtraTime: 0, totalOvertimeHours: 0, totalHolidayHours: 0, totalDoubleTimeHours: 0, totalRegHoursFixed: 0, totalVACHours: 0, totalHours: 0 }
    )
    totals.totalHours = totals.totalRegularHours + totals.totalExtraTimeHours + totals.totalOvertimeHours + totals.totalHolidayHours + totals.totalDoubleTimeHours + totals.totalRegHoursFixed + totals.totalVACHours + totals.totalExtraTime;
    setTotalsHours(totals);
  }

  const handleTableData = (value, fieldName, row, data, columns, dataToUpdate, hasOT = false) => {
    if (validFloat(value) > validFloat(customerData.maxReghoursPayroll)) {
      value = 0;
      sweetAlerts('error', t("modal.dailiesPayrolls.errMaxHoursDaily"));
      return;
    }
    let rowToUpdate = data.find((item) => {
      return item.employee.id === row.employee.id && item.isOvertime === row.isOvertime
    });
    if (hasOT) {
      rowToUpdate.hoursWorked[fieldName].hoursOvertime = value
    } else {
      rowToUpdate.hoursWorked[fieldName].hours = value
    }
    rowToUpdate.totalHoursRegular = roundTwoDecimals(Object.keys(rowToUpdate.hoursWorked).reduce((acc, date) => {
      return acc += validFloat(rowToUpdate.hoursWorked[date].hours)
    }, 0))
    rowToUpdate.totalHoursOvertime = roundTwoDecimals(Object.keys(rowToUpdate.hoursWorked).reduce((acc, date) => {
      return acc += validFloat(rowToUpdate.hoursWorked[date].hoursOvertime)
    }, 0))
    let nExtraTime = 0
    rowToUpdate.extraTime = validFloat(rowToUpdate.totalHoursOvertime) + (rowToUpdate.totalHoursRegular > validInt(customerData.maxReghoursPayroll) ? rowToUpdate.totalHoursRegular - validInt(customerData.maxReghoursPayroll) : 0);
    rowToUpdate.regularTime = validFloat(rowToUpdate.totalHoursRegular) <= validFloat(customerData.maxReghoursPayroll) ? rowToUpdate.totalHoursRegular : validInt(customerData.maxReghoursPayroll);
    rowToUpdate.totalHoursOvertime += nExtraTime;
    rowToUpdate.totalHoursFather = validFloat(rowToUpdate.totalHoursRegular) + validFloat(rowToUpdate.totalHoursOvertime) + nExtraTime;

    const { payrollPerdiem, invoicePerdiem } = Object.keys(rowToUpdate.hoursWorked).reduce((acc, curr) => {
      let nQtyHours = validFloat(rowToUpdate.hoursWorked[curr].hours) + validFloat(rowToUpdate.hoursWorked[curr].hoursOvertime);
      if (rowToUpdate.handPerdiem) {
        acc.payrollPerdiem = rowToUpdate.qtyPerdiem;
      } else if (rowToUpdate.fixedPerdiem) {
        acc.payrollPerdiem = nQtyHours > 0 ? 1 : 0;
      } else {
        acc.payrollPerdiem += nQtyHours > 0 ? 1 : 0;
      }

      if (rowToUpdate.handPerdiemInvoice) {
        acc.invoicePerdiem = rowToUpdate.qtyPerdiem2;
      } else if (rowToUpdate.fixedPerdiem2) {
        acc.invoicePerdiem = nQtyHours > 0 ? 1 : 0;
      } else {
        acc.invoicePerdiem += nQtyHours > 0 ? 1 : 0;
      }
      return acc;
    }, { payrollPerdiem: 0, invoicePerdiem: 0 });
    rowToUpdate.qtyPerdiem = payrollPerdiem;
    rowToUpdate.qtyPerdiem2 = invoicePerdiem;

    table.freeActions = table.freeActions.map((action, index) => {
      if (index === 0) {
        action.color = 'success'
        action.disabled = false;
        action.onClick = fnSaveAll
      }
      return action;
    });

    setTable({ ...table, data, columns })
    fnUpdateDataToUpdate(rowToUpdate);
    fnUpdateTotalsHours(data);
  }

  const fnEditHours = (row) => {
    setValueTabSelect(0);
    setCurrentItem(row);
    setOpenModalEnterHours(true);
  }

  const fnClearHours = (rowData, data) => {
    let rowToUpdate = data.find((item) => {
      return item.employee.id === rowData.employee.id && item.isOvertime === rowData.isOvertime
    });
    if (rowToUpdate) {
      Object.keys(rowToUpdate.hoursWorked).forEach((date) => {
        rowToUpdate.hoursWorked[date].hours = '0.00'
        rowToUpdate.hoursWorked[date].hoursOvertime = '0.00'
      });
      rowToUpdate.totalHours = 0;
      rowToUpdate.totalHoursOvertime = 0;
      rowToUpdate.totalHoursFather = 0;
      rowToUpdate.totalHoursRegular = 0;
      rowToUpdate.qtyPerdiem = 0;
      rowToUpdate.qtyPerdiem2 = 0;
      fnUpdateTotalsHours(data);
    }
    table.freeActions = table.freeActions.map((action, index) => {
      if (index === 0) {
        action.color = 'success'
        action.disabled = false;
      }
      return action;
    });
    fnUpdateDataToUpdate(rowData)
  }

  const fnGetPayroll = () => {
    const { startDate, endDate } = weekData;
    setDataToUpdate([]);
    setLoading(true);
    request.GET(`/dailiesPayrolls/find2_0?projectId=${customerData.id}&weekId=${weekId}&customerId=${customerData.customerId}`, (resp) => {
      const currentPLA = [{ value: '0', label: 'Seleccione...' }];
      const payrollLines = resp.payrollLineTypes.map((item) => {
        currentPLA.push({ value: item.id, label: item.name });
        item.qty = 0;
        return item
      });
      setPayrollLinesAll(currentPLA);
      setComplementaryData(resp.complementaryData || {});
      setPayrollLineTypes(payrollLines);
      const currentEmployeesAll = [];
      const data = resp.weeklyPayrolls.map((item) => {
        item.employeeName = item.employee ? item.employee.name : ''
        item.hrs = 1;
        item.isOvertime = 1;
        item.totalHoursRegular = roundTwoDecimals(Object.keys(item.hoursWorked).reduce((acc, date) => {
          return acc += validFloat(item.hoursWorked[date].hours);
        }, 0))
        item.totalHoursOvertime = roundTwoDecimals(Object.keys(item.hoursWorked).reduce((acc, date) => {
          acc += validFloat(item.hoursWorked[date].hoursOvertime);
          return acc;
        }, 0))
        item.totalHoursRegularExt = (item.totalHoursRegular > validInt(customerData.maxReghoursPayroll) ? item.totalHoursRegular - validInt(customerData.maxReghoursPayroll) : 0);
        item.totalHoursFather = validFloat(item.totalHoursRegular) + validFloat(item.totalHoursOvertime);
        item.totalHours = validFloat(item.totalHoursRegular) + validFloat(item.totalHoursOvertime);

        let qtyExtraTime = item.dailies_payrolls.reduce((oldValue, row) => {
          oldValue += validFloat(row.hoursOvertime);
          return oldValue;
        }, 0);

        item.extraTime = qtyExtraTime + (item.totalHoursRegular > validInt(customerData.maxReghoursPayroll) ? item.totalHoursRegular - validInt(customerData.maxReghoursPayroll) : 0);

        item.regularTime = item.totalHoursRegular > validInt(customerData.maxReghoursPayroll) ? item.totalHoursRegular - item.extraTime : item.totalHoursRegular;

        if (validFloat(item.rate) === 0 || validFloat(item.rateOvertime) === 0 || validFloat(item.rateInvoice) === 0 || validFloat(item.rateInvoiceOvertime) === 0) {
          item.employee.name = "*" + item.employee.name
        }
        currentEmployeesAll.push({
          id: item.id,
          employeeId: item.employee?.id ?? 0,
          employeeCode: item.employee?.code ?? '',
          employeeName: item.employeeName,
          classification: item.employee?.classification?.name ?? ''
        });
        return item;
      });
      setEmployeesAll(currentEmployeesAll);

      const dataFilter = data.filter(item => {
        return validInt(item.employeeStatus) === 1 || validFloat(item.totalHours) > 0
      });

      // agregar columnas a tabla
      let totalDays = getDaysDiff(startDate, endDate);
      let arrayDates = [];
      for (let i = 0; i <= totalDays; i++) {
        let dateToConverted = new Date(startDate + 'T12:00:00Z');
        dateToConverted = new Date(dateToConverted.setDate(dateToConverted.getDate() + i));
        arrayDates.push(formatDateToRequest(dateToConverted));
      }

      const maxReghoursPayroll= validFloat(customerData.maxReghoursPayroll) === 0 ? 40 : validFloat(customerData.maxReghoursPayroll);

      let { columns } = table;
      if (dataFilter && dataFilter.length) {
        columns = CustomColumns(defaultColumns, arrayDates, dataFilter?.filter(item => item.isOvertime === 1), handleTableData, fnEditHours, fnClearHours, setOpenModalEnterHours, setCurrentItem, setValueTabSelect, t, dataToUpdate, maxReghoursPayroll)
      }

      table.freeActions = table.freeActions.map((action, index) => {
        if (index === 0) {
          action.color = 'secondary'
          action.disabled = true;
          action.onClick = fnSaveAll
        }
        return action;
      });

      const tableData = {
        ...table, data: dataFilter, columns
      }

      fnUpdateTotalsHours(dataFilter);

      setListDates(arrayDates);
      setTable(tableData);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnGetEmployees = () => {
    setLoading(true);
    request.GET('/employees/list', res => {
      const employeesList = res.employees.map(item => {
        const newItem = {
          id: item.id,
          name: item.code + " | " + item.name,
          name2: item.name
        };
        return newItem;
      });

      setListEmployees(employeesList);
      setLoading(false);
    }, err => {
      console.error(err);
      setLoading(false);
    });
  }

  const fnBackToWeeklyProcess = () => {
    navigate(pathToReturn, {
      replace: true,
      state: []
    });
  }

  const fnShowEmployeesWithoutHours = () => {
  if( enableEmployeesWithoutHours===0){
    return;
  }
  if (customerData.customerId === 0) {
    sweetAlerts('error', t("alertMessages.warning.customerId"));
    return;
  }

  if (weekData.yearId === 0) {
    sweetAlerts('error', t("alertMessages.warning.yearValid"));
    return;
  }

  if (weekId === 0) {
    sweetAlerts('error', t("alertMessages.warning.weekId"));
    return;
  }

  setLoading(true);
  request.GET(`/payroll/employeesWithoutHours?weekId=${weekId}&customerId=${customerData.customerId}`, (resp) => {
    setDataEmployeesWithoutH(resp.data);
    setOpenModalEmployeesWithoutHours(true);
    setLoading(false);
  }, (err) => {
    console.warn(err);
    setLoading(false);
  });
}

  const fnMenuOptions = () => {
    let actions = [
      { icon: () => <Icon>arrow_back</Icon>, name: 'button.backToWeeklyProcess', onClick: fnBackToWeeklyProcess },
      { icon: () => <Rotate90DegreesCcw />, name: 'table.dailiesPayrolls.btnChangeProject', onClick: () => setOpenChangeProject(true) },
      { icon: () => <Icon>playlist_add</Icon>, name: 'button.addEmployee', onClick: (e) => setOpenAddEmployee(true) },
      { icon: () => <Icon>person_add_alt_1</Icon>, name: 'button.newEmployee', onClick: (e) => setOpenNewEmployee(true) },
      { icon: () => <Approval />, name: 'action.applyAll', onClick: (e) => setOpenModallApplyAll(true) },
      { icon: () => <Icon>grid_on</Icon>, name: 'button.importXLSX', onClick: (e) => setOpenModalImportXLSX(true) },
      // { icon: () => <Icon>hourglass_disabled</Icon>, name: 'button.employeesWithoutHours', onClick: fnShowEmployeesWithoutHours }
    ];
    setActions(actions)
  }

  useEffect(() => {
    fnGetPayroll();
    fnMenuOptions();

    request.GET(`/viewWeeklyPayrollsReport?statusId=1&customerId=${customerData.customerId}`, (resp) => {
      const projects = resp.projects.map((item) => {
        return {
          value: item.id,
          label: `${item.code} | ${item.name}`,
          id: item.id,
          code: item.code,
          name: item.name
        }
      });
      setListProjectsCustomer(projects);
    }, (err) => {
      console.warn(err);
    });
  }, [customerData]);

  useEffect(() => {
    setLoading(true);
    request.GET('/employees/findSelectList', res => {
      const { classifications, sectors } = res;

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

      setClassificationList(currClassificationList);
      setSectorList(currSectorList);
      setLoading(false);
    }, err => {
      console.error(err);
      setLoading(false);
    });

    fnGetEmployees();
  }, []);

  const onRefreshData = () => {
    fnGetEmployees();
    fnGetPayroll();
  }

  const propsToModalApplyAll = {
    title: "dialog.enterHours.applyAll",
    DialogContent: ModalApplyAll,
    open: openModalApplyAll,
    setOpen: setOpenModallApplyAll,
    maxWidth: 'xl',
    data: {
      customerData,
      setLoading,
      payrollLinesAll,
      employeesAll
    }
  };
  return (
    {
      t,
      table,
      currentItem,
      totalsHours,
      payrollLineTypes,
      openModalEnterHours,
      valueTabSelect,
      listDates,
      listProjectsCustomer,
      classificationList,
      sectorList,
      listEmployees,
      dataEmployeesWithoutH,
      openChangeProject,
      openAddEmployee,
      openNewEmployee,
      openModalImportXLSX,
      openModalEmployeesWithoutHours,
      setOpenNewEmployee,
      setOpenAddEmployee,
      setOpenChangeProject,
      setOpenModalEnterHours,
      setOpenModalImportXLSX,
      setValueTabSelect,
      setOpenModalEmployeesWithoutHours,
      fnUpdateDataToUpdate,
      fnSaveAll,
      navigate,
      fnGetPayroll,
      onRefreshData,
      sortGridModel, setSortGridModel,
      complementaryData,
      propsToModalApplyAll
    }
  )
}
