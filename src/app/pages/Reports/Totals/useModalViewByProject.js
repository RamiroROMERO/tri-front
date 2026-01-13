import { useState, useEffect } from 'react';
import { request } from 'app/utils/core';
import { validFloat } from 'app/utils/helpers';

export const useModalViewByProject = ({ setLoading, paramsFilter, currentItem }) => {
  const [detailTable, setDetailTable] = useState([]);
  const [totalDataProjects, setTotalsDataProjects] = useState({});

  const fnGetData = () => {
    const totalData = {
      totalEmp: 0,
      regularHours: 0,
      overtimeHours: 0,
      totalHours: 0,
      regularPayment: 0,
      overtimePayment: 0,
      totalAdjustments: 0,
      totalDeductions: 0,
      totalPayment: 0,
      totalInvoice: 0,
      balance: 0
    };

    setLoading(true);
    request.GET(`/reportPayrollMain/groupByProjects?noYear=${paramsFilter.noYear}&noWeek=${paramsFilter.noWeek}&customerId=${currentItem.customerId}`, (resp) => {
      const data = resp.reportPayroll.map((item, idx) => {
        item.id = idx;
        item.projectName = item.project.code + ' | ' + item.project.name;
        totalData.totalEmp += validFloat(item.employeeCount);
        totalData.regularHours += validFloat(item.hours);
        totalData.overtimeHours += validFloat(item.hoursOvertime);
        totalData.totalHours += validFloat(item.totalHours);
        totalData.regularPayment += validFloat(item.payment);
        totalData.overtimePayment += validFloat(item.paymentOvertime);
        totalData.totalAdjustments += validFloat(item.adjustmentsValue);
        totalData.totalDeductions += validFloat(item.deductionsValue);
        totalData.totalPayment += validFloat(item.totalPayment);
        totalData.totalInvoice += validFloat(item.totalInvoice);
        item.balance = validFloat(item.totalInvoice) - validFloat(item.totalPayment);
        totalData.balance += item.balance;
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

  const fnExportPdf = async () => {
    setLoading(true);
    let data = {
      where: {
        noWeek: paramsFilter.noWeek,
        noYear: paramsFilter.noYear,
        customerId: currentItem.customerId
      },
      fields: [
        { title: 'Project', field: 'projectName', type: 'String', length: 100 },
        { title: 'Qty. Employ.', field: 'employeeCount', type: 'decimal', length: 40, isSum: true },
        { title: 'Regular Hours', field: 'hours', type: 'decimal', length: 45, isSum: true },
        { title: 'Overtime Hours', field: 'hoursOvertime', type: 'decimal', length: 45, isSum: true },
        { title: 'Total Hours', field: 'totalHours', type: 'decimal', length: 50, isSum: true },
        { title: 'Regular Payment', field: 'payment', type: 'decimal', length: 60, isSum: true },
        { title: 'Overtime Payment', field: 'paymentOvertime', type: 'decimal', length: 60, isSum: true },
        { title: 'Adjustments', field: 'adjustmentsValue', type: 'decimal', length: 60, isSum: true },
        { title: 'Deductions', field: 'deductionsValue', type: 'decimal', length: 60, isSum: true },
        { title: 'Total Payment', field: 'totalPayment', type: 'decimal', length: 60, isSum: true },
        { title: 'Total Invoice', field: 'totalInvoice', type: 'decimal', length: 60, isSum: true }
      ],
      reportTitle: 'Totals for Project',
      reportSubtitle: `Customer: ${currentItem.customer.code} - ${currentItem.customer.name} | Week Number: ${paramsFilter.noWeek} - ${paramsFilter.noYear}`,
      typeFormat: 1,
      namePDFFile: "TotalsForProject.pdf"
    };
    await request.fnExportToPDF("/reportPayrollMain/groupByProjectsPDF", data, "TotalsForProject.pdf");
    setLoading(false);
  }

  const fnExportXlsx = async () => {
    setLoading(true);
    let data = {
      where: {
        noWeek: paramsFilter.noWeek,
        noYear: paramsFilter.noYear,
        customerId: currentItem.customerId
      },
      fields: [
        { title: 'Project', field: 'projectName', type: 'String', length: 100, currency: false },
        { title: 'Qty. Employ.', field: 'employeeCount', type: 'decimal', length: 40, isSum: true, currency: false },
        { title: 'Regular Hours', field: 'hours', type: 'decimal', length: 45, isSum: true, currency: false },
        { title: 'Overtime Hours', field: 'hoursOvertime', type: 'decimal', length: 45, isSum: true, currency: false },
        { title: 'Total Hours', field: 'totalHours', type: 'decimal', length: 50, isSum: true, currency: false },
        { title: 'Regular Payment', field: 'payment', type: 'decimal', length: 60, isSum: true, currency: true },
        { title: 'Overtime Payment', field: 'paymentOvertime', type: 'decimal', length: 60, isSum: true, currency: true },
        { title: 'Adjustments', field: 'adjustmentsValue', type: 'decimal', length: 60, isSum: true, currency: true },
        { title: 'Deductions', field: 'deductionsValue', type: 'decimal', length: 60, isSum: true, currency: true },
        { title: 'Total Payment', field: 'totalPayment', type: 'decimal', length: 60, isSum: true, currency: true }
      ],
      headerData: [
        { title: `Customer: ${currentItem.customer.code} - ${currentItem.customer.name} | Week Number: ${paramsFilter.noWeek} - ${paramsFilter.noYear}` }
      ],
      reportTitle: "Totals for Project",
      typeFormat: 1,
      nameXLSXFile: "TotalsForProject.xlsx",
    };
    await request.fnExportToXLSX("/reportPayrollMain/groupByProjectsXLSX", data, "TotalsForProject.xlsx");
    setLoading(false);
  }

  useEffect(() => {
    fnGetData();
  }, [currentItem]);

  return (
    {
      detailTable,
      totalDataProjects,
      fnExportPdf,
      fnExportXlsx
    }
  )
}
