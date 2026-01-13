import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography } from '@mui/material'
import { ExitToApp, ToggleOff } from '@mui/icons-material'
import { XDataGrid } from 'app/components/XDataGrid';
import { request } from 'app/utils/core';

const ModalEmployeesWithoutH = ({ setOpen, data, t }) => {
  const {dataEmployeesWithoutH, weekId, customerId, customerName, weekSelect, setLoading} = data;

  const table = {
    title: '',
    columns: [
      {field: 'employee_id', headerName: t('table.dailiesPayrolls.column.employeeCode'), flex: 0.5 },
      {field: 'name_employee', headerName: t('table.dailiesPayrolls.column.employeeName'), flex: 1 },
      {field: 'name_project', headerName: t('table.common.project'), flex: 1 }
    ],
    data: dataEmployeesWithoutH,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  };

  const fnDisableEmployees = () => {
    const data = {
      weekId,
      customerId
    };

    request.PUT('/payroll/employeesWithoutHours', data, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setOpen(false);
      setLoading(false);
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  }

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} sm={5}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.customer')}</Typography>
            <Typography variant={"h5"} mb={1.25}>{customerName}</Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.select.selectWeek')}</Typography>
            <Typography variant={"h5"} mb={1.25}>{weekSelect}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12}>
            <XDataGrid {...table}/>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<ToggleOff />} onClick={fnDisableEmployees} color='primary' variant='contained'>
          {t('button.disableAll')}
        </Button>
      </DialogActions>
    </>
  )
}

export default ModalEmployeesWithoutH