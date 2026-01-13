import { useState } from 'react';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { formatDateToShow, validFloat, validInt } from 'app/utils/helpers';
import { useLocation } from 'react-router-dom';

export const useHeaderSection = ({ t, setLoading, sweetAlerts, setTableData, setEnableFreeActions, setParamsFilter, screenControl }) => {
  const projectData = useLocation().state;
  const { optCreate } = screenControl;
  const currentYear = new Date().getFullYear();
  const [sendForm, setSendForm] = useState(false);
  const [listYears, setListYears] = useState([]);
  const [listWeeks, setListWeeks] = useState([]);
  const [listWeeksWorked, setListWeeksWorked] = useState([]);
  const [listProjects, setListProjects] = useState([]);
  const [projectSelected, setProjectSelected] = useState([]);

  const formValidations = {
    customerId: [(val) => validInt(val) !== 0, t("alertMessages.warning.customerId")],
    noYear: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    weekId: [(val) => validInt(val) !== 0, t("alertMessages.warning.noWeek")],
    // projectId: [(val) => val.length !== 0, t("alertMessages.warning.projectId")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    customerId: 0,
    noYear: 0,
    weekId: 0,
    // projectId: []
  }, formValidations);

  const { customerId, noYear, weekId } = formState;

  const fnProjectsChange = (listProjects) => {
    const projectSelected = Object.keys(listProjects).reduce((acc, key) => {
      if (listProjects[key].selected) {
        acc.push(listProjects[key].id);
      }
      return acc;
    }, []);
    setProjectSelected(projectSelected);
  };

  const onCustomerChange = e => {
    const customer = e.target.value;
    setListProjects([]);

    if (validFloat(customer) === 0) return;

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

    // setLoading(true);
    // request.GET(`/projects?customerId=${customer}`, (resp) => {
    //   const data = resp.projects.map((item) => {
    //     item.value = item.id
    //     item.label = `${item.code} | ${item.name}`
    //     return item;
    //   });
    //   setListProjects(data);
    //   setLoading(false);
    // }, (err) => {
    //   console.warn(err);
    //   setLoading(false);
    // });
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
    const data = {
      customerId,
      weekId: week
    };

    setLoading(true);
    request.POST(`/weeklyPayrollsDetails/customerWeekProjects`, data, (resp) => {
      const projects = resp.weekProjects.map((item) => {
        return {
          id: item.id,
          name: item.code + " - " + item.name,
          jobReference: item.jobReference
        };
      });

      // setOriginalProjectList(resp.weekProjects);

      const projectsList = projects.reduce((acc, cur) => {
        acc[cur.name] = cur;
        acc[cur.name].selected = projectData ? (cur.id === projectData.projectSelected[0] ? true : false) : true;
        acc[cur.name].jobReference = cur.jobReference;
        return acc;
      }, {});

      const projectSelected = Object.keys(projectsList).reduce((acc, key) => {
        if (projectsList[key].selected) {
          acc.push(projectsList[key].id);
        }
        return acc;
      }, []);

      setProjectSelected(projectData ? projectData.projectSelected : projectSelected);

      setListProjects(projectsList);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

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

    setParamsFilter({ customerId, projectId: projectSelected, weekId });


    setLoading(true);
    request.GET(`/reportPayrollMain/groupByEmployee?customerId=${customerId}&projectId=${projectSelected}&weekId=${weekId}`, (resp) => {
      const data = []
      resp.reportPayroll.map((item, idx) => {
        const totalOtInvoice = validFloat(item.hoursOvertime) * validFloat(item.rateInvoiceOvertime);
        const totalStInvoice = validFloat(item.hours) * validFloat(item.rateInvoice);
        const data1 = {
          id: `${idx}-1`,
          num: "",
          weekId: item.weekId,
          employeeId: item.employeeId,
          name: "",
          typeHours: "O",
          totalHours: item.hoursOvertime,
          rateByHourInvoice: item.rateInvoiceOvertime,
          totalOtStInvoice: totalOtInvoice,
          totalPerdiemInvoice: "",
          totalInvoice: "",
          perdiemDaysPayroll: "",
          perdiemRatePayroll: "",
          perdiemTotalPayroll: "",
          wagePayroll: item.rate,
          overtimePayroll: item.rateOvertime,
          totalPayroll: ""
        }
        data.push(data1);
        const data2 = {
          id: `${idx}-2`,
          num: idx + 1,
          weekId: item.weekId,
          employeeId: item.employeeId,
          name: item.employee?.name || "",
          typeHours: "S",
          totalHours: item.hours,
          rateByHourInvoice: item.rateInvoice,
          totalOtStInvoice: totalStInvoice,
          totalPerdiemInvoice: item.invoicePerdiem,
          totalInvoice: totalOtInvoice + validFloat(item.invoicePerdiem) + totalStInvoice,
          perdiemDaysPayroll: validFloat(item.payrollPerdiem) > 0 ? item.qtyPayrollPerdiem : 0,
          perdiemRatePayroll: item.ratePayrollPerdiem,
          perdiemTotalPayroll: item.payrollPerdiem,
          wagePayroll: item.payment,
          overtimePayroll: item.paymentOvertime,
          totalPayroll: validFloat(item.payment) + validFloat(item.paymentOvertime) + validFloat(item.payrollPerdiem)
        }
        data.push(data2);
      });

      setTableData(data);
      setEnableFreeActions(false);
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
      listProjects,
      setListProjects,
      onInputChange,
      onCustomerChange,
      onYearChange,
      fnGetData, projectSelected, setProjectSelected, fnProjectsChange, onWeekChange
    }
  )
}
