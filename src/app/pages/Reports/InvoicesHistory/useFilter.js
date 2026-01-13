import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { formatDateToShow, validFloat, validInt } from 'app/utils/helpers';
import React, { useEffect, useState } from 'react'


export const useFilter = ({ setLoading, t, setDataTable, setInvoiceTotals }) => {

  const [customerList, setCustomerList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [weekList, setWeekList] = useState([]);
  const [weeksForYear, setWeeksForYear] = useState([]);
  const [sendForm, setSendForm] = useState(false);

  const [customerId, setCustomerId] = useState(0);
  const [yearId, setYearId] = useState(0);
  const [weekId, setWeekId] = useState(0);

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

  const fnGetData = () => {

    if (validInt(customerId) === 0 || validInt(yearId) === 0 || validInt(weekId) === 0) {
      return;
    }
    // setSendForm(true);
    // if (!isFormValid) {
    //   return;
    // }

    setLoading(true);
    request.GET(`/invoices?customerId=${customerId}&weekId=${weekId}`, (resp) => {
      const { invoices } = resp;
      let currentTotal = 0;
      const newInvoices = invoices.map(elem => {
        elem.projectName = `${elem?.project?.code || ''} - ${elem?.project?.name || ''}`;
        elem.customerName = `${elem?.customer?.code || ''} - ${elem.customer.name}`;
        elem.week = `${elem.customersWeek.noWeek} - ${elem.customersWeek.noYear}`;
        currentTotal += validFloat(elem.total);
        return elem;
      });

      setDataTable(newInvoices);
      setInvoiceTotals(currentTotal)

      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

  }

  useEffect(() => {

    fnInitData()

  }, [])

  useEffect(() => {

    if (validInt(customerId) === 0) return;
    setLoading(true);
    request.GET(`/weeklyPayrollsDetails/customerWeeksWorks?customerId=${customerId}`, (resp) => {
      const newWeeksList = resp.weeksWorks.map((item) => {
        return {
          id: item?.customersWeek.id || 0,
          value: item?.customersWeek.id || 0,
          label: `#${item?.customersWeek.noWeek || 0} WEEK OF ${formatDateToShow(item?.customersWeek.startDate || '')} TO ${formatDateToShow(item?.customersWeek.endDate || '')}`,
          yearId: item?.customersWeek.noYear,
        }
      });

      setWeekList(newWeeksList);

      const yearsArray = resp.weeksWorks.reduce((acc, cur) => {
        acc[cur.customersWeek.noYear] = cur.customersWeek.noYear;
        return acc;
      }, {});

      const yearList = Object.keys(yearsArray).map(elem => {
        const newItem = {
          value: elem,
          label: elem
        };
        return newItem
      });

      setWeeksForYear([]);

      const currentYear = new Date().getFullYear();
      const filterWeeks = newWeeksList.filter(item => validInt(item.yearId) === validInt(currentYear));

      setWeeksForYear(filterWeeks);
      const selectLastWeek = filterWeeks.at(-1);
      setYearList(yearList || []);
      setYearId(currentYear);
      setWeekId(selectLastWeek.id);

      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

  }, [customerId])

  useEffect(() => {
    const weeks = weekList.filter(item => validInt(item.yearId) === validInt(yearId));
    setWeeksForYear(weeks);
    setWeekId(0);

  }, [yearId])


  return {
    customerList,
    yearList,
    weeksForYear,
    customerId,
    setCustomerId,
    weekId,
    setWeekId,
    yearId,
    setYearId,
    fnGetData,
    setSendForm
  };
}
