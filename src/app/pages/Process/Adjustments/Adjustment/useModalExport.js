import { useState } from 'react'
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validFloat, validInt } from 'app/utils/helpers';
import { useEffect } from 'react';

export const useModalExport = ({setLoading, listWeeksWorked, typeId}) => {
  const currentYear = new Date().getFullYear();
  const [listProjects, setListProjects] = useState([]);
  const [listWeeks, setListWeeks] = useState([]);

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    noYear: currentYear,
    noWeek: 0,
    customerId: 0,
    projectId: 0,
    adjustmentType: typeId
  });

  const {noYear, noWeek, customerId, projectId, adjustmentType} = formState;

  const onCustomerChange = e =>{
    const customer = e.target.value;
    setListProjects([]);

    if(validFloat(customer)===0) return;

    setLoading(true);
    request.GET(`/projects?customerId=${customer}`, (resp)=>{
      const data = resp.projects.map((item)=>{
        item.value = item.id
        item.label = `${item.code} | ${item.name}`
        return item;
      });
      setListProjects(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
    onBulkForm({customerId: customer});
  }

  const onYearChange = e =>{
    const year = e.target.value;

    onBulkForm({
      noYear: year
    });
  }

  const fnExport = async()=>{
    let where = {
      adjustmentType
    };

    if(validInt(noYear) > 0 && validInt(noWeek) > 0){
      where.noYear = noYear;
      where.noWeek = noWeek;
    }
    if(validInt(customerId) > 0){
      where.customerId = customerId;
    }
    if(validInt(projectId) > 0){
      where.projectId = projectId;
    }

    if(validInt(noWeek) === 0 && validInt(customerId) === 0 && validInt(projectId) === 0){
      return;
    }

    setLoading(true);
    const data = {
      view: "",
      where,
      fields: [
        { title: 'Week', field: 'week', type: 'decimal', length: 40, isSum: false, currency: false },
        { title: 'Customer', field: 'customerName', type: 'String', length: 90},
        { title: 'Employee', field: 'employeeName', type: 'String', length: 100 },
        { title: 'Project', field: 'projectName', type: 'String', length: 70 },
        { title: 'Project Customer Code', field: 'projectCustomerCode', type: 'String', length: 70 },
        { title: 'Project Code', field: 'projectCode', type: 'String', length: 70 },
        { title: 'Reference Code', field: 'jobReference', type: 'String', length: 70 },
        { title: 'Adjustment Type', field: 'deductionName', type: 'String', length: 70 },
        { title: 'Description', field: 'description', type: 'String', length: 120 },
        { title: 'Amount', field: 'value', type: 'decimal', length: 40, isSum: true, currency: true }
      ],
      headerData: [
      ],
      reportTitle: "Adjustments",
      typeFormat: 1,
      nameXLSXFile: "adjustments.xlsx",
    };
    await request.fnExportToXLSX("/adjustments/exportAdjustmentsXLSX", data, "adjustments.xlsx");
    setLoading(false);
  }

  useEffect(()=>{
    const filterWeeks = listWeeksWorked.filter(item => item.year === noYear);
    setListWeeks(filterWeeks);
  },[noYear]);

  return (
    {
      formState,
      onInputChange,
      onCustomerChange,
      onYearChange,
      listProjects,
      listWeeks,
      fnExport
    }
  )
}
