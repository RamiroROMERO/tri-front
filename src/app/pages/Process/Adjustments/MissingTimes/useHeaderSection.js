import { useEffect, useState } from 'react'
import { useForm } from 'app/hooks';
import { validFloat, validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const useHeaderSection = ({t, setLoading, sweetAlerts, listWeeksWorked, fnGetData, screenControl}) => {
  const { optCreate } = screenControl;
  const currentYear = new Date().getFullYear();
  const [sendForm, setSendForm] = useState(false);
  const [listWeeks, setListWeeks] = useState([]);
  const [listWeeks2, setListWeeks2] = useState([]);
  const [listProjects, setListProjects] = useState([]);
  const [dataEmployee, setDataEmployee] = useState([]);

  const formValidations = {
    noYear: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    noYear2: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    weekId: [(val) => validInt(val) !== 0, t("alertMessages.warning.weekId")],
    weekId2: [(val) => validInt(val) !== 0, t("alertMessages.warning.weekId")],
    employeeId: [(val) => validInt(val) !== 0, t("alertMessages.warning.employeeId")],
    projectId: [(val) => validInt(val) !== 0, t("alertMessages.warning.projectId")],
    typeId: [(val) => validInt(val) !== 0, t("alertMessages.warning.type")],
    qty: [(val) => validFloat(val) !== 0, t("alertMessages.error.missingTimes.hours")],
    totalInvoice: [(val) => validFloat(val) !== 0, t("alertMessages.error.missingTimes.invoiceTotal")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: 0,
    noYear: currentYear,
    weekId: 0,
    noWeek: 0,
    projectId: 0,
    employeeId: 0,
    typeId: 0,
    qty: 0,
    pricePayroll: 0,
    priceInvoice: 0,
    totalPayroll: 0,
    totalInvoice: 0,
    inCheck: false,
    inInvoice: false,
    weekId2: 0,
    noYear2: 0,
    noWeek2: 0
  }, formValidations);

  const {noYear, noYear2, typeId, qty, pricePayroll, priceInvoice} = formState;

  const onWeekChange = e =>{
    const week = e.target.value;

    const filterWeeks = listWeeks.find(item => item.id === week);

    const weekNumber = filterWeeks?.noWeek || 0;

    setLoading(true);
    request.GET(`/viewProjectsWeeks?noYear=${noYear}&noWeek=${weekNumber}`, (resp)=>{
      const projects = resp.projectsWeeks.map((item)=>{
        return {
          id: item.projectId,
          value: item.projectId,
          label: `${item.projectCode} | ${item.projectName}`
        }
      });

      setListProjects(projects);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });

    onBulkForm({weekId: week, noWeek: weekNumber});
  }

  const onWeek2Change = e =>{
    const week2 = e.target.value;

    const filterWeeks = listWeeks2.find(item => item.id === week2);

    const weekNumber = filterWeeks?.noWeek || 0;

    onBulkForm({weekId2: week2, noWeek2: weekNumber});
  }

  const onEmployeeChange = e =>{
    const employee = e.target.value;

    setLoading(true);
    request.GET(`/employeeCustomers?employeeId=${employee}&delRecord=0`, (resp)=>{
      const data = resp.employeeCustomers[0];

      if(data){
        if (typeId === 1) {
          onBulkForm({
            employeeId: employee,
            pricePayroll: validFloat(data.rate),
            priceInvoice: validFloat(data.rateInvoice)
          });
        } else if (typeId === 2) {
          onBulkForm({
            employeeId: employee,
            pricePayroll: validFloat(data.rateOvertime),
            priceInvoice: validFloat(data.rateInvoiceOvertime)
          });
        } else {
          onBulkForm({
            employeeId: employee,
            pricePayroll: 0,
            priceInvoice: 0
          });
        }
      }else{
        onBulkForm({
          employeeId: employee,
          pricePayroll: 0,
          priceInvoice: 0
        });
      }

      setDataEmployee(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnChangeTypeMissing = ()=>{
    if (typeId === 1) {
      onBulkForm({
        pricePayroll: validFloat(dataEmployee.rate),
        priceInvoice: validFloat(dataEmployee.rateInvoice),
        totalPayroll: validFloat(dataEmployee.rate) * validFloat(qty),
        totalInvoice: validFloat(dataEmployee.rateInvoice) * validFloat(qty)
      });
    } else if (typeId === 2) {
      onBulkForm({
        pricePayroll: validFloat(dataEmployee.rateOvertime),
        priceInvoice: validFloat(dataEmployee.rateInvoiceOvertime),
        totalPayroll: validFloat(dataEmployee.rateOvertime) * validFloat(qty),
        totalInvoice: validFloat(dataEmployee.rateInvoiceOvertime) * validFloat(qty)
      });
    } else {
      onBulkForm({
        pricePayroll: 0,
        priceInvoice: 0,
        totalPayroll: 0,
        totalInvoice: 0
      });
    }
  }

  const fnChangePrice = ()=>{
    onBulkForm({
      totalPayroll: validFloat(pricePayroll) * validFloat(qty),
      totalInvoice: validFloat(priceInvoice) * validFloat(qty)
    })
  }

  const fnNewDocto = ()=>{
    setSendForm(false);
    onBulkForm({
      typeId: 0,
      qty: 0,
      pricePayroll: 0,
      priceInvoice: 0,
      totalPayroll: 0,
      totalInvoice: 0,
      inCheck: false,
      inInvoice: false
    });
    // onResetForm();
  }

  const fnSaveDocto = ()=>{
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    setLoading(true);
    request.POST('/missingTimes', formState, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetData();
      fnNewDocto();
      setLoading(false);
    }, err=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  }

  useEffect(()=>{
    onBulkForm({noWeek: 0, weekId: 0});
    let weeksFilter = listWeeksWorked.filter((item) => {
      return item.year === noYear;
    });

    setListWeeks(weeksFilter);
  },[listWeeksWorked, noYear]);

  useEffect(()=>{
    onBulkForm({noWeek2: 0, weekId2: 0});
    let weeksFilter = listWeeksWorked.filter((item) => {
      return item.year === noYear2;
    });

    setListWeeks2(weeksFilter);
  },[listWeeksWorked, noYear2]);

  useEffect(()=>{
    fnChangeTypeMissing();
  },[typeId, qty]);

  useEffect(()=>{
    fnChangePrice();
  },[priceInvoice, pricePayroll]);

  return (
    {
      formState,
      formValidation,
      isFormValid,
      sendForm,
      listWeeks,
      listWeeks2,
      listProjects,
      onInputChange,
      onWeekChange,
      onWeek2Change,
      onEmployeeChange,
      fnSaveDocto
    }
  )
}
