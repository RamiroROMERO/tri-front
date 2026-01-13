import { useEffect, useState } from 'react'
import { Icon } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Delete, Edit } from '@mui/icons-material';
import { validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const useStoreProducts = ({ setLoading, sweetAlerts, t }) => {
  const [tableData, setTableData] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [openModalNew, setOpenModalNew] = useState(false);
  const [productList, setproductList] = useState([]);
  const [listStores, setListStores] = useState([]);
  const [listLocation, setListLocation] = useState([]);

  const fnGetData = () => {
    setLoading(true);
    request.GET('/inventory/storeProducts', (resp) => {
      const data = resp.data.map((item) => {
        item.storeName = item.invWarehouse ? item.invWarehouse.name : ''
        item.productName = item.invProduct ? item.invProduct.name : ''
        item.locationName = item.invLocation ? item.invLocation.name : ''
        item.statusIcon = item.status == 1 ? "check_box" : "check_box_outline_blank"
        return item;
      });
      setTableData(data);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnCreateNewDocto = () => {
    setCurrentItem({});
    setOpenModalNew(true);
  }

  const fnDeleteDocto = (item) => {
    setCurrentItem(item);
    setOpenMsgDelete(true);
  }

  const fnOkDelete = () => {
    if (validInt(currentItem.id) <= 0) {
      return;
    }
    setLoading(true);
    request.DELETE(`/inventory/storeProducts/${currentItem.id}`, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetData();
      setLoading(false);
    }, err => {
      const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
      setLoading(false);
    }, { id: currentItem.id });
  }

  const fnEditDocto = (item) => {
    setCurrentItem(item);
    setOpenModalNew(true);
  }

  const table = {
    title: t("table.storeProducts.title"),
    columns: [
      { field: 'storeName', headerName: t("table.common.storeId"), flex: 1 },
      { field: 'productName', headerName: t("table.common.productId"), flex: 1 },
      { field: 'qtyMin', headerName: t("table.common.qtyMin"), flex: 0.5 },
      { field: 'qtyMax', headerName: t("table.common.qtyMax"), flex: 0.5 },
      { field: 'locationName', headerName: t("table.common.locationId"), flex: 1 },
      {
        field: 'statusIcon',
        headerName: t("table.common.status"),
        sortable: false,
        flex: 0.3,
        renderCell: ({ row, field }) => {
          return (<Icon>{row[field]}</Icon>)
        }
      },
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
    fnGetData();
    setLoading(true);
    request.GET('/inventory/stores', (resp) => {
      const storeListe = resp.data.map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      });
      setListStores(storeListe);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
    setLoading(true);
    request.GET('/inventory/products', (resp) => {
      const productListe = resp.data.map((item) => {
        return {
          value: item.id,
          label: `${item.code} | ${item.name}`
        }
      });
      setproductList(productListe);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
    setLoading(true);
    request.GET('/inventory/locations', (resp) => {
      const location = resp.data.map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      });
      setListLocation(location);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }, [])

  return (
    {
      table,
      openMsgDelete,
      setOpenMsgDelete,
      fnOkDelete,
      fnGetData,
      currentItem,
      openModalNew,
      setOpenModalNew,
      listStores,
      productList,
      listLocation
    }
  )
}
