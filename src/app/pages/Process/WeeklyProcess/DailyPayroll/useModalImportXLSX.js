import { request } from 'app/utils/core';
import { validFloat } from 'app/utils/helpers';
import moment from 'moment';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const useModalImportXLSX = ({ t, setLoading, sweetAlerts, setOpen, data }) => {
  const navigate = useNavigate();
  const [headersForTable, setHeadersForTable] = useState([]);
  const [dataForTable, setDataForTable] = useState([]);
  const [openModalFormatImportData, setOpenModalFormatImportData] = useState(false);
  const [colNameEmployee, setColNameEmployee] = useState("");
  const [colClassEmployee, setColClassEmployee] = useState("");
  const [hasProcessData, setHasProcessData] = useState(false);
  const [employeeSearchType, setEmployeeSearchType] = useState(1);

  const { weekData } = data;
  const { startDate } = weekData;

  const [columnsToData, setColumnsToData] = useState([
    { title: 'Code', name: 'code', field: 'code', showNormalize: false },
    { title: 'Employee Name', name: 'employeeName', field: 'employee_name', showNormalize: false },
    { title: 'Classification', name: 'classificationName', field: 'classification', showNormalize: false },
    { title: `${moment(startDate, "YYYY-MM-DD").format("MM/DD/YYYY")} Regular`, name: 'day01', field: 'su', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").format("MM/DD/YYYY")} OT`, name: 'day01_ot', field: 'su_ot', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").add(1, "days").format("MM/DD/YYYY")} Regular`, name: 'day02', field: 'mo', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").add(1, "days").format("MM/DD/YYYY")} OT`, name: 'day02_ot', field: 'mo_ot', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").add(2, "days").format("MM/DD/YYYY")} Regular`, name: 'day03', field: 'tu', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").add(2, "days").format("MM/DD/YYYY")} OT`, name: 'day03_ot', field: 'tu_ot', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").add(3, "days").format("MM/DD/YYYY")} Regular`, name: 'day04', field: 'wed', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").add(3, "days").format("MM/DD/YYYY")} OT`, name: 'day04_ot', field: 'wed_ot', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").add(4, "days").format("MM/DD/YYYY")} Regular`, name: 'day05', field: 'thu', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").add(4, "days").format("MM/DD/YYYY")} OT`, name: 'day05_ot', field: 'thu_ot', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").add(5, "days").format("MM/DD/YYYY")} Regular`, name: 'day06', field: 'fr', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").add(5, "days").format("MM/DD/YYYY")} OT`, name: 'day06_ot', field: 'fr_ot', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").add(6, "days").format("MM/DD/YYYY")} Regular`, name: 'day07', field: 'sa', showNormalize: true },
    { title: `${moment(startDate, "YYYY-MM-DD").add(6, "days").format("MM/DD/YYYY")} OT`, name: 'day07_ot', field: 'sa_ot', showNormalize: true },
  ]);

  const fnProcessImportData = () => {

    setLoading(true);
    request.GET("/employees/getLSForImportXLSX", resp => {
      const { data } = resp;
      const { employees, classifications } = data;
      let validCodeEmp = dataForTable.map(elem => {
        const currentName = elem[colNameEmployee];
        const findEmployee = employees.find(item => item.name === currentName);
        elem.id = findEmployee?.id || 0;
        elem.code = findEmployee?.code || '';
        return elem;
      });
      validCodeEmp = validCodeEmp.map(elem => {
        const currClassification = elem[colClassEmployee];
        const findClassId = classifications.find(item => item.name === currClassification);
        elem.classificationId = findClassId?.id || 8;
        elem.classificationName = findClassId?.name || 'Mechanic Electrician';
        return elem;
      })
      setDataForTable(validCodeEmp);
      setOpenModalFormatImportData(false);
      setLoading(false);
      setHasProcessData(true)
    }, err => {
      setLoading(false);
      console.error(err);
    });
  };

  const fnSaveImportData = () => {

    const { customerId, projectId, weekId, weekData } = data;
    const { startDate } = weekData;
    const employees = dataForTable.map(elem => {
      elem.day1 = validFloat(elem[columnsToData.find(item => item.name === 'day01').field] || 0)
      elem.dayOT1 = validFloat(elem[columnsToData.find(item => item.name === 'day01_ot').field] || 0)
      elem.day2 = validFloat(elem[columnsToData.find(item => item.name === 'day02').field] || 0)
      elem.dayOT2 = validFloat(elem[columnsToData.find(item => item.name === 'day02_ot').field] || 0)
      elem.day3 = validFloat(elem[columnsToData.find(item => item.name === 'day03').field] || 0)
      elem.dayOT3 = validFloat(elem[columnsToData.find(item => item.name === 'day03_ot').field] || 0)
      elem.day4 = validFloat(elem[columnsToData.find(item => item.name === 'day04').field] || 0)
      elem.dayOT4 = validFloat(elem[columnsToData.find(item => item.name === 'day04_ot').field] || 0)
      elem.day5 = validFloat(elem[columnsToData.find(item => item.name === 'day05').field] || 0)
      elem.dayOT5 = validFloat(elem[columnsToData.find(item => item.name === 'day05_ot').field] || 0)
      elem.day6 = validFloat(elem[columnsToData.find(item => item.name === 'day06').field] || 0)
      elem.dayOT6 = validFloat(elem[columnsToData.find(item => item.name === 'day06_ot').field] || 0)
      elem.day7 = validFloat(elem[columnsToData.find(item => item.name === 'day07').field] || 0)
      elem.dayOT7 = validFloat(elem[columnsToData.find(item => item.name === 'day07_ot').field] || 0)
      return elem;
    });

    const dataCreateAddEmployee = {
      customerId,
      projectId,
      weekId,
      startDate,
      employees
    };
    request.POST("/weeklyPayrolls/addEmployeeWorkedXLSX", dataCreateAddEmployee, (resp) => {
      setOpen(false);
      setHasProcessData(false);
      navigate(`/process/weeklyProcess/dailyPayroll`, {
        replace: false
      });
    }, err => {
      console.warn(err);
    })
  };

  return (
    {
      dataForTable,
      columnsToData,
      colClassEmployee,
      colNameEmployee,
      hasProcessData,
      headersForTable,
      openModalFormatImportData,
      setColNameEmployee,
      setColClassEmployee,
      setColumnsToData,
      setDataForTable,
      setHasProcessData,
      setHeadersForTable,
      setOpenModalFormatImportData,
      fnProcessImportData,
      fnSaveImportData,
      employeeSearchType,
      setEmployeeSearchType
    })
}
