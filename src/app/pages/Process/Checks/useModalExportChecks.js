import { request } from 'app/utils/core';
import React, { useEffect, useState } from 'react'

const fieldsDetault = ['code', 'name', 'classificationName', 'deliveryTypeName', 'totalHours', 'totalPayment'];

export const useModalExportChecks = (rowsSelected, detailData, columnsExportList) => {

  const [list, setList] = useState([]);

  const fnExportChecks = async () => {
    // setLoading(true);
    let exportFields = [];

    columnsExportList.map((elem) => {
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
      fields: exportFields,
      // headerData: [
      //   { title: "Customer Name:", description: customerName },
      //   { title: "Week:", description: numWeek + "-" + noYear + " | " + dateIn + "-" + dateOut },
      //   { title: "Locations:", description: locationsName },
      // ],
      reportTitle: "Check List",
      nameXLSXFile: "Checks.xlsx",
      data: rowsSelected
    };
    let cNameFile = "checksList.xlsx"
    await request.fnExportToXLSX("/checks/exportXLSX", data, cNameFile);
    // await request.fnExportToXLSX("/weeklyPayrollsDetails/exportXLSX", data, cNameFile);
    // setLoading(false);
  }

  const onCheckChange = (e) => {
    let newList = list.map((elem) => {
      if (elem.id === e.target.id) {
        elem.selected = !elem.selected;
      }
      return elem;
    });
    setList(newList);
  };

  useEffect(() => {
    const initList = columnsExportList.map(elem => {
      return {
        id: elem.field,
        name: elem.name,
        title: elem.title,
        selected: fieldsDetault.indexOf(elem.field) === -1 ? false : true
      };
    })
    setList(initList);
  }, [])

  return {
    fnExportChecks,
    list,
    onCheckChange
  }

}
