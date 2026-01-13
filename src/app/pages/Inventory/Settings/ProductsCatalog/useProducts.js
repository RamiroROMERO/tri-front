import { Add, Delete, Edit } from '@mui/icons-material';
import { Icon } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

export const useProducts = ({ setLoading, sweetAlerts, t }) => {
  const [tableData, setTableData] = useState([]);
  const [rowSelected, setRowSelected] = useState({});
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [classificationList, setClassificationList] = useState([]);
  const [measureUnitList, setMeasureUnitList] = useState([]);
  const [trademarkList, setTrademarkList] = useState([]);

  const fnCreateNewDocto = () => {
    setRowSelected({});
    setOpenModalDetail(true);
  }

  const fnEditDocto = (row) => {
    setRowSelected(row);
    setOpenModalDetail(true);
  };

  const fnDeleteDocto = (row) => {
    setRowSelected(row);
    setOpenMsgDelete(true);
  }

  const fnOkDelete = () => {
    if (validInt(rowSelected.id) === 0) {
      return;
    }
    
    setLoading(true);
    request.DELETE(`/inventori/products/${rowSelected.id}`, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
      getProductsData();
    }, err => {
      const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
      setLoading(false);
      console.error(err);
    })
  }

  const getProductsData = () => {
    request.GET('/inventory/products', resp => {
      const { data } = resp;
      const newData = data.map(elem => {
        elem.classificationName = elem?.invClassification?.name || '';
        elem.trademarkName = elem?.invTrademark?.name || '';
        elem.measureUnitName = elem?.invMeasureUnit?.name || ''
        return elem;
      });
      setTableData(newData);
    }, err => {
      console.error(err);
    })
  }

  const fnGetLists = () => {
    request.GET('/inventory/products/getList', ({ data }) => {
      const { classifications, measureUnits, trademarks } = data;
      const classif = classifications.map(elem => {
        elem.value = elem.id;
        elem.label = elem.name;
        return elem;
      });
      const measuere = measureUnits.map(elem => {
        elem.value = elem.id;
        elem.label = elem.name;
        return elem;
      });
      const trade = trademarks.map(elem => {
        elem.value = elem.id;
        elem.label = elem.name;
        return elem;
      });
      setClassificationList(classif);
      setMeasureUnitList(measuere);
      setTrademarkList(trade);
    }, err => {
      console.error(err);
    });
  }

  const tableConfig = {
    title: t("table.products.title"),
    columns: [
      { field: 'code', headerName: t("table.products.column.code"), flex: 0.3 },
      { field: 'name', headerName: t("table.products.column.name"), flex: 1 },
      { field: 'trademarkName', headerName: t("table.products.column.trademark"), flex: 0.5 },
      { field: 'classificationName', headerName: t("table.products.column.classification"), flex: 0.5 },
      { field: 'status', headerName: t("table.common.status"), flex: 0.3, type: 'boolean' },
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
            label={t("button.delete")}
            onClick={() => fnDeleteDocto(row)}
            color='error'
          />
        ],
      },
    ],
    data: tableData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    },
    freeActions: [{
      Icon: () => <Add />,
      label: t("datatable.buttons.newDocument"),
      onClick: fnCreateNewDocto
    }]
  }

  useEffect(() => {
    fnGetLists();
    getProductsData();
  }, [])

  const dataToModalDetail = {
    rowSelected,
    classificationList,
    trademarkList,
    measureUnitList,
    fnGetData: getProductsData,
  }

  return {
    tableConfig,
    openModalDetail,
    setOpenModalDetail,
    dataToModalDetail,
    openMsgDelete,
    setOpenMsgDelete,
    fnOkDelete
  }
}
