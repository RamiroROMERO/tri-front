import { useState, useEffect } from 'react'
import { request } from 'app/utils/core';
import { validFloat } from 'app/utils/helpers';

export const useModalViewByClassification = ({ setLoading, paramsFilter, currentItem }) => {
  const [detailTable, setDetailTable] = useState([]);
  const [totalData, setTotalsData] = useState({});

  const fnGetData = () => {
    const totals = {
      totalEmp: 0,
      regularHours: 0,
      overtimeHours: 0,
      totalHours: 0,
      regularPayment: 0,
      overtimePayment: 0,
      totalAdjustments: 0,
      totalDeductions: 0,
      totalPayment: 0
    };

    setLoading(true);
    request.GET(`/reportPayrollMain/groupByClassifications?noYear=${paramsFilter.noYear}&noWeek=${paramsFilter.noWeek}&customerId=${currentItem.customerId}`, (resp) => {
      const data = resp.reportPayroll.map((item, idx) => {
        item.id = idx;
        item.classificationName = item.classification.name;
        totals.totalEmp += validFloat(item.employeeCount);
        totals.regularHours += validFloat(item.hours);
        totals.overtimeHours += validFloat(item.hoursOvertime);
        totals.totalHours += validFloat(item.totalHours);
        totals.regularPayment += validFloat(item.payment);
        totals.overtimePayment += validFloat(item.paymentOvertime);
        totals.totalAdjustments += validFloat(item.adjustmentsValue);
        totals.totalDeductions += validFloat(item.deductionsValue);
        totals.totalPayment += validFloat(item.totalPayment);
        return item;
      });

      setDetailTable(data);
      setTotalsData(totals);
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
        { title: 'Classification', field: 'classificationName', type: 'String', length: 100 },
        { title: 'Qty. Employ.', field: 'employeeCount', type: 'decimal', length: 40, isSum: true },
        { title: 'Regular Hours', field: 'hours', type: 'decimal', length: 45, isSum: true },
        { title: 'Overtime Hours', field: 'hoursOvertime', type: 'decimal', length: 45, isSum: true },
        { title: 'Total Hours', field: 'totalHours', type: 'decimal', length: 50, isSum: true },
        { title: 'Regular Payment', field: 'payment', type: 'decimal', length: 60, isSum: true },
        { title: 'Overtime Payment', field: 'paymentOvertime', type: 'decimal', length: 60, isSum: true },
        { title: 'Total Payment', field: 'totalPayment', type: 'decimal', length: 60, isSum: true }
      ],
      reportTitle: 'Totals for Classifications',
      reportSubtitle: `Customer: ${currentItem.customer.code} - ${currentItem.customer.name} | Week Number: ${paramsFilter.noWeek} - ${paramsFilter.noYear}`,
      typeFormat: 1,
      namePDFFile: "TotalsForClassifications.pdf"
    };
    await request.fnExportToPDF("/reportPayrollMain/groupByClassificationsPDF", data, "TotalsForClassifications.pdf");
    setLoading(false);
  }

  useEffect(() => {
    fnGetData();
  }, [currentItem]);

  return (
    {
      detailTable,
      totalData,
      fnExportPdf
    }
  )
}
