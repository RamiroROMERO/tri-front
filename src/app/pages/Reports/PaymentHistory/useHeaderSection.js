import { useState, useEffect } from 'react';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validFloat } from 'app/utils/helpers';
import { Typography } from '@mui/material';

export const useHeaderSection = ({ setLoading, listWeeksWorked, setTableData, setTotalRegHours, setTotalOTHours, setTotalPayment, setEnableFreeActions, setParamsFilter, screenControl, sweetAlerts, t }) => {
  const { optCreate } = screenControl;
  const currentYear = new Date().getFullYear();
  const [listWeeks, setListWeeks] = useState([]);

  const { formState, onInputChange, onBulkForm } = useForm({
    noYear: currentYear,
    weekId: 0,
    customerId: 0,
    projectId: 0,
    employeeId: 0,
    classificationId: 0,
    ciaAccountId: 0
  });

  const { noYear, weekId, customerId, projectId, employeeId, classificationId, ciaAccountId } = formState;

  const fnGetData = () => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setTableData([]);

    const filterWeeks = weekId > 0 ? listWeeks.find(item => item.id === weekId) : {};

    const noWeek = filterWeeks?.noWeek || 0;

    let params = "";
    let paramsXlsx = {};
    if (noYear !== 0) {
      params = params === "" ? `?noYear=${noYear}` : `${params}&noYear=${noYear}`;
      paramsXlsx.noYear = noYear;
    }
    if (noWeek !== 0) {
      params = params === "" ? `?noWeek=${noWeek}` : `${params}&noWeek=${noWeek}`;
      paramsXlsx.noWeek = noWeek;
    }
    if (customerId !== 0) {
      params = params === "" ? `?customerId=${customerId}` : `${params}&customerId=${customerId}`;
      paramsXlsx.customerId = customerId;
    }
    if (projectId !== 0) {
      params = params === "" ? `?projectId=${projectId}` : `${params}&projectId=${projectId}`;
      paramsXlsx.projectId = projectId;
    }
    if (employeeId !== 0) {
      params = params === "" ? `?employeeId=${employeeId}` : `${params}&employeeId=${employeeId}`;
      paramsXlsx.employeeId = employeeId;
    }
    if (classificationId !== 0) {
      params = params === "" ? `?classificationId=${classificationId}` : `${params}&classificationId=${classificationId}`;
      paramsXlsx.classificationId = classificationId;
    }
    if (ciaAccountId !== 0) {
      params = params === "" ? `?ciaAccount=${ciaAccountId}` : `${params}&ciaAccount=${ciaAccountId}`;
      paramsXlsx.ciaAccountId = ciaAccountId;
    }

    setParamsFilter(paramsXlsx);

    const urlGet = `/reportPayrollMain/groupByAll${params}`;

    setLoading(true);
    request.GET(urlGet, (resp) => {
      let regularHours = 0, overtimeHours = 0, totalPayment = 0;
      const data = resp.reportPayroll.map((item, idx) => {
        regularHours += validFloat(item.hours);
        overtimeHours += validFloat(item.hoursOvertime);
        totalPayment += validFloat(item.totalPayment);
        item.id = idx;
        item.noWeek = item.noYear + " | " + item.noWeek
        item.projectName = item.project ? item.project.code + " | " + item.project.name : '';
        item.classificationName = item.classification ? item.classification.name : '';
        item.employeeName = item.employee ? item.employee.name : '';
        item.customerName = item.customer ? item.customer.code + " | " + item.customer.name : '';
        // item.employeeName = (validFloat(item.hours) < 40 && validFloat(item.hoursOvertime) > 0)
        //   ? <Typography color='danger' variant='body1' component="h6"> ${item.employeeName}</Typography> : item.employeeName
        return item;
      });

      setTableData(data);
      setTotalRegHours(regularHours);
      setTotalOTHours(overtimeHours);
      setTotalPayment(totalPayment);
      setEnableFreeActions(false);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  useEffect(() => {
    onBulkForm({ noWeek: 0 });
    let weeksFilter = listWeeksWorked.filter((item) => {
      return item.year === noYear;
    });

    setListWeeks(weeksFilter);
  }, [listWeeksWorked, noYear]);

  return (
    {
      formState,
      listWeeks,
      onInputChange,
      fnGetData
    }
  )
}
