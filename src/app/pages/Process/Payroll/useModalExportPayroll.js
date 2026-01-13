import { request } from 'app/utils/core';
import { useEffect, useState } from 'react';
import moment from 'moment';

export const useModalExportPayroll = ({ columnsTable, startDate, endDate, customerId, weekId, projectSelected, customerName, numWeek, noYear, locationsName, ciaAccount, setLoading, listProjects }) => {
  const [selectAllOptions, setSelectAllOptions] = useState(false);
  const [exportByCiaAccount, setExportByCiaAccount] = useState(0);
  const [list, setList] = useState([]);

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

  const onCheckByCiaAccountChange = (e) => {
    let selected = e.target.checked;
    setExportByCiaAccount(selected);
  }

  const fnExportXLSXDocument = async () => {
    setLoading(true);
    let dateIn = new Date(startDate + "T12:00:00Z");
    let dateOut = new Date(endDate + "T12:00:00Z");
    dateIn = moment(dateIn).format("MM/DD/YYYY");
    dateOut = moment(dateOut).format("MM/DD/YYYY");
    let exportFields = [];

    columnsTable.map((elem) => {
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

    const data = {
      view: "",
      where: {
        customerId,
        weekId,
        projectList: projectSelected,
        ciaAccount,
        exportByCiaAccount
      },
      fields: exportFields,
      headerData: [
        { title: "Customer Name:", description: customerName },
        { title: "Week:", description: numWeek + "-" + noYear + " | " + dateIn + "-" + dateOut },
        // { title: "Projects:", description: "" }
        // { title: "Locations:", description: locationsName },
      ],
      reportTitle: "Payroll",
      list1: columnsTable,
      nameXLSXFile: "PayrollDetail " + customerName + " Week" + numWeek + "-" + noYear + ".xlsx",
    };
    let cNameFile = ""
    let projectSelectedsToExport = [];

    projectSelected.map(prj => {
      const encProject = listProjects.find(fn => fn.id === prj)
      projectSelectedsToExport.push(encProject);
    })

    const projectInformation = projectSelectedsToExport.reduce((prv, acc) => {
      if (prv.projectNames !== "") {
        prv.projectNames += ", ";
      }
      if (prv.projectReferences !== "") {
        prv.projectReferences += ", ";
      }
      // prv.projectNames += acc.name + ((acc.jobReference && acc.jobReference !== "") ? ` - ${acc.jobReference}` : "");
      prv.projectNames += acc.name
      prv.projectReferences += (acc.jobReference && acc.jobReference !== "") ? acc.jobReference : ""
      return prv;
    }, { projectNames: "", projectReferences: "" });
    data.headerData.push({
      title: "Projects",
      description: projectInformation.projectNames
    });
    data.headerData.push({
      title: "Job References",
      description: projectInformation.projectReferences
    });

    if (projectSelected.length == 1) {
      let idProject = projectSelected[0];
      let dataProjects = listProjects.find(elem => elem.id === idProject);
      if (dataProjects.id) {
        let addReference = ""
        addReference = "_" + dataProjects.code + "_" + dataProjects.name
        if (dataProjects.jobReference && dataProjects.jobReference !== "") {
          addReference += "_" + dataProjects.jobReference;
        }
        cNameFile = "PayrollDetail " + customerName + "_" + ciaAccount + " Week" + numWeek + "-" + noYear + addReference + ".xlsx";
      }
      else {
        cNameFile = "PayrollDetail " + customerName + "_" + ciaAccount + " Week" + numWeek + "-" + noYear + ".xlsx";
      }
    } else {
      cNameFile = "PayrollDetail " + customerName + "_" + ciaAccount + " Week" + numWeek + "-" + noYear + ".xlsx";
    }


    await request.fnExportToXLSX("/weeklyPayrollsDetails/exportXLSX", data, cNameFile, () => {
      setLoading(false);
    });
    setLoading(false);
  }

  const fnPrintDocument = async () => {
    setLoading(true);

    let exportFields = [];

    columnsTable.map((elem) => {
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

    let dateIn = new Date(startDate + "T12:00:00Z");
    let dateOut = new Date(endDate + "T12:00:00Z");
    dateIn = moment(dateIn).format("MM/DD/YYYY");
    dateOut = moment(dateOut).format("MM/DD/YYYY");
    let namePDFFile = 'PayrollDetail ' + customerName + ' Week' + numWeek + '-' + noYear + '.pdf';
    let data = {
      where: {
        customerId,
        weekId,
        projectList: projectSelected,
        ciaAccount
      },
      fields: exportFields,
      reportTitle: 'Payroll Detail ' + customerName + ' Week ' + numWeek + '-' + noYear,
      typeFormat: 4,
      nameFile: namePDFFile,
      customerName: customerName,
      week: numWeek + '-' + noYear + ' | ' + dateIn + '-' + dateOut,
      locations: locationsName
    };
    await request.fnExportToPDF("/weeklyPayrollsDetails/printDetaPayroll", data, namePDFFile);
    setLoading(false);
  }

  useEffect(() => {
    const fieldsDetault = ['employeeName', 'classificationName', 'rate', 'rateOvertime', 'hoursWorked', 'regularHours', 'overtimeHours', 'totalHours', 'payTotalHours', 'totalPayment', 'bankName', 'bankAccount', 'bankNote', 'totalLoans', 'totalDeductions', 'totalAdjustments', 'totalPerdiem', 'paymentDeliveryName', 'ciaAccount'];

    const filterColumns = columnsTable.filter(item => item.field !== 'actions');

    const listChange = filterColumns.map((elem) => {
      return {
        id: elem.field,
        name: elem.name,
        title: elem.title,
        selected: fieldsDetault.indexOf(elem.field) === -1 ? false : true
      };
    });
    setList(listChange);
  }, [columnsTable]);

  return (
    {
      exportByCiaAccount,
      selectAllOptions,
      list,
      onCheckChange,
      onCheckAllChange,
      onCheckByCiaAccountChange,
      fnExportXLSXDocument,
      fnPrintDocument
    }
  )
}
