import { useState, useEffect } from 'react';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { formatDateToShow, validFloat, validInt } from 'app/utils/helpers';

export const useModalNew = ({ t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem }) => {
  const [sendForm, setSendForm] = useState(false);
  const [listYears, setListYears] = useState([]);
  const [listWeeks, setListWeeks] = useState([]);
  const [listEmployees, setListEmployees] = useState([]);
  const [listWeeksWorked, setListWeeksWorked] = useState([]);
  const [listPayrollLineType, setListPayrollLineType] = useState([])
  const [viewWeekYear, setViewWeekYear] = useState(true);
  const currentYear = new Date().getFullYear();

  const formValidations = {
    // weekId: [(val) => validInt(val) !== 0, t("alertMessages.warning.weekId")],
    customerId: [(val) => validInt(val) !== 0, t("alertMessages.warning.customerId")],
    employeeId: [(val) => validInt(val) !== 0, t("alertMessages.warning.employeeId")],
    qty: [(val) => validFloat(val) !== 0, t("alertMessages.warning.value")],
    price: [(val) => validFloat(val) !== 0, t("alertMessages.warning.value")],
    total: [(val) => validFloat(val) !== 0, t("alertMessages.warning.value")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    id: currentItem.id ? currentItem.id : 0,
    yearId: currentItem?.yearId || 0,
    weekId: 0,
    customerId: currentItem?.customerId || '',
    employeeId: 0,
    qty: currentItem?.qty || 0,
    price: currentItem?.price || 0,
    total: currentItem?.total || 0,
    description: currentItem?.description || '',
    hasPayroll: currentItem?.hasPayroll || false,
    payrollRegularRate: currentItem?.payrollRegularRate || 0,
    payrollOvertimeRate: currentItem?.payrollOvertimeRate || 0,
    payrollLineTypeId: currentItem?.payrollLineTypeId || 0,
    isRecurring: currentItem?.isRecurring || false,
    status: currentItem.status ? currentItem.status : true
  }, formValidations);

  const { id, isRecurring, employeeId } = formState;

  const onCustomerChange = e => {
    const customer = e.target.value;

    fnCustomerChange(customer);
  }

  const fnCustomerChange = (value) => {
    setListEmployees([]);

    if (validFloat(value) === 0) return;

    setLoading(true);
    request.GET(`/weeklyPayrollsDetails/customerWeeksWorks?customerId=${value}`, (resp) => {
      const weeksWorks = resp.weeksWorks.map((item) => {
        return {
          id: item.weekId,
          value: item.weekId,
          label: `#${item.customersWeek.noWeek} WEEK OF ${formatDateToShow(item.customersWeek.startDate)} TO ${formatDateToShow(item.customersWeek.endDate)}`,
          noYear: item.customersWeek?.noYear || '',
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
      filterYears.unshift({ value: 0, label: 'Seleccione...' });
      const filterWeeks = weeksWorks.filter(item => item.noYear === (currentYear));
      setListWeeks(filterWeeks);

      const selectLastWeek = filterWeeks.at(-1);

      setListWeeksWorked(weeksWorks);
      setListYears(filterYears);

      onBulkForm({
        yearId: currentYear,
        weekId: currentItem.weekId ? currentItem.weekId : selectLastWeek.id,
        customerId: value
      });

      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET(`/employees/list?customerId=${value}&status=1`, (resp) => {
      const employees = resp.employees.map((item) => {
        const dataPayroll = item?.employeeCustomers[0] || {};
        return {
          value: item.id,
          label: `${item.code} | ${item.name}`,
          regularRate: dataPayroll?.rate || 0,
          overtimeRate: dataPayroll?.rateOvertime || 0
        }
      });
      setListEmployees(employees);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const onYearChange = e => {
    const year = e.target.value;

    const filterWeeks = listWeeksWorked.filter(item => item.noYear === year);
    setListWeeks(filterWeeks);

    onBulkForm({ yearId: year });
  }

  const fnSave = () => {
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    setLoading(true);
    if (validInt(id) === 0) {
      request.POST('/otherPayments', formState, resp => {
        const { messages } = resp;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        setSendForm(false);
        setOpen(false);
        setLoading(false);
      }, err => {
        const { messages } = err;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      })
    } else {
      request.PUT(`/otherPayments/${id}`, formState, resp => {
        const { messages } = resp;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        setSendForm(false);
        setOpen(false);
        setLoading(false);
      }, err => {
        const { messages } = err;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      });
    }
  }

  useEffect(() => {
    onBulkForm({
      employeeId: currentItem.employeeId ? currentItem.employeeId : 0,
    });
  }, [listEmployees])

  useEffect(() => {
    setViewWeekYear(!isRecurring);
    if (isRecurring) {
      onBulkForm({
        weekId: 0,
        yearId: 0
      });
    }
  }, [isRecurring])

  useEffect(() => {
    const seekEmp = listEmployees.find(elem => elem.value === employeeId);
    seekEmp ?
      onBulkForm({
        payrollRegularRate: seekEmp.regularRate,
        payrollOvertimeRate: seekEmp.overtimeRate
      })
      : onBulkForm({
        payrollRegularRate: 0,
        payrollOvertimeRate: 0
      })
  }, [employeeId]);

  useEffect(() => {
    request.GET('/payrollLineTypes/', res => {
      let payrollLineTypes = [];
      payrollLineTypes = res.payrollLineTypes.map(item => {
        return {
          id: item.id,
          value: item.id,
          name: item.name,
          label: item.name
        }
      });
      payrollLineTypes.unshift({ id: 0, value: 0, name: 'Seleccione...', label: 'Seleccione...' })
      setListPayrollLineType(payrollLineTypes);
    }, err => {
      console.error(err);
    })
  }, [])

  return (
    {
      formState,
      onInputChange,
      fnSave,
      isFormValid,
      formValidation,
      sendForm,
      listYears,
      listWeeks,
      listEmployees,
      listPayrollLineType,
      onCustomerChange,
      onYearChange,
      viewWeekYear
    }
  )
}
