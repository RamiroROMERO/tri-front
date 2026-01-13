import { useForm } from "app/hooks";
import { request } from "app/utils/core";
import { validInt } from "app/utils/helpers";
import moment from "moment";
import { useEffect, useState } from "react";

export const useFilter = ({ setLoading, tableData, setTableData }) => {

  const [customerList, setCustomerList] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState({});
  const [yearList, setYearList] = useState([]);
  const [weekList, setWeekList] = useState([]);
  const [allWeeks, setAllWeeks] = useState([]);

  const { formState, onInputChange } = useForm({ noYear: '', noWeek: '', customerId: '' });
  const { noYear, noWeek, customerId } = formState;

  const onChangeCustomerId = ({ target }) => {
    const { value: currentValue } = target;
    setWeekList([]);
    setAllWeeks([]);
    const findCustomer = customerList.find(fn => validInt(fn.value) === validInt(currentValue));
    console.log(findCustomer);
    if (setCurrentCustomer) setCurrentCustomer(findCustomer);
    onInputChange({ target: { name: 'customerId', value: currentValue } });
    request.GET(`/customersWeeks/getSL?customerId=${target.value}`, resp => {
      const { customerWeeks } = resp;
      const currentWeeks = customerWeeks.map(week => {
        const item = {
          id: week.id,
          noWeek: week.noWeek,
          noYear: week.year,
          value: week.noWeek,
          label: `#${week.noWeek} - ${week.year} W/E ${moment(week.endDate).format("MM/DD/YYYY")}`
        }
        return item;
      });
      setAllWeeks(currentWeeks);
      if (validInt(noYear) !== 0) {
        setWeekList(currentWeeks.filter(week => validInt(week.noYear) == validInt(noYear)));
      }
    }, err => { console.error(err) })
  }

  const onChangeYearId = ({ target }) => {
    const currentYear = target.value;
    setWeekList([]);
    onInputChange({ target: { name: 'noYear', value: currentYear } });
    setWeekList(allWeeks.filter(week => week.noYear === currentYear));
    // onInputChange({target:{value:0,name: noWeek}});
  }

  const fnGetDataFilters = () => {

    request.GET('/setWeekYear/getYears', resp => {
      const { yearsWeeks } = resp;
      const currentYearList = yearsWeeks.map(item => {
        const newItem = { label: item.year, value: item.year };
        return newItem;
      });
      setYearList(currentYearList);
    }, err => {
      console.error(err);
    });
    request.GET('/customers/getSL', resp => {
      const { customers } = resp;
      const currentCustomerList = customers.map(item => {
        const newItem = {
          label: item.name,
          value: item.id
        };
        return newItem;
      });
      setCustomerList(currentCustomerList);
    }, err => {
      console.log(err);
    })

  }

  const fnExportToXLSX = async () => {

    if (tableData.length <= 0) {
      return;
    }
    const nameXLSXFile = `subSeqEmpWork.xlsx`;
    setLoading(true);
    const exportData = {
      fields: [
        { title: 'Employee Code', field: 'code', type: 'String', length: 50, isSum: false, currency: false },
        { title: 'Employee Name', field: 'name', type: 'String', length: 120, isSum: false, currency: false },
        { title: 'Classification', field: 'classification', type: 'String', length: 100, isSum: false, currency: false },
        { title: 'Previous Project', field: 'prevProject', type: 'String', length: 100, isSum: false, currency: false },
        { title: 'Previous Hours', field: 'prevHours', type: 'decimal', length: 60, isSum: true, currency: false },
        { title: 'Current Project', field: 'currProject', type: 'String', length: 100, isSum: false, currency: false },
        { title: 'Current Hours', field: 'currHours', type: 'decimal', length: 60, isSum: true, currency: false }
      ],
      data: tableData,
      headerData: [
        { title: 'Customer', description: currentCustomer.label },
        { title: 'Week', description: `${noWeek} - ${noYear}` }
      ],
      reportTitle: "Subsequence Employee Work",
      typeFormat: 1,
      nameXLSXFile
    };
    await request.fnExportToXLSX("/payroll/exportSubsequenceEmployees", exportData, nameXLSXFile);
    setLoading(false);

  }

  const fnRefreshData = () => {
    setLoading(true);
    const url = `/payroll/getSubsequenceEmployees?customerId=${customerId}&noYear=${noYear}&noWeek=${noWeek}`
    request.GET(url, resp => {
      const { data } = resp;
      setTableData(data);
      setLoading(false);
    }, err => {
      console.error(err);
      setLoading(false);
    })
  }

  useEffect(() => {
    fnGetDataFilters()
  }, [])


  return {
    customerList,
    yearList,
    weekList,
    customerId,
    noYear,
    noWeek,
    onInputChange,
    fnRefreshData,
    onChangeCustomerId,
    onChangeYearId,
    fnExportToXLSX
  }

}