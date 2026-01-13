import React, { useState, useEffect } from 'react'
import _ from 'lodash';
import { useForm } from 'app/hooks';
import { validInt, currencyFormatter, roundTwoDecimals, formatDateToShow, validFloat } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';
import { request } from 'app/utils/core';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { FeaturedPlayList, Visibility, ImportExport } from '@mui/icons-material';


export const useChecks = ({ setLoading, sweetAlerts, screenControl }) => {
  const { optCreate } = screenControl;
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const [rowsSelectedCount, setRowsSelectedCount] = useState(0);
  const [listYears, setListYears] = useState([]);
  const [listWeeks, setListWeeks] = useState([]);
  const [listWeeksWorked, setListWeeksWorked] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState([]);
  const [listQbAccounts, setListQbAccounts] = useState([]);
  const [listExpenses, setListExpenses] = useState([]);
  const [listBanks, setListBanks] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [detaData, setDetaData] = useState([]);
  const [tableRowsSelected, setTableRowsSelected] = useState([]);
  const [rowsSelected, setRowsSelected] = useState([]);
  const [expenseSelected, setExpenseSelected] = useState({});
  const [currentItem, setCurrentItem] = useState({});
  const [detailData, setDetailData] = useState({});
  const [endDate, setEndDate] = useState("");
  const [numWeek, setNumWeek] = useState("");
  const [sendForm, setSendForm] = useState(false);
  const [enableFreeActions, setEnableFreeActions] = useState(true);
  const [openModalViewDetail, setOpenModalViewDetail] = useState(false);
  const [openModalGenerateChecks, setOpenModalGenerateChecks] = useState(false);
  const [openModalExportChecks, setOpenModalExportChecks] = useState(false);
  const [ciaAccountList, setCiaAccountList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [checkTotals, setCheckTotals] = useState(0);
  const companyData = JSON.parse(localStorage.getItem('mw-company-data'));

  const [columnsExportList, setColumnsExportList] = useState([]);

  const formValidations = {
    noYear: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    weekId: [(val) => validInt(val) !== 0, t("alertMessages.warning.weekId")],
    // quickBookCompany: [(val) => validInt(val) !== 0, t("warning.accountSelected")],
    // expenseId: [(val) => validInt(val) !== 0, t("warning.accountSelected")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    noYear: currentYear,
    weekId: 0,
    quickBookCompany: 0,
    expenseId: 0
  }, formValidations);

  const { formState: formFilterState, onInputChange: onFilterChange, onResetForm: onFilterReset } = useForm({
    ciaAccount: '',
    deliveryType: '',
    projectName: ''
  }, {});


  const { ciaAccount: ciaAccountFilter, deliveryType: deliveryTypeFilter, projectName: projectNameFilter } = formFilterState;


  useEffect(() => {
    let dataFilter = [...detaData];
    if (ciaAccountFilter !== '') {
      dataFilter = dataFilter.filter(item => item.ciaAccount === ciaAccountFilter);
    }
    if (deliveryTypeFilter !== '') {
      dataFilter = dataFilter.filter(item => item.deliveryTypeName === deliveryTypeFilter);
    }

    if (projectNameFilter !== '') {
      dataFilter = dataFilter.filter(item => item.project === projectNameFilter);
    }

    setTableData(dataFilter);

  }, [ciaAccountFilter, deliveryTypeFilter, projectNameFilter])


  const { noYear, quickBookCompany } = formState;

  const fnViewDetail = (rowSelected) => {
    const filterDetailData = detailData.find(item => item.employee.id === rowSelected.id);
    rowSelected.linesCheck = filterDetailData;

    setCurrentItem(rowSelected);
    setOpenModalViewDetail(true);
  }

  const fnGenerateChecks = () => {
    setOpenModalGenerateChecks(true);
  }

  const fnExportList = () => {
    setOpenModalExportChecks(true);
  }


  const fnTableRowSelected = (newSelectionModel) => {
    if (newSelectionModel.length > 0) {
      setEnableFreeActions(false);
    } else {
      setEnableFreeActions(true);
    }

    setTableRowsSelected([]);
    setRowsSelected([]);

    const dataSelected = [];

    newSelectionModel.forEach(idSelect => {
      const filterData = tableData.find(item => item.id === idSelect);
      dataSelected.push(filterData);
    });
    let dataOrder = []
    if (deliveryTypeFilter === 'Send') { // Entregar
      dataOrder = _.sortBy(dataSelected, ['project', 'paymentDeliveryType', 'name'], ['asc', 'asc', 'asc']);
    } else { // Depositar
      dataOrder = _.sortBy(dataSelected, ['name'], ['asc']);
    }
    // } else {
    //   dataOrder = _.sortBy(dataSelected, ['project', 'paymentDeliveryType', 'name'], ['asc', 'asc', 'asc']);
    // }
    setRowsSelected(dataOrder);
    setRowsSelectedCount(dataSelected.length);
    setTableRowsSelected(newSelectionModel)
  }

  const table = {
    title: t("table.checks.title"),
    columns: [
      { field: 'code', headerName: t('table.employees.column.code'), flex: 0.5 },
      { field: 'name', headerName: t('table.dailiesPayrolls.column.employeeName'), flex: 1 },
      { field: 'nameInCheck', headerName: t('table.check.column.employee'), flex: 1 },
      // { field: 'needCheck', headerName: t('table.employees.column.needCheck'), flex: 0.4 },
      { field: 'bankName', headerName: t('table.check.column.bankName'), flex: 0.6, hide: true },
      { field: 'ciaAccount', headerName: t('table.employees.column.ciaAccount'), flex: 0.6 },
      { field: 'customerName', headerName: t('table.dailiesPayrolls.column.customerName'), flex: 0.6 },
      { field: 'classificationName', headerName: t('table.common.classifications'), flex: 0.6, hide: true },
      { field: 'deliveryTypeName', headerName: t('table.common.deliveryType'), flex: 0.6 },
      { field: 'project', headerName: t('table.common.project'), flex: 0.6 },
      { field: 'totalHours', headerName: t('table.dailiesPayrolls.column.totalHours'), flex: 0.4 },
      {
        field: 'totalPayment', headerName: t('table.payrolls.column.totalPay'), flex: 0.7, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 90,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Visibility />}
            label={t("button.edit")}
            onClick={() => fnViewDetail(row)}
            color='info'
          />
        ],
      }
    ],
    data: tableData,
    freeActions: [{
      Icon: () => <ImportExport />,
      label: t("action.export"),
      onClick: fnExportList,
      color: 'primary',
      disabled: enableFreeActions
    }, {
      Icon: () => <FeaturedPlayList />,
      label: t("action.generateChecks"),
      onClick: fnGenerateChecks,
      color: 'primary',
      disabled: enableFreeActions
    }],
    options: {
      pageSize: 25,
      rowsPerPageOptions: [10, 25, 50, 75, 100],
      checkboxSelection: true,
      onSelectionModelChange: (newSelectionModel) => fnTableRowSelected(newSelectionModel),
      selectionModel: tableRowsSelected
    }
  };

  const onYearChange = e => {
    const year = e.target.value;

    onBulkForm({ noYear: year });
  }

  const onWeekChange = e => {
    const week = e.target.value;

    const filterWeeks = listWeeks.find(item => item.id === week);
    if (filterWeeks) {
      setEndDate(filterWeeks.endDate);
      setNumWeek(filterWeeks.noWeek);
    } else {
      setEndDate("");
      setNumWeek("");
    }

    const noWeek = filterWeeks?.noWeek || 0;

    setLoading(true);
    request.GET(`/weeklyPayrollsDetails/findCustomerWorks?noYear=${noYear}&noWeek=${noWeek}`, (resp) => {
      const customers = resp.customerList.map((item) => {
        return {
          id: item.customerId,
          name: item.customer.name
        }
      });

      const customersList = customers.reduce((acc, cur) => {
        acc[cur.name] = cur;
        acc[cur.name].selected = true;
        return acc;
      }, {});

      fnCustomersChange(customersList);

      setListCustomers(customersList);

      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    onBulkForm({ weekId: week });
  }

  const onQuickBookCompanyChange = e => {
    const qbCompany = e.target.value;

    setListExpenses([]);
    setListBanks([]);
    setExpenseSelected({});

    if (validInt(qbCompany) === 0) {
      return;
    }

    const dataToExpenses = {
      qboCompany: qbCompany,
      where: { AccountType: "Expense" }
    }

    setLoading(true);
    request.POST('/qboAPI/getAccounts', dataToExpenses, (resp) => {
      const expenseAccounts = resp.data.map((item) => {
        return {
          id: item.id,
          value: item.id,
          label: item.name
        }
      });

      setListExpenses(expenseAccounts);
      setLoading(false);
    }, (err) => {
      setListExpenses([]);
      console.warn(err);
      setLoading(false);
    });

    const dataToBanks = {
      qboCompany: qbCompany,
      where: { AccountType: "Bank" }
    }

    setLoading(true);
    request.POST('/qboAPI/getAccounts', dataToBanks, (resp) => {
      const bankAccounts = resp.data.map((item) => {
        return {
          id: item.id,
          value: item.id,
          label: item.name
        }
      });

      setListBanks(bankAccounts);
      setLoading(false);
    }, (err) => {
      setListBanks([]);
      console.warn(err);
      setLoading(false);
    });

    onBulkForm({ quickBookCompany: qbCompany });
  }

  const onExpenseChange = e => {
    const expense = e.target.value;

    const filter = listExpenses.find(item => item.value === expense);
    setExpenseSelected({ id: expense, name: filter?.label || '' });

    onBulkForm({ expenseId: expense });
  }

  const fnCustomersChange = (customersList) => {
    const customerSelected = Object.keys(customersList).reduce((acc, key) => {
      if (customersList[key].selected) {
        acc.push(customersList[key].id);
      }
      return acc;
    }, []);

    setCustomerSelected(customerSelected);
  }

  const fnGetChecks = () => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    if (customerSelected.length === 0) {
      sweetAlerts('error', t("warning.customerSelected"));
      return;
    }

    const data = {
      noWeek: numWeek,
      noYear,
      customers: customerSelected,
      AccountRef: expenseSelected,
    };

    setTableData([]);
    setDetaData([]);
    setLoading(true);
    request.POST(`/weeklyPayrollsDetails/getChecks`, data, (resp) => {
      const { totals } = resp;
      const data = resp.detaChecks.map((item) => {
        item.employeeCode = item.code;
        item.originalNameInCheck = item.nameInCheck;
        item.needCheck = item.needCheck == true ? "Yes" : "No";
        item.employeeName = item.name;
        item.payrollPerDiemAmount = roundTwoDecimals(item.payrollPerDiemAmount);
        item.invoicePerDiemAmount = roundTwoDecimals(item.invoicePerDiemAmount);
        item.rateByCustomer = roundTwoDecimals(item.rateByCustomer);
        item.iconStatus = 'pending'
        item.colorStatus = '#ea9c10'
        return item;
      });

      const newCiaAccount = [{ value: '', label: 'Seleccione...' }];
      const newProjectList = [{ value: '', label: 'Seleccione...' }];

      data.map(elem => {
        const { ciaAccount: ciaName, project } = elem;
        const findCia = newCiaAccount.some(cia => cia.value === ciaName);
        const findProject = newProjectList.some(prj => prj.value === project);
        if (!findCia) {
          newCiaAccount.push({
            value: ciaName,
            label: ciaName
          });
        }
        if (!findProject) {
          newProjectList.push({
            value: project,
            label: project
          })
        }
      });

      setCiaAccountList(newCiaAccount);
      setProjectList(newProjectList);

      setTableData(data);
      setDetaData(data);
      setDetailData(resp.dataChecks);
      // const totals = data.reduce((pre, curr) => {
      //   pre += validFloat(curr.totalPayment)
      //   return pre;
      // }, 0)
      setCheckTotals(totals);
      setLoading(false);
    }, (err) => {
      setTableData([]);
      setDetaData([]);
      setProjectList([]);
      setCiaAccountList([]);
      console.warn(err);
      setLoading(false);
    });
  }

  useEffect(() => {
    setLoading(true);
    request.GET('/setWeekYear/getYears', (resp) => {
      const yearsList = resp.yearsWeeks.filter(item => item.year !== null).map((item) => {
        return {
          value: item.year,
          label: item.year
        }
      });
      setListYears(yearsList);
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

      setListWeeksWorked(weeksYear);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/qbAccounts', (resp) => {
      // request.GET('/qbkBusiness?hasChecks=1', (resp) => {
      const qBAccounts = resp.QBAccounts.reduce((acc, curr) => {
        let cNameAcc = curr.name;
        curr.qbCompanies.map((elem) => {
          if (validInt(elem.hasChecks) == 1) {
            let newItem = { value: elem.id, label: `${cNameAcc} - ${elem.name}` };
            acc.push(newItem);
          }
        });
        return acc;
      }, []);
      // const qBAccounts = resp.qbkBusiness.map(item => {
      //   return {
      //     value: item.id,
      //     label: item.name
      //   };
      // });
      setListQbAccounts(qBAccounts);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    request.GET('/checks/getFieldsToExport', (resp) => {
      const { data } = resp;
      setColumnsExportList(data);
    }, err => {
      console.error(err);
    })
  }, []);

  useEffect(() => {
    onBulkForm({ weekId: 0 });
    let weeksFilter = listWeeksWorked.filter((item) => {
      return item.year === noYear;
    });

    setListWeeks(weeksFilter);
  }, [listWeeksWorked, noYear]);

  const propsToFilterChecks = {
    t,
    formState,
    formValidation,
    isFormValid,
    sendForm,
    listCustomers,
    listYears,
    listWeeks,
    customerSelected,
    listQbAccounts,
    listExpenses,
    setListCustomers,
    setCustomerSelected,
    onYearChange,
    onWeekChange,
    onQuickBookCompanyChange,
    onExpenseChange,
    fnCustomersChange,
    fnGetChecks
  }

  return (
    {
      propsToFilterChecks,
      table,
      currentItem,
      openModalExportChecks,
      openModalGenerateChecks,
      openModalViewDetail,
      setOpenModalExportChecks,
      setOpenModalGenerateChecks,
      setOpenModalViewDetail,
      rowsSelected,
      detailData,
      listBanks,
      quickBookCompany,
      endDate,
      setTableRowsSelected,
      rowsSelectedCount,
      checkTotals,
      expenseSelected,
      onFilterChange,
      formFilterState,
      projectList,
      ciaAccountList,
      onFilterReset,
      columnsExportList,
    }
  )
}
