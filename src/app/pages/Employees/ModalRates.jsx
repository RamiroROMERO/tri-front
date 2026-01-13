import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent } from '@mui/material'
import { ExitToApp } from '@mui/icons-material'
import { InputBox } from 'app/components/InputBox';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal } from 'app/components/Modal';
import { useModalRates } from './useModalRates';
import { ModalEditRate } from './ModalEditRate';
import { ModalViewRates } from './ModalViewRates';

export const ModalRates = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, selectedRecord, customerList} = data;
  const employeeId = selectedRecord?.id || 0;
  const employeeName = `${selectedRecord?.code} | ${selectedRecord?.name}` || '';
  const employeeClassification = selectedRecord?.classificationName || '';
  const classificationId = selectedRecord?.classificationId || 0;

  const {table, openModalEditRate, setOpenModalEditRate, openModalViewRates, setOpenModalViewRates, currentItemRate, fnGetData} = useModalRates({t, sweetAlerts, setLoading, employeeId, employeeName});

  const propsToModalEditRates = {
    title: 'dialog.editRates.title',
    DialogContent: ModalEditRate,
    open: openModalEditRate,
    setOpen: setOpenModalEditRate,
    maxWidth: "xs",
    data:{
      sweetAlerts,
      setLoading,
      currentItemRate,
      employeeId,
      classificationId,
      fnGetData,
      customerList
    }
  }

  const propsToModalViewRates = {
    title: 'dialog.employees.viewRates.title',
    DialogContent: ModalViewRates,
    open: openModalViewRates,
    setOpen: setOpenModalViewRates,
    maxWidth: 'sm',
    data: {
      dataEmployee: selectedRecord,
      dataCustomer: currentItemRate,
      setLoading
    }
  };

  return (
  <>
    <DialogContent dividers>
      <Card sx={{mb: 2}}>
        <CardContent>
          <Grid container spacing={3} direction='row'>
            <Grid item xs={12} sm={6} lg={5}>
              <InputBox
                label={t('table.common.employee')}
                name='employeeName'
                value={employeeName}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={5}>
              <InputBox
                label={t('table.common.classifications')}
                name='employeeClassification'
                value={employeeClassification}
                disabled
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
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
    <Modal {...propsToModalEditRates}/>
    <Modal {...propsToModalViewRates}/>
  </>
  )
}