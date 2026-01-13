import React, { useEffect, useState } from 'react';
import { request } from 'app/utils/core';
import { formatDateToShow, roundTwoDecimals, validFloat, validInt } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImportExport, Print, Visibility } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Icon } from '@mui/material';

const columnsHiden = ['employeeName', 'classificationName', 'rate', 'rateOvertime', 'hoursWorked', 'regularHours', 'overtimeHours', 'totalHours', 'totalHoursPay', 'totalPayment', 'paymentDeliveryName', 'ciaAccount', 'bankName'];

export const usePayroll = ({ setLoading, sweetAlerts, setActions, screenControl, adminControl }) => {
  const { optCreate, optUpdate } = screenControl;
  const { t } = useTranslation();
  const projectData = useLocation().state;
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [customerId, setCustomerId] = useState(0);
  const [yearId, setYearId] = useState(0);
  const [weekId, setWeekId] = useState(0);
  const [ciaAccount, setCiaAccount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numWeek, setNumWeek] = useState("");
  const [noYear, setNoYear] = useState("");
  const [locationsName, setLocationsName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [projectSelected, setProjectSelected] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listYears, setListYears] = useState([]);
  const [listWeeks, setListWeeks] = useState([]);
  const [listProjects, setListProjects] = useState([]);
  const [listCiaAccounts, setListCiaAccounts] = useState([]);
  const [listLocations, setListLocations] = useState([]);
  const [locationSelected, setLocationSelected] = useState([]);
  const [listWeeksWorked, setListWeeksWorked] = useState([]);
  const [dataPerdiems, setDataPerdiems] = useState([]);
  const [columnsTable, setColumnsTable] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [allColumnsTable, setAllColumnsTable] = useState([]);
  const [allYearList, setAllYearList] = useState([]);
  const [weeksList, setWeeksList] = useState([]);
  const [dataRatesUpdated, setDataRatesUpdated] = useState([]);
  const [payrollTotals, setPayrollTotals] = useState({});
  const [payrollLineTypes, setPayrollLineTypes] = useState({});
  const [currentItem, setCurrentItem] = useState({});
  const [openUpdateRates, setOpenUpdateRates] = useState(false);
  const [openReviewPerdiems, setOpenReviewPerdiems] = useState(false);
  const [openExportAllCust, setOpenExportAllCust] = useState(false);
  const [openExportPayroll, setOpenExportPayroll] = useState(false);
  const [openViewPayroll, setOpenViewDetail] = useState(false);
  const [openViewUpdateRates, setOpenViewUpdateRates] = useState(false);
  const [enableFreeActions, setEnableFreeActions] = useState(true);
  const [showPrintPayroll, setShowPrintPayroll] = useState(false);
  const [originalProjectList, setOriginalProjectList] = useState([]);

  const fnExportPayroll = () => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setShowPrintPayroll(false);
    setOpenExportPayroll(true);
  }

  const fnPrintPayroll = () => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setShowPrintPayroll(true);
    setOpenExportPayroll(true);
  }

  const table = {
    title: `${t("table.payrolls.title")}`,
    columns: columnsTable,
    data: dataTable,
    freeActions: [{
      Icon: () => <ImportExport />,
      label: t("action.exportToExcel"),
      onClick: fnExportPayroll,
      color: 'primary',
      disabled: enableFreeActions
    }, {
      Icon: () => <Print />,
      label: t("action.print"),
      onClick: fnPrintPayroll,
      color: 'secondary',
      disabled: enableFreeActions
    }],
    options: {
      pageSize: 60,
      rowsPerPageOptions: [60, 120, 180, 240],
      showHideColumns: true,
      showMultiSelect: false,
      rowOrder: 'employeeName'
    }
  };

  const onCustomerChange = e => {
    const customer = e.target.value;

    const filter = listCustomers.find((item) => { return validInt(item.value) === validInt(customer); });
    setCustomerName(filter?.label || '');

    fnCustomerChange(customer);
  }

  const fnCustomerChange = (value) => {
    setStartDate("");
    setEndDate("");
    setLocationSelected([]);
    setProjectSelected([]);
    setListLocations([]);
    setListProjects([]);

    if (validFloat(value) === 0) return;

    setLoading(true);
    request.GET(`/weeklyPayrollsDetails/customerWeeksWorks?customerId=${value}`, (resp) => {
      const weeksWorks = resp.weeksWorks.map((item) => {
        return {
          id: item.weekId,
          value: item.weekId,
          label: `#${item.customersWeek.noWeek} WEEK OF ${formatDateToShow(item.customersWeek.startDate)} TO ${formatDateToShow(item.customersWeek.endDate)}`,
          noYear: item.customersWeek?.noYear || '',
          startDate: item.customersWeek?.startDate || '',
          endDate: item.customersWeek?.endDate || '',
          noWeek: item.customersWeek?.noWeek || ''
        }
      });

      const yearsList = resp.weeksWorks.map((item) => {
        return {
          value: item.customersWeek.noYear,
          label: item.customersWeek.noYear
        }
      });
      const filterYears = [...new Map(yearsList.map((item) => [item.label, item])).values()];

      const filterWeeks = weeksWorks.filter(item => item.noYear === (projectData ? projectData.noYear : currentYear));
      setListWeeks(filterWeeks);

      const selectLastWeek = filterWeeks.at(-1);

      setListWeeksWorked(weeksWorks);
      setListYears(filterYears);

      setCustomerId(value);
      setYearId(projectData ? projectData.noYear : currentYear);
      setWeekId(projectData ? projectData.weekId : selectLastWeek.id);
      setCiaAccount("");

      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const onYearChange = e => {
    const year = e.target.value;

    const filterWeeks = listWeeksWorked.filter(item => item.noYear === year);
    setListWeeks(filterWeeks);

    setYearId(year);
  }

  const onWeekChange = e => {
    const week = e.target.value;

    const filterWeeks = listWeeks.find(item => item.id === week);
    if (filterWeeks) {
      setStartDate(filterWeeks.startDate);
      setEndDate(filterWeeks.endDate);
      setNumWeek(filterWeeks.noWeek);
      setNoYear(filterWeeks.noYear);
    } else {
      setStartDate("");
      setEndDate("");
      setNumWeek("");
      setNoYear("");
    }

    setWeekId(week);
    fnWeekChange(week);
  }

  const fnWeekChange = (value) => {
    setListLocations([]);
    setLocationSelected([]);
    setProjectSelected([]);
    setListProjects([]);

    if (validFloat(value) === 0) return;

    setLoading(true);
    request.GET(`/weeklyPayrollsDetails/customerWeekLocations?customerId=${customerId}&weekId=${value}`, (resp) => {
      const locations = resp.locationWorks.reduce((acc, cur) => {
        acc[cur.name] = cur;
        acc[cur.name].selected = projectData ? (cur.id === projectData.locationSelected[0] ? true : false) : true;
        return acc;
      }, {});

      setListLocations(locations);
      fnLocationsChange(locations, value);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const onInputChange = e => {
    const ciaAccountId = e.target.value;
    setCiaAccount(ciaAccountId);
  }

  const fnLocationsChange = (locations, weekSelected = 0) => {
    const locationSelected = Object.keys(locations).reduce((acc, key) => {
      if (locations[key].selected) {
        acc.push(locations[key].id);
      }
      return acc;
    }, []);
    let locationsName = Object.keys(locations || {}).filter((key) => {
      if (locations[key].selected) {
        return locations[key].name;
      }
    }).toString().replaceAll(",", " ,");

    setLocationsName(locationsName);
    setLocationSelected(locationSelected);
    setProjectSelected([]);
    setListProjects([]);
    setOriginalProjectList([]);

    const data = {
      customerId,
      weekId: weekSelected === 0 ? weekId : weekSelected,
      locationId:
        locationSelected
    };

    setLoading(true);
    request.POST(`/weeklyPayrollsDetails/customerWeekProjects`, data, (resp) => {
      const projects = resp.weekProjects.map((item) => {
        return {
          id: item.id,
          name: item.code + " - " + item.name,
          jobReference: item.jobReference
        };
      });

      setOriginalProjectList(resp.weekProjects);

      const projectsList = projects.reduce((acc, cur) => {
        acc[cur.name] = cur;
        acc[cur.name].selected = projectData ? (cur.id === projectData.projectSelected[0] ? true : false) : true;
        acc[cur.name].jobReference = cur.jobReference;
        return acc;
      }, {});

      const projectSelected = Object.keys(projectsList).reduce((acc, key) => {
        if (projectsList[key].selected) {
          acc.push(projectsList[key].id);
        }
        return acc;
      }, []);

      setProjectSelected(projectData ? projectData.projectSelected : projectSelected);

      setListProjects(projectsList);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnProjectsChange = (listProjects) => {
    const projectSelected = Object.keys(listProjects).reduce((acc, key) => {
      if (listProjects[key].selected) {
        acc.push(listProjects[key].id);
      }
      return acc;
    }, []);
    setProjectSelected(projectSelected);
  };

  const fnViewDetail = (data) => {
    let dataWeek = [];
    if (projectData) {
      dataWeek = projectData;
    } else {
      dataWeek = listWeeks.find((item) => {
        return item.id === data.weekId;
      });
    }
    data.customerWeek = dataWeek;
    setCurrentItem(data);
    setOpenViewDetail(true);
  }

  const fnExportAllCustomers = () => {
    setOpenExportAllCust(true);
  }

  const fnGetPayroll = () => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    if (customerId === 0) {
      sweetAlerts('error', t("alertMessages.warning.customerId"));
      return;
    }

    if (yearId === 0) {
      sweetAlerts('error', t("alertMessages.warning.yearValid"));
      return;
    }

    if (weekId === 0) {
      sweetAlerts('error', t("alertMessages.warning.weekId"));
      return;
    }

    const where = {
      customerId,
      weekId,
      projectList: projectSelected,
      ciaAccount
    };

    setLoading(true);
    request.POST(`/weeklyPayrollsDetails/getDetaPayroll`, where, (resp) => {
      if (!resp.detaPayroll) {
        setPayrollTotals({});
        setLoading(false);
      }

      const data = resp.detaPayroll.map((item) => {
        item.employeeName = item.employee.name;
        item.projectName = item.project.code || "";
        item.classificationName = item.employee.classification ? item.employee.classification.name : '';
        item.rateByCustomer = roundTwoDecimals(item.rate) || 0;
        item.overtimeRate = roundTwoDecimals(item.rateOvertime) || 0;
        item.hoursWorked = roundTwoDecimals(item.hoursWorked) || 0;
        item.regularHours = roundTwoDecimals(item.regularHours) || 0;
        item.overTimeHours = roundTwoDecimals(item.overtimeHours) || 0;
        item.totalHoursValue = roundTwoDecimals(item.totalHoursValue) || 0;
        item.totalRegularHours = roundTwoDecimals(item.regularValue) || 0;
        item.totalOvertimeHours = roundTwoDecimals(item.overtimeValue) || 0;
        item.payTotalHours = roundTwoDecimals(validFloat(item.totalHoursValue)) || 0;
        item.adjustment = roundTwoDecimals(item.totalAdjustments) || 0;
        item.deduction = roundTwoDecimals(item.totalDeductions) || 0;
        item.totalPerDiem = roundTwoDecimals(item.totalPerdiem) || 0;
        item.totalPayment = roundTwoDecimals(item.totalPayment) || 0;
        return item;
      });

      const addColumns = resp.columnsTable.map((item) => {
        item.headerName = t(item.title);
        item.minWidth = item.field === "employeeName" ? 170 : (item.field === "classificationName" || item.field === "totalPayment" ? 120 : 90);

        if (item.field === "employeeName") {
          item.pinning = true;
          item.pinningDirection = 'left';
          item.pinningPosition = 0;
        } else if (item.field === "classificationName") {
          item.pinning = true;
          item.pinningDirection = 'left';
          item.pinningPosition = 170;
        } else if (item.field === "rate") {
          item.pinning = true;
          item.pinningDirection = 'left';
          item.pinningPosition = 316;
        } else if (item.field === "totalPayment") {
          item.pinning = true;
          item.pinningDirection = 'right';
          item.pinningPosition = 70;
        }
        item.hidden = columnsHiden.includes(item.field) ? false : true;
        item.decimal = (item.type === 'currency' || item.type === 'number') ? 2 : 0;
        item.prefix = item.type === 'currency' ? '$ ' : '';
        return item;
      });

      addColumns.push({
        headerName: t("table.common.actions"),
        field: 'actions',
        type: 'actions',
        width: 70,
        pinning: true,
        pinningDirection: 'right',
        pinningPosition: 0,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Visibility />}
            label={t("action.detail")}
            onClick={() => fnViewDetail(row)}
            color={(validFloat(row.regularHours) < 40 && validFloat(row.overTimeHours) > 0) ? 'error' : 'info'}
          />
        ]
      });

      setColumnsTable(addColumns);
      setDataTable(data);
      setPayrollTotals(resp.totals || {});
      setPayrollLineTypes(resp.payrollLineTypes || {});
      setDataPerdiems(resp.listPerdiem);

      fnMenuOptions();
      setEnableFreeActions(false);

      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnOkUpdatePayrollRates = () => {
    if (optUpdate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    if (validInt(customerId) === 0 || validInt(weekId) === 0 || projectSelected.length <= 0 || locationSelected.length <= 0) {
      return;
    }

    const data = {
      customerId,
      customerWeekId: weekId,
      projectSelected,
      locationSelected
    }

    request.PUT('/weeklyPayrollsDetails/updatePayrollRates', data, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
      const data = resp.data.map((item, idx) => {
        item.id = idx
        return item
      });
      setDataRatesUpdated(data);
      fnGetPayroll();
      setOpenViewUpdateRates(true);
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

  const fnBackToJobs = () => {
    navigate(projectData.pathToReturn, {
      replace: true,
      state: []
    });
  }

  const fnMenuOptions = () => {
    let actions = [];
    if (projectData) {
      actions = [
        { icon: () => <Icon>arrow_back</Icon>, name: 'button.backToWeeklyProcess', onClick: fnBackToJobs },
        { icon: () => <Icon>attach_money</Icon>, name: "button.updatePayrollRates", onClick: setOpenUpdateRates },
        { icon: () => <Icon>price_check</Icon>, name: "button.reviewPayrollPerdiems", onClick: setOpenReviewPerdiems }
      ];
    } else {
      actions = [
        { icon: () => <Icon>attach_money</Icon>, name: "button.updatePayrollRates", onClick: setOpenUpdateRates },
        { icon: () => <Icon>price_check</Icon>, name: "button.reviewPayrollPerdiems", onClick: setOpenReviewPerdiems }
      ];
    }

    setActions(actions);
  };

  useEffect(() => {
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

    setLoading(true);
    request.GET('/employees/findCiaAccount', (resp) => {
      const ciaAccount = resp.ciaAccount.map((item) => {
        return {
          value: item.ciaAccount,
          label: item.ciaAccount === "" ? "All" : item.ciaAccount
        }
      });
      setListCiaAccounts(ciaAccount);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/weeklyPayrollsDetails/findFieldsToExport', (resp) => {
      const fieldsToExport = resp.data;
      setAllColumnsTable(fieldsToExport);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/setWeekYear/getYears', (resp) => {
      const filterList = resp.yearsWeeks.filter((item) => {
        return item.year !== null
      });
      const yearsList = filterList.map((item) => {
        return {
          value: item.year,
          label: item.year
        }
      });
      setAllYearList(yearsList);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/setWeekYear', (resp) => {
      const weeksYear = resp.setWeekYear.map((item) => {
        return {
          id: item.id,
          value: item.id,
          label: `#${item.noWeek} WEEK OF ${formatDateToShow(item.startDate)} TO ${formatDateToShow(item.endDate)}`,
          year: item.year,
          startDate: item.startDate,
          endDate: item.endDate,
          noWeek: item.noWeek
        }
      });
      setWeeksList(weeksYear);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }, [setLoading]);

  useEffect(() => {
    if (projectData) {
      fnMenuOptions();
      fnCustomerChange(projectData.customerId);
    }
  }, [yearId]);

  useEffect(() => {
    if (projectData && projectSelected.length > 0) {
      fnGetPayroll();
    }
  }, [projectSelected]);

  const propsToFilterPayroll = {
    t,
    customerId,
    yearId,
    weekId,
    ciaAccount,
    listCustomers,
    listYears,
    listWeeks,
    listProjects,
    listCiaAccounts,
    projectSelected,
    listLocations,
    locationSelected,
    setListLocations,
    setLocationSelected,
    setProjectSelected,
    setListProjects,
    onCustomerChange,
    onYearChange,
    onWeekChange,
    onInputChange,
    fnLocationsChange,
    fnProjectsChange,
    fnGetPayroll,
    fnExportAllCustomers
  }

  return (
    {
      t,
      propsToFilterPayroll,
      table,
      payrollLineTypes,
      payrollTotals,
      currentYear,
      allColumnsTable,
      allYearList,
      weeksList,
      columnsTable,
      startDate,
      endDate,
      customerId,
      weekId,
      customerName,
      numWeek,
      noYear,
      locationsName,
      ciaAccount,
      projectSelected,
      showPrintPayroll,
      currentItem,
      dataPerdiems,
      dataRatesUpdated,
      openViewPayroll,
      openExportAllCust,
      openExportPayroll,
      openReviewPerdiems,
      openUpdateRates,
      openViewUpdateRates,
      optUpdate,
      setOpenExportAllCust,
      setOpenExportPayroll,
      setOpenViewDetail,
      setOpenReviewPerdiems,
      setOpenUpdateRates,
      setOpenViewUpdateRates,
      fnGetPayroll,
      fnOkUpdatePayrollRates,
      originalProjectList
    }
  )
}
