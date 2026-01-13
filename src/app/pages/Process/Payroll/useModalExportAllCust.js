import { request } from 'app/utils/core';
import { useEffect, useState } from 'react';

export const useModalExportAllCust = ({ currentYear, weeksList, allColumnsTable, sweetAlerts, t, setLoading, screenControl }) => {
  const { optCreate } = screenControl;
  const [yearId, setYearId] = useState(currentYear);
  const [weekId, setWeekId] = useState(0);
  const [numWeek, setNumWeek] = useState("");
  const [noYear, setNoYear] = useState("");
  const [list, setList] = useState([]);
  const [listWeeksFilter, setListWeeksFilter] = useState([]);
  const [selectAllOptions, setSelectAllOptions] = useState(false);

  const onCheckChange = (e) => {
    let newList = list.map((elem) => {
      if (elem.id === e.target.id) {
        elem.selected = !elem.selected;
      }
      return elem;
    });
    setList(newList);
  };

  const onCheckAllChange = (e) => {
    let selected = e.target.checked;
    setSelectAllOptions(selected);
    let newList = list.map(elem => {
      elem.selected = selected;
      return elem
    });
    setList(newList);
  }

  const onChangeYearId = (e) => {
    let valueSelected = e.target.value;
    setYearId(valueSelected);
  };

  const onWeekChange = (e) => {
    const value = e.target.value;
    setWeekId(value);
    let weekSelected = listWeeksFilter.find((item) => {
      return item.id === value;
    });
    if (weekSelected && weekSelected.id) {
      setNumWeek(weekSelected.noWeek);
      setNoYear(weekSelected.year);
    } else {
      setNumWeek("");
      setNoYear("");
    }
  };

  const fnExportXLSXDocument = async () => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    if (!yearId) {
      sweetAlerts('warning', t("warning.yearIdSelected"));
      return;
    }

    if (!weekId) {
      sweetAlerts('warning', t("warning.weekIdSelected"));
      return;
    }

    let exportFields = [];

    allColumnsTable.map((elem) => {
      list.map((item) => {
        if (item.id === elem.field && item.selected) {
          let newRow = {
            title: elem.caption,
            field: elem.field,
            type: elem.type,
            length: elem.length,
            isSum: elem.isSum,
            currency: elem.type === "currency" ? true : false,
          };
          exportFields.push(newRow);
        }
      });
      return elem;
    });

    setLoading(true);
    const data = {
      noYear: yearId,
      noWeek: numWeek,
      fields: exportFields,
      reportTitle: "Payroll",
      nameXLSXFile: "PayrollDetail All Customers Week " + numWeek + "-" + noYear + ".xlsx",
    };

    const cNameFile = "PayrollDetail All Customers Week" + numWeek + "-" + noYear + ".xlsx";
    await request.fnExportToXLSX("/weeklyPayrollsDetails/exportDetaForAll", data, cNameFile);
    setLoading(false);
  }

  useEffect(() => {
    const fieldsDetault = ['employeeName', 'classificationName', 'rate', 'rateOvertime', 'hoursWorked', 'regularHours', 'overtimeHours', 'totalHours', 'payTotalHours', 'totalPayment', 'bankName', 'bankAccount', 'bankNote', 'totalLoans', 'totalDeductions', 'totalAdjustments', 'totalPerdiem', 'paymentDeliveryName', 'ciaAccount'];

    let listChange = allColumnsTable.map((elem) => {
      return {
        id: elem.field,
        name: elem.name,
        title: elem.title,
        selected: fieldsDetault.indexOf(elem.field) === -1 ? false : true
      };
    });
    setList(listChange);
  }, [allColumnsTable]);

  useEffect(() => {
    setWeekId(0);
    let weeksFilter = weeksList.filter((item) => {
      return item.year === yearId;
    });
    setListWeeksFilter(weeksFilter);
  }, [weeksList, yearId]);

  return (
    {
      yearId,
      weekId,
      selectAllOptions,
      listWeeksFilter,
      list,
      onChangeYearId,
      onWeekChange,
      onCheckChange,
      onCheckAllChange,
      fnExportXLSXDocument
    }
  )
}
