import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent } from '@mui/material'
import { ExitToApp } from '@mui/icons-material'
import { XDataGrid } from 'app/components/XDataGrid';

export const ModalViewUpdatedRates = ({setOpen, data, t}) => {
  const {dataRatesUpdated} = data;

  const table = {
    title: t('table.rates.title'),
    columns: [
      {field: 'code', headerName: t('table.employees.column.code'), flex: 0.6 },
      {field: 'name', headerName: t('table.employees.column.name'), flex: 1 },
      {field: 'classification', headerName: t('table.common.classifications'), flex: 0.9 },
      {
        field: 'payrollRate', headerName: t('table.activeEmployees.column.payRate'), flex: 0.5, type: 'number'
      },
      {
        field: 'payrollRateOvertime', headerName: t('table.payrolls.column.overtimeRate'), flex: 0.5, type: 'number'
      },
      {
        field: 'invoiceRate', headerName: t('table.employees.column.rateInvoice'), flex: 0.5
      },
      {
        field: 'invoiceRateOvertime', headerName: t('table.employees.column.rateInvoiceOvertime'), flex: 0.5, type: 'number'
      }
    ],
    data: dataRatesUpdated,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  };

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <XDataGrid {...table}/>
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