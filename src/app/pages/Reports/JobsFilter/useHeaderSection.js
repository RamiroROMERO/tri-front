import { useState, useEffect } from 'react';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { formatDateToShow } from 'app/utils/helpers';

export const useHeaderSection = ({setLoading, listWeeksWorked, setTableData, screenControl, sweetAlerts, t}) => {
  const { optCreate } = screenControl;
  const currentYear = new Date().getFullYear();
  const [listWeeks, setListWeeks] = useState([]);

  const {formState, onInputChange, onBulkForm} = useForm({
    id: 0,
    noYear: currentYear,
    weekId: 0,
    projectId: 0,
    customerId: 0,
    locationId: 0
  });

  const {noYear, weekId, projectId, customerId, locationId} = formState;

  const fnGetData = ()=>{
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setTableData([]);

    const filterWeeks = weekId>0?listWeeks.find(item => item.id === weekId):{};

    const noWeek = filterWeeks?.noWeek || 0;

    let urlGet = "/weeklyPayrollsDetails/reportForWeek";
    if (weekId !== 0 || customerId !== 0 || projectId !== 0 || locationId !== 0) {
      urlGet = `/weeklyPayrollsDetails/reportForWeek?customerId=${customerId}&noYear=${noYear}&noWeek=${noWeek}&projectId=${projectId}&locationId=${locationId}`;
    } else {
      urlGet = "/weeklyPayrollsDetails/reportForWeek";
    }

    setLoading(true);
    request.GET(urlGet, (resp)=>{
      const data = resp.reportForWeek.map((item)=>{
        item.id = item.project.id
        item.idProject = item.project.id
        item.customerCode = item.customer.code
        item.customerName = item.customer.name
        item.projectName = item.project.code + "| " + item.project.name
        item.name = item.project.name
        item.code = item.project.code
        item.statusName = item.project.status.name;
        item.noWeek = item.customersWeek.noWeek
        item.weekOutFormat = item.customersWeek.endDate?formatDateToShow(item.customersWeek.endDate):"";
        item.locationName = item.project.location.name;
        return item
      });

      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
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
      listWeeks,
      onInputChange,
      fnGetData
    }
  )
}
