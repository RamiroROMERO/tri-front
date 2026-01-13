import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { formatDateToShow, validFloat, validInt } from 'app/utils/helpers';
import React, { useEffect, useState } from 'react'


export const useFilter = ({ setLoading, t, setDataTable }) => {

  const [customerList, setCustomerList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [weekList, setWeekList] = useState([]);
  const [weeksForYear, setWeeksForYear] = useState([]);
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    customerId: [(val) => validInt(val) !== 0, t("alertMessages.warning.customerId")],
    yearId: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    weekId: [(val) => validInt(val) !== 0, t("alertMessages.warning.noWeek")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, } = useForm({
    customerId: 0,
    yearId: 0,
    weekId: 0,
  }, formValidations);

  const { customerId, yearId, weekId } = formState;

  const fnInitData = () => {

    request.GET('/customers/getSL', res => {
      const { customers } = res;
      const optionsToCustomerList = customers.map(item => {
        item.label = item.name;
        item.value = item.id;
        return item;
      });
      setCustomerList(optionsToCustomerList);
    }, err => {
      console.error(err);
    });

  }

  const onCustomerChange = e => {
    const customer = e.target.value;

    if (validFloat(customer) === 0) return;

    setLoading(true);
    request.GET(`/weeklyPayrollsDetails/customerWeeksWorks?customerId=${customer}`, (resp) => {
      const newWeeksList = resp.weeksWorks.map((item) => {
        return {
          id: item?.customersWeek.id || 0,
          value: item?.customersWeek.id || 0,
          label: `#${item?.customersWeek.noWeek || 0} WEEK OF ${formatDateToShow(item?.customersWeek.startDate || '')} TO ${formatDateToShow(item?.customersWeek.endDate || '')}`,
          yearId: item?.customersWeek.noYear,
        }
      });

      const yearsList = resp.weeksWorks.map((item) => {
        return {
          value: item.customersWeek.noYear,
          label: item.customersWeek.noYear
        }
      });
      const filterYears = [...new Map(yearsList.map((item) => [item.label, item])).values()];

      const filterWeeks = newWeeksList.filter(item => item.noYear === (yearId));
      setYearList(filterYears);
      setWeekList(newWeeksList);
      setWeeksForYear(filterWeeks);

      onBulkForm({
        customerId: customer,
        noYear: yearId,
        weekId: 0
      });

      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const onYearChange = (e) => {
    const { value } = e.target
    const weeks = weekList.filter(item => item.yearId === value);
    setWeeksForYear(weeks);
    onInputChange({ target: { name: 'yearId', value } })
  }

  const fnGeteneratePerdiems = () => {

    setSendForm(true);
    if (!isFormValid) {
      return;
    }

    setLoading(true);
    request.GET(`/invoices?customerId=${customerId}&weekId=${weekId}`, (resp) => {
      const { invoices } = resp;
      const newInvoices = invoices.map(elem => {
        elem.projectName = `${elem.project.code} - ${elem.project.name}`;
        elem.customerName = `${elem.customer.code} - ${elem.customer.name}`;
        elem.week = `${elem.customersWeek.noWeek} - ${elem.customersWeek.noYear}`;
        return elem;
      });

      setDataTable(newInvoices);

      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

  }

  useEffect(() => {

    fnInitData()

  }, [])

  return {
    formState,
    onInputChange,
    customerList,
    yearList,
    weeksForYear,
    onCustomerChange,
    onYearChange,
    formValidation,
    sendForm,
    isFormValid,
    fnGeteneratePerdiems,
  };
}
