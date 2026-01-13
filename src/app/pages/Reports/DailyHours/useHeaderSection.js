import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { formatDateToRequest, formatDateToShow, getDaysDiff, roundTwoDecimals, validFloat, validInt } from 'app/utils/helpers';
import React, { useState } from 'react'
import { CustomColumns } from './CustomColumns';

export const useHeaderSection = ({ t, setLoading, sweetAlerts, table, dataWeek, setTable, screenControl, defaultColumns, listCustomers, setCustomerName, setDataWeek, fnExportDocumentXLSX }) => {
  const { optCreate } = screenControl;
  const currentYear = new Date().getFullYear();
  const [sendForm, setSendForm] = useState(false);
  const [listYears, setListYears] = useState([]);
  const [listWeeks, setListWeeks] = useState([]);
  const [listWeeksWorked, setListWeeksWorked] = useState([]);

  const formValidations = {
    customerId: [(val) => validInt(val) !== 0, t("alertMessages.warning.customerId")],
    noYear: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    weekId: [(val) => validInt(val) !== 0, t("alertMessages.warning.noWeek")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    customerId: 0,
    noYear: 0,
    weekId: 0
  }, formValidations);

  const {customerId, weekId} = formState;

  const onCustomerChange = e => {
    const customer = e.target.value;

    if (validFloat(customer) === 0) return;

    const filterCust = listCustomers.find(item => item.id === validInt(customer));
    setCustomerName(filterCust.label);

    setLoading(true);
    request.GET(`/weeklyPayrollsDetails/customerWeeksWorks?customerId=${customer}`, (resp) => {
      const weeksWorks = resp.weeksWorks.map((item) => {
        return {
          id: item?.customersWeek.id || 0,
          value: item?.customersWeek.id || 0,
          label: `#${item?.customersWeek.noWeek || 0} WEEK OF ${formatDateToShow(item?.customersWeek.startDate || '')} TO ${formatDateToShow(item?.customersWeek.endDate || '')}`,
          noYear: item?.customersWeek.noYear,
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

      const filterWeeks = weeksWorks.filter(item => item.noYear === (currentYear));
      setListWeeks(filterWeeks);

      setListWeeksWorked(weeksWorks);
      setListYears(filterYears);

      onBulkForm({
        customerId: customer,
        noYear: currentYear,
        weekId: 0
      });

      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const onYearChange = e => {
    setListProjects([]);
    const year = e.target.value;

    const filterWeeks = listWeeksWorked.filter(item => item.noYear === year);
    setListWeeks(filterWeeks);

    onBulkForm({
      noYear: year
    });
  }

  const onWeekChange = (e) => {
    const week = e.target.value;
    onInputChange({ target: { name: 'weekId', value: week } });

    const filter = listWeeksWorked.find(item => item.id === validInt(week));
    setDataWeek(filter);
  }

  const fnGetData = () => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingParams"));
      return;
    }

    const { startDate, endDate } = dataWeek;

    setLoading(true);
    request.GET(`/dailiesPayrolls/findDailyHours?weekId=${weekId}&customerId=${customerId}`, (resp) => {
      const data = resp.weeklyPayrolls.map((item) => {
        item.employeeName = item.employee ? item.employee.name : ''
        item.totalHoursRegular = roundTwoDecimals(Object.keys(item.hoursWorked).reduce((acc, date) => {
          return acc += validFloat(item.hoursWorked[date].hours);
        }, 0))
        item.totalHoursOvertime = roundTwoDecimals(Object.keys(item.hoursWorked).reduce((acc, date) => {
          acc += validFloat(item.hoursWorked[date].hoursOvertime);
          return acc;
        }, 0));
        item.totalHours = validFloat(item.totalHoursRegular) + validFloat(item.totalHoursOvertime)
        item.oThours = validFloat(item.totalHoursOvertime)
        item.project = item.projectName
        return item;
      });

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

      let { columns } = table;
      if (dataFilter && dataFilter.length) {
        columns = CustomColumns(defaultColumns, arrayDates, t);
      }

      table.freeActions = table.freeActions.map((action, index) => {
        if (index === 0) {
          action.color = 'primary'
          action.disabled = false;
          action.onClick = () => fnExportDocumentXLSX(customerId, weekId, arrayDates);
        }
        return action;
      });

      const tableData = {
        ...table, data: dataFilter, columns
      }

      setTable(tableData);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  return (
    {
      formState,
      formValidation,
      isFormValid,
      sendForm,
      listWeeks,
      listYears,
      onCustomerChange,
      onWeekChange,
      onYearChange,
      fnGetData
    }
  )
}
