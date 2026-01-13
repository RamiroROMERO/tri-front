import React, { useState, useEffect } from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography, Card, CardContent } from '@mui/material'
import { ExitToApp } from '@mui/icons-material';
import { XDataGrid } from 'app/components/XDataGrid';
import { request } from 'app/utils/core';

export const ModalViewRates = ({setOpen, data, t}) => {
  const {dataEmployee, dataCustomer, setLoading} = data;
  const customerId = dataCustomer.customerId?dataCustomer.customerId:dataCustomer.id;
  const customerName = dataCustomer.customer?dataCustomer.customer.name:dataCustomer.name;
  const code=  dataEmployee.code
  const name = dataEmployee.name;
  const employeeId = dataEmployee.id;
  const [tableData, setTableData] = useState([]);

  const [table, setTable] = useState({
    title: '',
      columns: [
        {field: 'date', headerName: t('table.common.date'), flex: 0.8},
        {field: 'newPayrollRate', headerName: t('table.activeEmployees.column.payRate'), flex: 0.5, type:'number'},
        {field: 'newPayrollRateOvertime', headerName: t('table.payrolls.column.overtimeRate'), flex: 0.5, type:'number'},
        {field: 'newInvoiceRate', headerName: t('table.employees.column.rateInvoice'), flex: 0.5, type:'number'},
        {field: 'newInvoiceRateOvertime', headerName: t('table.employees.column.rateInvoiceOvertime'), flex: 0.5, type:'number'},
      ],
      data: [],
      options: {
        pageSize: 10,
        rowsPerPageOptions: [10, 20, 30, 50]
      }
  });

  useEffect(()=>{
    setLoading(true);
    request.GET(`/employeeRates?employeeId=${employeeId}&customerId=${customerId}`, (resp)=>{
      setTableData(resp.data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  },[]);

  useEffect(()=>{
    setTable({...table, data: tableData});
  },[tableData]);

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12} sm={6}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.employee')}</Typography>
                  <Typography variant={"h5"} mb={1.25}>{`${code} | ${name}`}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.customer')}</Typography>
                  <Typography variant={"h5"} mb={1.25}>{customerName}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12}>
                  <XDataGrid {...table}/>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
    </DialogActions>
  </>
  )
}