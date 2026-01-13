import React, { useState } from 'react'
import { Chip, List } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { currencyFormatter } from 'app/utils/helpers';
import { useEffect } from 'react';
import { request } from 'app/utils/core';

export const usePurchases = ({setLoading, sweetAlerts}) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listProjects, setListProjects] = useState([]);

  const fnDetailDocto = ()=>{}

  const table = {
    title: t("table.purchasesByProjects.title"),
    columns: [
      {
        field: 'date',
        headerName: t("table.common.date"),
        flex: 0.5,
      },
      {
        field: 'projectName',
        headerName: t("table.common.project"),
        flex: 1,
      },
      {
        field: 'provider',
        headerName: t("table.common.provider"),
        flex: 1,
      },
      {
        field: 'subtotal',
        headerName: t("table.common.subtotal"),
        flex: 0.7,
        type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'taxes',
        headerName: t("table.common.tax"),
        flex: 0.7,
        type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'total',
        headerName: t("table.common.total"),
        flex: 0.7,
        type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'statusIcon',
        headerName: t("table.common.status"),
        flex: 0.5,
        renderCell: ({ row, field }) => {
          return (<Chip label={row[field]} color={row[field] === "Closed" ? 'success' : 'warning'} variant={"outlined"} />)
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 80,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<List />}
            label={t("button.details")}
            onClick={() => fnDetailDocto(row)}
            color='primary'
          />
        ],
      },
    ],
    data: tableData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  }

  useEffect(()=>{
    setLoading(true);
    request.GET('/inventory/customers?status=1', (resp) => {
      const customers = resp.data.map((item) => {
        return {
          value: item.id,
          label: `${item.code} | ${item.name}`,
        }
      });
      setListCustomers(customers);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/inventory/projects', (resp) => {
      const projects = resp.data.map((item) => {
        return {
          value: item.id,
          label: `${item.code} | ${item.name}`,
          customerId: item.customerId
        }
      });
      setListProjects(projects);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  },[]);

  const propsToFilterSection = {
    t,
    listCustomers,
    listProjects,
    setLoading,
    sweetAlerts
  }

  return (
    {
      table,
      propsToFilterSection
    }
  )
}
