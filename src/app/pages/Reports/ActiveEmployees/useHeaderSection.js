import { useState } from 'react';
import { formatDateToShow, validFloat, validInt } from 'app/utils/helpers';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';

export const useHeaderSection = ({t, setLoading, sweetAlerts, setTableData, setEnableFreeActions, setParamsFilter, screenControl}) => {
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

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    customerId: 0,
    noYear: 0,
    weekId: 0
  }, formValidations);

  const {customerId, weekId} = formState;

  const onCustomerChange = e =>{
    const customer = e.target.value;

    if(validFloat(customer)===0) return;

    setLoading(true);
    request.GET(`/weeklyPayrollsDetails/customerWeeksWorks?customerId=${customer}`, (resp)=>{
      const weeksWorks = resp.weeksWorks.map((item)=>{
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

      const yearsList = resp.weeksWorks.map((item)=>{
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
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const onYearChange = e =>{
    const year = e.target.value;

    const filterWeeks = listWeeksWorked.filter(item => item.noYear === year);
    setListWeeks(filterWeeks);

    onBulkForm({
      noYear: year
    });
  }

  const fnGetData = ()=>{
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingParams"));
      return;
    }

    const where = {
      customerId,
      weekId
    }

    const filterWeeks = weekId>0?listWeeks.find(item => item.id === weekId):{};

    const startDate = filterWeeks?.startDate || '';
    const endDate = filterWeeks?.endDate || '';
    const noWeek = filterWeeks?.noWeek || 0;

    setParamsFilter({
      customerId,
      weekId,
      startDate,
      endDate,
      noWeek
    });

    setLoading(true);
    request.POST(`/weeklyPayrollsDetails/getEmployeeWorked`, where, (resp)=>{
      const data = resp.data.map((item, idx)=>{
        item.id = idx;
        item.startDate = formatDateToShow(item.dateStarted);
        return item;
      });
      setTableData(data);
      setEnableFreeActions(false);
      setLoading(false);
    }, (err)=>{
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
      onInputChange,
      onCustomerChange,
      onYearChange,
      fnGetData
    }
  )
}
