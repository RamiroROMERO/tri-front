import { useState } from 'react'
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validFloat, validInt } from 'app/utils/helpers';

export const useModalFilterByProject = ({ setLoading, listProjects, listCustomers, sweetAlerts, t }) => {
  const [projectsFilter, setProjectsFilter] = useState([]);
  const [detailTable, setDetailTable] = useState([]);
  const [totalDataProjects, setTotalsDataProjects] = useState({});
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    noYear: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    customerId: [(val) => validInt(val) !== 0, t("alertMessages.warning.customerId")],
    projectId: [(val) => validInt(val) !== 0, t("alertMessages.warning.projectId")]
  }

  const { formState, onBulkForm, onInputChange, onResetForm, isFormValid, formValidation } = useForm({
    noYear: 0,
    customerId: 0,
    projectId: 0
  }, formValidations);

  const { noYear, customerId, projectId } = formState;

  const onCustomerChange = e => {
    const customer = e.target.value;

    const filter = listProjects.filter(item => item.customerId === customer);
    setProjectsFilter(filter);

    onBulkForm({ customerId: customer });
  }

  const fnGetData = () => {
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingParams"));
      return;
    }

    const totalData = {
      totalEmp: 0,
      regularHours: 0,
      overtimeHours: 0,
      totalHours: 0,
      regularPayment: 0,
      overtimePayment: 0,
      totalPayment: 0,
      payrollPerdiem: 0
    };

    setLoading(true);
    request.GET(`/reportPayrollMain/groupByProjectWeeks?noYear=${noYear}&customerId=${customerId}&projectId=${projectId}`, (resp) => {
      const data = resp.data.map((item, idx) => {
        item.id = idx;
        totalData.totalEmp += validFloat(item.employeeCount);
        totalData.regularHours += validFloat(item.hours);
        totalData.overtimeHours += validFloat(item.hoursOvertime);
        totalData.totalHours += validFloat(item.totalHours);
        totalData.regularPayment += validFloat(item.payment);
        totalData.overtimePayment += validFloat(item.paymentOvertime);
        totalData.totalPayment += validFloat(item.totalPayment);
        totalData.payrollPerdiem += validFloat(item.payrollPerdiem);
        return item;
      });

      setDetailTable(data);
      setTotalsDataProjects(totalData);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnExportToXLSX = async () => {
    setLoading(true);
    const { label: customerName, code: customerCode } = listCustomers.find(item => item.id === customerId);

    const { label: projectName } = projectsFilter.find(item => item.id === projectId);

    let data = {
      where: {
        noYear,
        projectId
      },
      fields: [
        { title: 'Week', field: 'numberWeek', type: 'String', length: 100, currency: false },
        { title: 'Qty. Employ.', field: 'employeeCount', type: 'decimal', length: 40, isSum: false, currency: false },
        { title: 'Regular Hours', field: 'hours', type: 'decimal', length: 45, isSum: true, currency: false },
        { title: 'Overtime Hours', field: 'hoursOvertime', type: 'decimal', length: 45, isSum: true, currency: false },
        { title: 'Total Hours', field: 'totalHours', type: 'decimal', length: 50, isSum: true, currency: false },
        { title: 'Regular Payment', field: 'payment', type: 'decimal', length: 60, isSum: true, currency: true },
        { title: 'Overtime Payment', field: 'paymentOvertime', type: 'decimal', length: 60, isSum: true, currency: true },
        { title: 'Payroll Perdiem', field: 'payrollPerdiem', type: 'decimal', length: 60, isSum: true, currency: true },
        { title: 'Total Payment', field: 'totalPayment', type: 'decimal', length: 60, isSum: true, currency: true }
      ],
      headerData: [
        { title: `Customer: ${customerCode} - ${customerName} | Project: ${projectName}` }
      ],
      reportTitle: "Totals for Project Weeks",
      typeFormat: 1,
      nameXLSXFile: "TotalsForProjectWeeks.xlsx",
    };
    await request.fnExportToXLSX("/reportPayrollMain/groupByProjectWeekXLSX", data, "TotalsForProjectWeek.xlsx");
    setLoading(false);
  }

  return (
    {
      formState,
      formValidation,
      isFormValid,
      sendForm,
      detailTable,
      projectsFilter,
      totalDataProjects,
      onInputChange,
      onCustomerChange,
      fnExportToXLSX,
      fnGetData
    }
  )
}
