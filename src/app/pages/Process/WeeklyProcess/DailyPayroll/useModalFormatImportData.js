import React from 'react'

export const useModalFormatImportData = ({ data }) => {

  const { headersForTable, columnsToData, setColumnsToData } = data;

  const columnsTable = headersForTable.map(elem => {
    return {
      id: elem.toString().replaceAll(" ", "_").toLowerCase(),
      value: elem.toString().replaceAll(" ", "_").toLowerCase(),
      label: elem
    };
  });

  const fnChangeFormatColumnFields = ({ target }) => {
    const { name, value } = target;
    const newColumnsToData = columnsToData.map(elem => {
      if (elem.name === name) elem.field = value;
      return elem;
    });
    setColumnsToData(newColumnsToData);
  }

  return {
    columnsTable,
    fnChangeFormatColumnFields
  }
}
