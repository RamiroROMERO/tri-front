import { useEffect, useState } from 'react'
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validFloat, validInt } from 'app/utils/helpers';

export const useHeaderSection = ({t, setLoading, listWeeksWorked, currentItem, setCurrentItem, sweetAlerts, fnGetData, screenControl}) => {
  const { optCreate, optUpdate } = screenControl;
  const currentYear = new Date().getFullYear();
  const [sendForm, setSendForm] = useState(false);
  const [listWeeks, setListWeeks] = useState([]);
  const [dataPayroll, setDataPayroll] = useState({});

  const formValidations = {
    noYear: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    noWeek: [(val) => validInt(val) !== 0, t("alertMessages.warning.weekId")],
    employeeId: [(val) => validInt(val) !== 0, t("alertMessages.warning.employeeId")],
    deductionTypeId: [(val) => validInt(val) !== 0, t("alertMessages.warning.deductionTypeId")],
    value: [(val) => validFloat(val) !== 0, t("alertMessages.warning.value")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: 0,
    noYear: currentYear,
    noWeek: 0,
    employeeId: 0,
    deductionTypeId: 0,
    value: 0,
    description: ''
  }, formValidations);

  const {id, noYear, noWeek } = formState;

  const fnNewDocto = ()=>{
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem({});
    onResetForm();
    setDataPayroll([]);
    setSendForm(false);
  }

  const onEmployeeChange = e =>{
    const employee = e.target.value;

    onBulkForm({employeeId: employee});

    if(noWeek===0) return;

    setLoading(true);
    request.GET(`/viewPayrollResumeWeek?noWeek=${noWeek}&noYear=${noYear}&employeeId=${employee}`, (resp)=>{
      setDataPayroll(resp?.payrollResumeWeek[0] || {});
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnSaveDocto = ()=>{
    if (validInt(id) === 0) {
      if (optCreate === 0) {
        sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
        return;
      }
    } else {
      if (optUpdate === 0) {
        sweetAlerts('error', t("alertMessages.warning.unauthorizedUser"));
        return;
      }
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/adjustments', formState, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        onBulkForm({
          id: 0,
          employeeId: 0,
          deductionTypeId: 0,
          value: 0,
          description: ''
        });
        setDataPayroll([]);
        setSendForm(false);
        setLoading(false);
      }, err=>{
        const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      })
    }else{
      request.PUT('/adjustments', formState, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        onBulkForm({
          id: 0,
          employeeId: 0,
          deductionTypeId: 0,
          value: 0,
          description: ''
        });
        setDataPayroll([]);
        setSendForm(false);
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
  }

  useEffect(()=>{
    onBulkForm({noWeek: 0});
    let weeksFilter = listWeeksWorked.filter((item) => {
      return item.year === noYear;
    });

    setListWeeks(weeksFilter);
  },[listWeeksWorked, noYear]);

  useEffect(()=>{
    onBulkForm(currentItem);
  },[currentItem]);

  return (
    {
      formState,
      formValidation,
      isFormValid,
      sendForm,
      listWeeks,
      dataPayroll,
      onInputChange,
      onEmployeeChange,
      fnNewDocto,
      fnSaveDocto
    }
  )
}
