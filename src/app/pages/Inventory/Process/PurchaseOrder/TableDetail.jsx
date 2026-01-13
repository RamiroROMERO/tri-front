import React from 'react'
import { Delete, Edit } from '@mui/icons-material'
import { Paper, TableContainer } from '@mui/material'
import { formatNumber } from 'app/utils/helpers'
import { XDataGrid } from 'app/components/XDataGrid'
import { GridActionsCellItem } from '@mui/x-data-grid'

const TableDetail = ({orderDetail, t, fnEditProduct, fnDeleteProduct}) => {

  const table = {
    title: '',
    columns: [
      { field: 'count', headerName: t("table.common.num"), flex: 0.3 },
      {
        field: 'productCode',
        headerName: t("table.common.productCode"),
        flex: 0.6
      },
      {
        field: 'productName',
        headerName: t("table.common.name"),
        flex: 1.5,
      },
      {
        field: 'qtyDesc',
        headerName: t("table.purchaseOrders.column.qty"),
        flex: 0.8,
      },
      {
        field: 'price',
        headerName: t("table.purchaseOrders.column.price"),
        flex: 0.5,
        renderCell: ({row, field})=>{
          return formatNumber(row[field],'',2)
        }
      },
      {
        field: 'subtotal',
        headerName: t("table.purchaseOrders.column.subtotal"),
        flex: 0.5,
        renderCell: ({row, field})=>{
          return formatNumber(row[field],'',2)
        }
      },
      {
        field: 'discountValue',
        headerName: t("table.purchaseOrders.column.discount"),
        flex: 0.5,
        renderCell: ({row, field})=>{
          return formatNumber(row[field],'',2)
        }
      },
      {
        field: 'taxValue',
        headerName: t("table.purchaseOrders.column.tax"),
        flex: 0.5,
        renderCell: ({row, field})=>{
          return formatNumber(row[field],'',2)
        }
      },
      {
        field: 'total',
        headerName: t("table.common.total"),
        flex: 0.5,
        renderCell: ({row, field})=>{
          return formatNumber(row[field],'',2)
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
            onClick={() => fnEditProduct(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label= {t("button.delete")}
            onClick={() => fnDeleteProduct(row)}
            color='error'
          />
        ],
      },
    ],
    data: orderDetail,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  }

  return (
    <TableContainer component={Paper}>
      <XDataGrid {...table}/>
    </TableContainer>
  )
}

export default TableDetail