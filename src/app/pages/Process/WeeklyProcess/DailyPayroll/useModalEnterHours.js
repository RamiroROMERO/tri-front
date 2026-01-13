import { useState } from 'react'
import { validFloat, validInt } from 'app/utils/helpers';
import { useEffect } from 'react';
import { request } from 'app/utils/core';

export const useModalEnterHours = ({ sweetAlerts, t, payrollLineTypes, currentItem, customerData, listDates, setLoading, fnUpdateDataToUpdate, fnSaveAll, setOpen, fnGetPayroll }) => {
  const [payrollRate, setPayrollRate] = useState(currentItem?.rate || 0);
  const [payrollRateOvertime, setPayrollRateOvertime] = useState(currentItem?.rateOvertime || 0);
  const [invoiceRate, setInvoiceRate] = useState(currentItem?.rateInvoice || 0);
  const [invoiceRateOvertime, setInvoiceRateOvertime] = useState(currentItem?.rateInvoiceOvertime || 0);
  const [qtyPerdiem, setQtyPerdiem] = useState(0);
  const [qtyPerdiemInvoice, setQtyPerdiemInvoice] = useState(0);
  const [valuePerdiem, setValuePerdiem] = useState(currentItem?.payPerdiem || 0);
  const [invoicePerdiem, setInvoicePerdiem] = useState(currentItem?.invoicePerdiem || 0);
  const [maxWeekHours, setMaxWeekHours] = useState(0);
  const [fixedPerdiem, setFixedPerdiem] = useState(currentItem?.fixedPerdiem || false);
  const [fixedPerdiemInvoice, setFixedPerdiemInvoice] = useState(currentItem?.fixedPerdiem2 || false);
  const [handPerdiem, setHandPerdiem] = useState(currentItem?.handPerdiem || false);
  const [handPerdiemInvoice, setHandPerdiemInvoice] = useState(currentItem?.handPerdiemInvoice || false);
  const [noPayment, setNoPayment] = useState(currentItem?.noPayment || 0);
  const [hoursOTLine, setHoursOTLine] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [hoursWorkedExced, setHoursWorkedExced] = useState(0);
  const [hoursWorkedOvertime, setHoursWorkedOvertime] = useState(0);
  const [totalHoursRegular, setTotalHoursRegular] = useState(0);
  const [totalHoursOvertime, setTotalHoursOvertime] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [totalPayrollPerdiem, setTotalPayrollPerdiem] = useState(0);
  const [totalInvoicePerdiem, setTotalInvoicePerdiem] = useState(0);
  const [totalPerdiems, setTotalPerdiems] = useState(0);
  const [paymentOTLine, setPaymentOTLine] = useState(0);
  const [paymentRegularHours, setPaymentRegularHours] = useState(0);
  const [paymentOvertimeHours, setPaymentOvertimeHours] = useState(0);
  const [payment, setPayment] = useState(0);
  const [payNotes, setPayNotes] = useState(currentItem?.notes || "");
  const [lineTypes, setLineTypes] = useState(JSON.parse(JSON.stringify(payrollLineTypes)));
  const [tableData, setTableData] = useState([]);
  const [totalHoursRegister, setTotalHoursRegister] = useState(currentItem?.totalHoursRegister || []);
  const [globalTotalHours, setGlobalTotalHours] = useState(0);
  const [globalTotalRegularHours, setGlobalTotalRegularHours] = useState(0);
  const [globalTotalOvertimeHours, setGlobalTotalOvertimeHours] = useState(0);
  const [changePayrollInProfile, setChangePayrollInProfile] = useState(false);
  const [changeInvoiceInProfile, setChangeInvoiceInProfile] = useState(false);
  const daysMap = { '1': 'm', '2': 't', '3': 'w', '4': 'th', '5': 'f', '6': 's', '7': 'su' };

  const [disabledBtnSave, setDisabledBtnSave] = useState(false);


  const [daysReg, setDaysReg] = useState([
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" },
    { date: "", hours: 0, hoursOvertime: 0, id: 0, dateText: "" }
  ]);

  const [hoursDistribution, setHoursDistribution] = useState({
    regularHoursPayroll: 0.00,
    regularHoursInvoice: 0.00,
    overtimeHoursPayroll: 0.00,
    overtimeHoursInvoice: 0.00,
    payrollTotal: 0.00,
    invoiceTotal: 0.00
  });

  const onChangeValueOtherHours = e => {
    let { id, value } = e.target;
    let valueInput = value;

    if (isNaN(value)) {
      let sNumber = value.replace(/[^ 0-9,.]/g, '');
      if (sNumber === '' || isNaN(sNumber)) {
        return
      } else {
        value = sNumber
      }
    }

    if (validFloat(value) > 200) {
      value = 0;
      sweetAlerts('error', t("modal.dailiesPayrolls.errMaxHoursOuther"));
      return;
    }

    let nId = parseInt(id.split("-")[1]);
    let nTotal = 0;
    let nTotalPay = 0;
    let nSubtotal = 0;
    let newPayrollLineTypes = lineTypes.map(item => {
      nSubtotal = 0;
      if (item.id == nId) {
        item.qty = valueInput || 0;
      }
      nTotal += validFloat(item.qty);
      nSubtotal = (item.qty * payrollRate * item.qtyPrice);
      nTotalPay += validFloat(nSubtotal);
      return item;
    });

    setLineTypes(newPayrollLineTypes);
    setHoursOTLine(nTotal);
    setTotalHoursOvertime(nTotal + hoursWorkedExced + hoursWorkedOvertime);
    setTotalHours(totalHoursRegular + nTotal + hoursWorkedExced + hoursWorkedOvertime);
    setPaymentOTLine(nTotalPay);
    setPayment(nTotalPay + totalPerdiems + paymentRegularHours + paymentOvertimeHours);
  }

  const onChangeValueHours = (e) => {
    let { id, value } = e.target
    let valueInput = value;
    if (isNaN(value)) {
      let sNumber = value.replace(/[^ 0-9,]/g, '');
      if (sNumber === '' || isNaN(sNumber)) {
        return
      } else {
        value = sNumber
      }
    }

    if (validFloat(value) > 40) {
      value = 0
      sweetAlerts('error', t("modal.dailiesPayrolls.errMaxHoursDaily"));
      return;
    }

    let nId = id.split("-")[1];
    if (tableData[nId]) {
      let nCount = 0;
      let totalPayPerdiems = 0;
      let nQtyPerdiem = 0;
      let nQtyPerdiemInvoice = 0;

      let changeValue = tableData.map(item => {
        if (nCount == nId) {
          item.hours = valueInput || 0;
        }
        nCount++;
        return item
      });
      let nTotal = changeValue.reduce((oldValue, item) => {
        oldValue += validFloat(item.hours);
        return oldValue;
      }, 0);
      if (fixedPerdiem === false && handPerdiem === false) {
        nQtyPerdiem = 0;
        changeValue.map(item => {
          if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
            nQtyPerdiem++;
          }
        });
      }

      if (fixedPerdiem === true && handPerdiem === false) {
        nQtyPerdiem = 0;
        totalPayPerdiems = 0;
        changeValue.map(item => {
          if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
            nQtyPerdiem = 1;
          }
        });
      }
      if (fixedPerdiemInvoice === false && handPerdiemInvoice == false) {
        nQtyPerdiemInvoice = 0;
        totalPayPerdiems = 0;
        changeValue.map(item => {
          if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
            nQtyPerdiemInvoice++;
          }
        });
      }

      if (fixedPerdiemInvoice === true && handPerdiemInvoice == false) {
        nQtyPerdiemInvoice = 0;
        totalPayPerdiems = 0;
        changeValue.map(item => {
          if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
            nQtyPerdiemInvoice = 1;
          }
        });
      }

      setQtyPerdiem(nQtyPerdiem);
      setTotalPayrollPerdiem(nQtyPerdiem * valuePerdiem);
      setQtyPerdiemInvoice(nQtyPerdiemInvoice);
      setTotalInvoicePerdiem(nQtyPerdiemInvoice * invoicePerdiem);
      setTotalPerdiems((nQtyPerdiemInvoice * invoicePerdiem) + (nQtyPerdiem * valuePerdiem));
      totalPayPerdiems = (nQtyPerdiemInvoice * invoicePerdiem) + (nQtyPerdiem * valuePerdiem);

      let regHours = (nTotal > maxWeekHours) ? (maxWeekHours) : nTotal;
      let excedHours = (nTotal > maxWeekHours) ? (nTotal - maxWeekHours) : 0;
      let nTotalPay = (regHours * payrollRate) + (excedHours * payrollRateOvertime);

      setTableData(changeValue);
      setHoursWorked(nTotal);
      setHoursWorkedExced(excedHours);
      setTotalHoursRegular(regHours);
      setTotalHoursOvertime(excedHours + hoursOTLine + hoursWorkedOvertime);
      setTotalHours(regHours + excedHours + hoursOTLine + hoursWorkedOvertime);
      setPaymentRegularHours(nTotalPay);
      setPayment(nTotalPay + totalPayPerdiems + paymentOTLine + paymentOvertimeHours);
    }
  };

  const onChangeValueOvertimeHours = (e) => {
    let { id, value } = e.target
    let valueInput = value;
    if (isNaN(value)) {
      let sNumber = value.replace(/[^ 0-9,.]/g, '');
      if (sNumber === '' || isNaN(sNumber)) {
        return
      } else {
        value = sNumber
      }
    }

    if (validFloat(value) > 100) {
      value = 0;
      sweetAlerts('error', t("modal.dailiesPayrolls.errMaxHoursOuther"));
      return;
    }

    let nId = id.split("-")[1];
    if (tableData[nId]) {
      let nCount = 0;
      let changeValue = tableData.map(item => {
        if (nCount == nId) {
          item.hoursOvertime = valueInput || 0;
        }
        nCount++;
        return item
      });
      let nTotalOvertime = changeValue.reduce((oldValue, item) => {
        oldValue += validFloat(item.hoursOvertime);
        return oldValue;
      }, 0);

      let nQtyPerdiem = 0;
      let nQtyPerdiemInvoice = 0;
      let totalPayPerdiems = 0;
      changeValue.map(item => {
        if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
          nQtyPerdiem++;
        }
      });

      if (fixedPerdiem === false && handPerdiem === false) {
        nQtyPerdiem = 0;
        changeValue.map(item => {
          if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
            nQtyPerdiem++;
          }
        });
      }

      if (fixedPerdiem === true && handPerdiem === false) {
        nQtyPerdiem = 0;
        totalPayPerdiems = 0;
        changeValue.map(item => {
          if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
            nQtyPerdiem = 1;
          }
        });
      }
      if (fixedPerdiemInvoice === false && handPerdiemInvoice == false) {
        nQtyPerdiemInvoice = 0;
        totalPayPerdiems = 0;
        changeValue.map(item => {
          if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
            nQtyPerdiemInvoice++;
          }
        });
      }

      if (fixedPerdiemInvoice === true && handPerdiemInvoice == false) {
        nQtyPerdiemInvoice = 0;
        totalPayPerdiems = 0;
        changeValue.map(item => {
          if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
            nQtyPerdiemInvoice = 1;
          }
        });
      }
      setQtyPerdiem(nQtyPerdiem);
      setTotalPayrollPerdiem(nQtyPerdiem * valuePerdiem);
      setQtyPerdiemInvoice(nQtyPerdiemInvoice);
      setTotalInvoicePerdiem(nQtyPerdiemInvoice * invoicePerdiem);
      setTotalPerdiems((nQtyPerdiemInvoice * invoicePerdiem) + (nQtyPerdiem * valuePerdiem));
      totalPayPerdiems = (nQtyPerdiemInvoice * invoicePerdiem) + (nQtyPerdiem * valuePerdiem);

      let nTotalPay = nTotalOvertime * payrollRateOvertime;
      setHoursWorkedOvertime(nTotalOvertime);
      setTotalHoursOvertime(nTotalOvertime + hoursOTLine + hoursWorkedExced);
      setTotalHours(totalHoursRegular + nTotalOvertime + hoursOTLine + hoursWorkedExced);
      setPaymentOvertimeHours(nTotalPay);
      setPayment(nTotalPay + totalPayPerdiems + paymentOTLine + paymentRegularHours);
      setTableData(changeValue);
    }
  };

  const onChangeQtyPerdiem = (e) => {
    let { value } = e.target;
    value = validFloat(value);
    setQtyPerdiem(value);
    setTotalPayrollPerdiem(value * valuePerdiem);
    setTotalInvoicePerdiem(qtyPerdiemInvoice * invoicePerdiem);
    setTotalPerdiems((value * valuePerdiem) + (qtyPerdiemInvoice * invoicePerdiem));
    setPayment((value * valuePerdiem) + (qtyPerdiemInvoice * invoicePerdiem) + paymentOTLine + paymentOvertimeHours + paymentRegularHours);
  }

  const onChangeValuePerdiem = (e) => {
    let { value } = e.target;
    let valueInput = value;
    value = validFloat(value);
    setTotalPayrollPerdiem(qtyPerdiem * value);
    setValuePerdiem(valueInput);
    setTotalPerdiems(totalInvoicePerdiem + (qtyPerdiem * value));
    setPayment((qtyPerdiem * value) + totalInvoicePerdiem + paymentOTLine + paymentOvertimeHours + paymentRegularHours);
  }

  const onChangeQtyPerdiemInvoice = (e) => {
    let { value } = e.target;
    value = validFloat(value);
    setQtyPerdiemInvoice(value);
    setTotalPayrollPerdiem(qtyPerdiem * valuePerdiem);
    setTotalInvoicePerdiem(value * invoicePerdiem);
    setTotalPerdiems((qtyPerdiem * valuePerdiem) + (value * invoicePerdiem));
    setPayment((qtyPerdiem * valuePerdiem) + (value * invoicePerdiem) + paymentOTLine + paymentOvertimeHours + paymentRegularHours);
  }

  const onUpdateValuePerdiem = (e) => {
    let { value } = e.target;
    let valueInput = value;
    value = validFloat(value);
    setTotalInvoicePerdiem(qtyPerdiemInvoice * value);
    setInvoicePerdiem(valueInput);
    setTotalPerdiems(totalPayrollPerdiem + (qtyPerdiemInvoice * value));
    setPayment((qtyPerdiemInvoice * value) + totalPayrollPerdiem + paymentOTLine + paymentOvertimeHours + paymentRegularHours);
  }

  const onInputChange = (e) => {
    let { id, value, checked } = e.target;
    if (id === 'noPayment') {
      setNoPayment(checked);
    } else if (id === 'changePayrollInProfile') {
      setChangePayrollInProfile(checked);
    } else if (id === 'changeInvoiceInProfile') {
      setChangeInvoiceInProfile(checked);
    }
  }

  const fnViewHours = () => {
    let qtyMax = validFloat(customerData.maxReghoursPayroll) == 0 ? 40 : validFloat(customerData.maxReghoursPayroll);
    let changeDaysReg = daysReg.map(item => {
      item.date = "";
      item.qty = 0;
      item.qtyOvertime = 0;
      item.dateText = "";
      return item;
    });
    let nameDates = []
    let nCant = 0;
    listDates.forEach((date) => {
      let numberDay = (new Date(date + 'T12:00:00Z')).getDay();
      let day = daysMap[numberDay || 7];
      changeDaysReg[nCant].date = date;
      changeDaysReg[nCant].dateText = date + "-" + day;
      changeDaysReg[nCant].dateStr = day.toUpperCase();
      nameDates.push(date + '-' + day);
      nCant++;
    });

    nameDates = Object.keys(currentItem.hoursWorked);
    nameDates.forEach((date) => {
      let hoursWorked2 = currentItem.hoursWorked[date];
      changeDaysReg = changeDaysReg.map(item => {
        if (item.dateText == date) {
          item.id = hoursWorked2.id;
          item.hours = hoursWorked2.hours;
          item.hoursOvertime = hoursWorked2.hoursOvertime;
        }
        return item;
      });
    });
    let nTotal = changeDaysReg.reduce((oldValue, item) => {
      oldValue += validFloat(item.hours);
      return oldValue;
    }, 0);
    let nTotalOvertime = changeDaysReg.reduce((oldValue, item) => {
      oldValue += validFloat(item.hoursOvertime);
      return oldValue;
    }, 0);

    let nTotalLineTypes = 0
    let nTotalPayOtherHours = 0;
    let nSubtotal = 0;
    if (currentItem.weeklyPayrollsOvertimes && currentItem.weeklyPayrollsOvertimes.length > 0) {
      nTotalLineTypes = currentItem.weeklyPayrollsOvertimes.reduce((oldValue, item) => {
        oldValue += validFloat(item.qty);
        nSubtotal = (item.qty * item.price * item.qtyPrice);
        nTotalPayOtherHours += validFloat(nSubtotal);
        return oldValue;
      }, 0);

      let newLineTypes = lineTypes.map(item => {
        let filter = currentItem.weeklyPayrollsOvertimes.filter(elem => {
          return elem.overtimeId == item.id;
        })[0];
        if (filter && filter.overtimeId) {
          item.qty = filter.qty;
        }
        return item;
      });
      setLineTypes(newLineTypes);
    }
    let regHours = (nTotal > qtyMax) ? (qtyMax) : nTotal;
    let excedHours = (nTotal > qtyMax) ? (nTotal - qtyMax) : 0;
    let nTotalPay = (regHours * currentItem.rate) + (excedHours * currentItem.rateOvertime);

    let nQtyPerdiem = (nTotal + nTotalOvertime + nTotalLineTypes) > 0 ? ((currentItem.fixedPerdiem === 1 || currentItem.fixedPerdiem === true) ? 1 : currentItem.qtyPerdiem) : 0;
    let nQtyPerdiemInvoice = (nTotal + nTotalOvertime + nTotalLineTypes) > 0 ? ((currentItem.fixedPerdiem2 === 1 || currentItem.fixedPerdiem2 === true) ? 1 : currentItem.qtyPerdiem2) : 0;

    setQtyPerdiem(nQtyPerdiem);
    setQtyPerdiemInvoice(nQtyPerdiemInvoice);
    setMaxWeekHours(qtyMax);
    setTableData(changeDaysReg);
    setDaysReg(changeDaysReg);
    setHoursOTLine(nTotalLineTypes);
    setHoursWorked(nTotal);
    setHoursWorkedExced(excedHours);
    setHoursWorkedOvertime(nTotalOvertime);
    setTotalHoursRegular(regHours);
    setTotalHoursOvertime(nTotalOvertime + excedHours + nTotalLineTypes);
    setTotalHours(regHours + nTotalOvertime + excedHours + nTotalLineTypes);
    setPaymentOTLine(nTotalPayOtherHours);
    setPaymentRegularHours(nTotalPay);
    setPaymentOvertimeHours(nTotalOvertime * currentItem.rateOvertime);
    setPayment(nTotalPay + nTotalPayOtherHours + (nTotalOvertime * currentItem.rateOvertime) + (nQtyPerdiem * currentItem.payPerdiem) + (nQtyPerdiemInvoice * currentItem.invoicePerdiem));
    setTotalPayrollPerdiem(nQtyPerdiem * currentItem.payPerdiem);
    setTotalInvoicePerdiem(nQtyPerdiemInvoice * currentItem.invoicePerdiem);
    setTotalPerdiems((nQtyPerdiem * currentItem.payPerdiem) + (nQtyPerdiemInvoice * currentItem.invoicePerdiem));
    setHoursOTLine(nTotalLineTypes);
  };

  const fnCalculateTotalHours = () => {
    let { nTotal, nTotal1, nTotal2 } = totalHoursRegister.reduce((res, curr, idx) => {
      res.nTotal += curr.dailies_payrolls.reduce((re, cr) => { re += cr.isTotal ? 0 : validFloat(cr.hours); return re; }, 0) + curr.dailies_payrolls.reduce((re, cr) => { re += cr.isTotal ? 0 : validFloat(cr.hoursOvertime); return re; }, 0);
      res.nTotal1 += curr.dailies_payrolls.reduce((re, cr) => { re += cr.isTotal ? 0 : validFloat(cr.hours); return re; }, 0);
      res.nTotal2 += curr.dailies_payrolls.reduce((re, cr) => { re += cr.isTotal ? 0 : validFloat(cr.hoursOvertime); return re; }, 0);
      return res;
    }, { nTotal: 0, nTotal1: 0, nTotal2: 0 });
    setGlobalTotalHours(nTotal);
    setGlobalTotalRegularHours(nTotal1);
    setGlobalTotalOvertimeHours(nTotal2);
    const hd = {}
    hd.regularHoursPayroll = validInt(customerData.maxReghoursPayroll) > nTotal ? nTotal : customerData.maxReghoursPayroll;
    hd.regularHoursInvoice = validInt(customerData.maxReghoursInvoice) > nTotal ? nTotal : customerData.maxReghoursInvoice;
    hd.overtimeHoursPayroll = validInt(customerData.maxReghoursPayroll) < nTotal ? nTotal - validInt(customerData.maxReghoursPayroll) : 0;
    hd.overtimeHoursInvoice = validInt(customerData.maxReghoursInvoice) < nTotal ? nTotal - validInt(customerData.maxReghoursInvoice) : 0;
    hd.payrollTotal = nTotal;
    hd.invoiceTotal = nTotal;
    setHoursDistribution(hd);
  }

  const fnChangeDataPayment = (e) => {
    let value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    let { id } = e.target;
    if (id === 'fixedPerdiem' && value === true) {
      setQtyPerdiem(1);
      setTotalPayrollPerdiem(value * valuePerdiem);
      setTotalPerdiems((value * valuePerdiem) + (value * invoicePerdiem));
      setPayment((value * valuePerdiem) + (value * invoicePerdiem) + paymentOTLine + paymentOvertimeHours + paymentRegularHours);
    }
    if (id === 'fixedPerdiem' && value === false && handPerdiem === false) {
      let nQtyPerdiem = 0;
      tableData.map(item => {
        if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
          nQtyPerdiem++;
        }
      });
      setQtyPerdiem(nQtyPerdiem);
      setTotalPayrollPerdiem(nQtyPerdiem * valuePerdiem);
      setTotalPerdiems((nQtyPerdiem * valuePerdiem) + (value * invoicePerdiem));
    }
    if (id === 'handPerdiem' && value === false && fixedPerdiem === false) {
      let nQtyPerdiem = 0;
      tableData.map(item => {
        if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
          nQtyPerdiem++;
        }
      });
      setQtyPerdiem(nQtyPerdiem);
      setTotalPayrollPerdiem(nQtyPerdiem * valuePerdiem);
      setTotalPerdiems((nQtyPerdiem * valuePerdiem) + (value * invoicePerdiem));
    }
    //perdiems de factura
    if (id === 'fixedPerdiemInvoice' && value === true) {
      setQtyPerdiemInvoice(1);
      setTotalInvoicePerdiem(value * invoicePerdiem);
      setTotalPerdiems((value * valuePerdiem) + (value * invoicePerdiem));
      setPayment((value * valuePerdiem) + (value * invoicePerdiem) + paymentOTLine + paymentOvertimeHours + paymentRegularHours);
    }
    if (id === 'fixedPerdiemInvoice' && value === false && handPerdiemInvoice === false) {
      let nQtyPerdiemInvoice = 0;
      tableData.map(item => {
        if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
          nQtyPerdiemInvoice++;
        }
      });
      setQtyPerdiemInvoice(nQtyPerdiemInvoice);
      setTotalInvoicePerdiem(nQtyPerdiemInvoice * invoicePerdiem);
      setTotalPerdiems((qtyPerdiem * valuePerdiem) + (nQtyPerdiemInvoice * invoicePerdiem));
    }
    if (id === 'handPerdiemInvoice' && value === false && fixedPerdiemInvoice === false) {
      let nQtyPerdiemInvoice = 0;
      tableData.map(item => {
        if (validFloat(item.hours) > 0 || validFloat(item.hoursOvertime) > 0) {
          nQtyPerdiemInvoice++;
        }
      });
      setQtyPerdiemInvoice(nQtyPerdiemInvoice);
      setTotalInvoicePerdiem(nQtyPerdiemInvoice * invoicePerdiem);
      setTotalPerdiems((qtyPerdiem * valuePerdiem) + (nQtyPerdiemInvoice * invoicePerdiem));
    }

    if (id === 'payrollRate') {
      setPayrollRate(value);
    } else if (id === 'payrollRateOvertime') {
      setPayrollRateOvertime(value);
    } else if (id === 'payNotes') {
      setPayNotes(value);
    } else if (id === 'fixedPerdiem') {
      setFixedPerdiem(value);
    } else if (id === 'handPerdiem') {
      setHandPerdiem(value);
    } else if (id === 'invoiceRate') {
      setInvoiceRate(value);
    } else if (id === 'invoiceRateOvertime') {
      setInvoiceRateOvertime(value);
    } else if (id === 'fixedPerdiemInvoice') {
      setFixedPerdiemInvoice(value);
    } else if (id === 'handPerdiemInvoice') {
      setHandPerdiemInvoice(value);
    }
  }

  const fnSavePayrollValues = () => {

    const newData = {
      id: currentItem.id,
      rate: payrollRate,
      rateOvertime: payrollRateOvertime,
      notes: payNotes,
      qtyPerdiem,
      payPerdiem: valuePerdiem,
      fixedPerdiem,
      handPerdiem,
      editRatePayrollInProfile: changePayrollInProfile
    };

    setLoading(true);
    request.PUT('/weeklyPayrollsDetails', newData, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetPayroll();
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

  const fnSaveInvoiceValues = () => {

    const newData = {
      id: currentItem.id,
      rateInvoice: invoiceRate,
      rateInvoiceOvertime: invoiceRateOvertime,
      notes: payNotes,
      qtyPerdiem2: qtyPerdiemInvoice,
      fixedPerdiem2: fixedPerdiemInvoice,
      handPerdiemInvoice,
      invoicePerdiem,
      editRateInvoiceInProfile: changeInvoiceInProfile
    };

    setLoading(true);
    request.PUT('/weeklyPayrollsDetails', newData, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetPayroll();
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

  const fnSaveChanges = () => {

    setDisabledBtnSave(true);

    tableData.map(item => {
      if (item.date !== "") {
        currentItem.hoursWorked[item.dateText].hours = item.hours;
        currentItem.hoursWorked[item.dateText].hoursOvertime = item.hoursOvertime;
      }
    });

    let lineSave = lineTypes.map(item => {
      item.overtimeId = item.id;
      return item;
    });

    currentItem.weeklyPayrollsOvertimes = lineSave;
    currentItem.qtyPerdiem = qtyPerdiem;
    currentItem.payPerdiem = totalHours > 0 ? valuePerdiem : 0;
    currentItem.totalHours = totalHours;
    currentItem.noPayment = noPayment;
    currentItem.qtyPerdiem2 = qtyPerdiemInvoice;
    currentItem.invoicePerdiem = totalHours > 0 ? invoicePerdiem : 0;
    currentItem.fixedPerdiem = fixedPerdiem;
    currentItem.fixedPerdiem2 = fixedPerdiemInvoice;
    currentItem.handPerdiem = handPerdiem;
    currentItem.handPerdiemInvoice = handPerdiemInvoice;
    // fnSavePayrollValues();
    // fnSaveInvoiceValues();
    setOpen(false);
    fnUpdateDataToUpdate(currentItem);
    fnSaveAll();
    setDisabledBtnSave(false);
  }

  useEffect(() => {
    fnViewHours();
    fnCalculateTotalHours();
  }, []);

  return (
    {
      hoursOTLine,
      lineTypes,
      qtyPerdiem,
      totalPayrollPerdiem,
      payment,
      hoursWorked,
      hoursWorkedOvertime,
      totalHoursRegular,
      totalHoursOvertime,
      totalHours,
      totalHoursRegister,
      globalTotalRegularHours,
      globalTotalOvertimeHours,
      globalTotalHours,
      hoursDistribution,
      payrollRate,
      payrollRateOvertime,
      payNotes,
      fixedPerdiem,
      handPerdiem,
      valuePerdiem,
      noPayment,
      changePayrollInProfile,
      invoiceRate,
      invoiceRateOvertime,
      fixedPerdiemInvoice,
      handPerdiemInvoice,
      qtyPerdiemInvoice,
      invoicePerdiem,
      totalInvoicePerdiem,
      changeInvoiceInProfile,
      tableData,
      onChangeValueOtherHours,
      onChangeQtyPerdiem,
      onChangeValueHours,
      onChangeValueOvertimeHours,
      onChangeValuePerdiem,
      onInputChange,
      onChangeQtyPerdiemInvoice,
      onUpdateValuePerdiem,
      fnChangeDataPayment,
      fnSavePayrollValues,
      fnSaveInvoiceValues,
      fnSaveChanges,
      disabledBtnSave
    }
  )
}
