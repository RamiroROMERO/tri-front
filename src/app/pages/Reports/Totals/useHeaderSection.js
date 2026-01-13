import { useState, useEffect } from 'react'
import { useForm } from 'app/hooks';
import { validFloat, validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const useHeaderSection = ({t, setLoading, sweetAlerts, setTotalsData, listWeeksWorked, setTableData, setParamsFilter, setEnableFreeActions, screenControl}) => {
  const { optCreate } = screenControl;
  const currentYear = new Date().getFullYear();
  const [listWeeks, setListWeeks] = useState([]);
  const [sendForm, setSendForm] = useState(false);
  const [openModalFilterByProject, setOpenModalFilterByProject] = useState(false);

  const formValidations = {
    noYear: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    weekId: [(val) => validInt(val) !== 0, t("alertMessages.warning.noWeek")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    noYear: currentYear,
    weekId: 0
  }, formValidations);

  const {noYear, weekId} = formState;

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

    const filterWeeks = weekId>0?listWeeks.find(item => item.id === weekId):{};

    const noWeek = filterWeeks?.noWeek || 0;

    const totalData = {
      regularHours: 0,
      overtimeHours: 0,
      totalHours: 0,
      regularPayment: 0,
      overtimePayment: 0,
      totalPayment: 0
    };

    setTableData([]);
    setTotalsData({});
    setParamsFilter({noYear, noWeek});
    setLoading(true);
    request.GET(`/reportPayrollMain/groupByCustomer?noYear=${noYear}&noWeek=${noWeek}`, (resp)=>{
      const data = resp.reportPayroll.map((item, idx)=>{
        totalData.regularHours += validFloat(item.hours);
        totalData.overtimeHours += validFloat(item.hoursOvertime);
        totalData.totalHours += validFloat(item.totalHours);
        totalData.regularPayment += validFloat(item.payment);
        totalData.overtimePayment += validFloat(item.paymentOvertime);
        totalData.totalPayment += validFloat(item.totalPayment);
        item.id = idx;
        item.customerName = item.customer?.name || '';
        item.orderCode= `${idx}`;
        return item;
      });

      setTableData(data);
      setTotalsData(totalData);
      setEnableFreeActions(false);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnGetDataByProject = ()=>{
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setOpenModalFilterByProject(true);
  }

  useEffect(()=>{
    onBulkForm({noWeek: 0});
    let weeksFilter = listWeeksWorked.filter((item) => {
      return item.year === noYear;
    });

    setListWeeks(weeksFilter);
  },[listWeeksWorked, noYear]);

  return (
    {
      formState,
      formValidation,
      isFormValid,
      sendForm,
      listWeeks,
      openModalFilterByProject,
      setOpenModalFilterByProject,
      onInputChange,
      fnGetData,
      fnGetDataByProject
    }
  )
}
