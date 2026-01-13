import { useState, useEffect } from 'react';
import { currencyFormatter, formatDateToShow, validInt} from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';
import { request } from 'app/utils/core';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Delete, Edit, ImportExport } from '@mui/icons-material';

export const useAdjustments = ({setLoading, sweetAlerts, typeId, screenControl}) => {
  const { optDelete } = screenControl;
  const {t} = useTranslation();
  const [idAdjustment, setIdAdjustment] = useState(0);
  const [listYears, setListYears] = useState([]);
  const [listWeeksWorked, setListWeeksWorked] = useState([]);
  const [listEmployees, setListEmployees] = useState([]);
  const [listTypeAdjusts, setListTypeAdjusts] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [openModalExport, setOpenModalExport] = useState(false);
  const titleTable = typeId===1?'table.adjustments.title':'table.deductions.title';
  const columnType = typeId===1?'table.adjustments.column.adjustmentsType':'table.deductions.column.deductionType';

  const fnGetData = ()=>{
    setLoading(true);
    request.GET(`/adjustments/findAll?adjustmentType=${typeId}`, (resp)=>{
      const data = resp.adjustments.map((item)=>{
        item.adjustmentsType = item.deductionName
        item.numWeek = item.descripWeek
        return item
      });

      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnEditDocto = (item)=>{
    setCurrentItem(item);
  }

  const fnDeleteDocto = (item)=>{
    if (optDelete === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setIdAdjustment(item.id);
    setOpenMsgDelete(true);
  }

  const fnOkDelete = ()=>{
    if(validInt(idAdjustment)<=0){
      return;
    }
    setLoading(true);
    request.DELETE(`/adjustments`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setIdAdjustment(0);
      fnGetData();
      setLoading(false);
    }, err=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setIdAdjustment(0);
      setLoading(false);
    },{id: idAdjustment});
  }

  const fnExportAdjustments = ()=>{
    setOpenModalExport(true);
  }

  const table = {
    title: t(titleTable),
    columns: [
      {field: 'id', headerName: t('tables.column.id'), flex: 0.3},
      {field: 'employeeName', headerName: t('table.deductions.column.name'), flex: 1.2},
      {field: 'customerName', headerName: t('table.deductions.customerName'), flex: 1},
      {field: 'numWeek', headerName: t('table.deductions.noWeek'), flex: 0.5 },
      {field: 'adjustmentsType', headerName: t(columnType), flex: 0.7},
      {field: 'value', headerName: t('table.deductions.column.value'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {field: 'description', headerName: t('table.deductions.column.description'), flex: 1.2},
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnEditDocto(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label= {t("button.delete")}
            onClick={() => fnDeleteDocto(row)}
            color='error'
          />
        ],
      }
    ],
    data: tableData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    },
    freeActions: [{
      Icon: () => <ImportExport />,
      label: t("action.exportToExcel"),
      onClick: fnExportAdjustments
    }]
  };

  useEffect(()=>{
    setLoading(true);
    request.GET('/setWeekYear/getYears', (resp)=>{
      const filterList = resp.yearsWeeks.filter((item)=>{
        return item.year !== null
      });
      const yearsList = filterList.map((item)=>{
        return {
          value: item.year,
          label: item.year
        }
      });
      setListYears(yearsList);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/setWeekYear', (resp)=>{
      const weeksYear = resp.setWeekYear.map((item)=>{
        return {
          id: item.id,
          value: item.noWeek,
          label: `#${item.noWeek} WEEK OF ${formatDateToShow(item.startDate)} TO ${formatDateToShow(item.endDate)}`,
          year: item.year,
          startDate: item.startDate,
          endDate: item.endDate,
          noWeek: item.noWeek
        }
      });

      setListWeeksWorked(weeksYear);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/employees/list?statusId=4', (resp)=>{
      const employees = resp.employees.map((item)=>{
        return {
          id: item.id,
          value: item.id,
          label: `${item.code} | ${item.name}`
        }
      });

      setListEmployees(employees);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET(`/setDeductionTypes?status=1&type=${typeId}`, (resp)=>{
      const deductionTypes = resp.setDeductionTypes.map((item)=>{
        return {
          value: item.id,
          label: item.name
        }
      });

      setListTypeAdjusts(deductionTypes);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET(`/customers/list`, (resp)=>{
      const customers = resp.customers.map((item)=>{
        return {
          id: item.id,
          value: item.id,
          label: item.name,
          code: item.code
        }
      });

      setListCustomers(customers);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });

    fnGetData();

  },[]);

  const propsToHeaderSection = {
    t,
    listYears,
    listWeeksWorked,
    listEmployees,
    listTypeAdjusts,
    setLoading,
    sweetAlerts,
    currentItem,
    setCurrentItem,
    fnGetData,
    screenControl
  }

  const propsToModalExport = {
    typeId,
    listYears,
    listWeeksWorked,
    listCustomers,
    setLoading
  }

  return (
    {
      propsToHeaderSection,
      propsToModalExport,
      table,
      openMsgDelete,
      openModalExport,
      setOpenMsgDelete,
      setOpenModalExport,
      fnOkDelete
    }
  )
}
