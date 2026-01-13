import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent } from '@mui/material'
import { Clear, ExitToApp, Save } from '@mui/icons-material'
import { InputBox } from 'app/components/InputBox';
import { SearchSelect } from 'app/components/SearchSelect';
import { ContainerWithLabel } from 'app/components/ContainerWithLabel';
import { XDataGrid } from 'app/components/XDataGrid';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { useModalClassifications } from './useModalClassifications';

export const ModalClassifications = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, currentItem, listClassifications} = data;
  const customerName = currentItem?.name||'';
  const customerId = currentItem?.id || 0;

  const {table, formState, formValidation, isFormValid, sendForm, openMsgDelete, setOpenMsgDelete, onInputChange, onPercOtPayrollChange, onPercOtInvoiceChange, fnSave, fnNewDocto, fnOkDelete} = useModalClassifications({t, sweetAlerts, setLoading, customerId});

  const {classificationId, ratePayroll, percOtPayroll, rateOtPayroll, rateInvoice, percOtInvoice, rateOtInvoice} = formState;

  const {classificationIdValid, ratePayrollValid, rateInvoiceValid} = formValidation;

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDelete
  }

  return (
  <>
    <DialogContent dividers>
      <Card sx={{mb: 2}}>
        <CardContent>
          <Grid container spacing={3} direction='row'>
            <Grid item xs={12} sm={6}>
              <InputBox
                label={t('table.common.customer')}
                name='customerName'
                value={customerName}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SearchSelect
                label={t("table.employees.classificationId")}
                name="classificationId"
                value={classificationId}
                onChange={onInputChange}
                optionList={listClassifications}
                error={(sendForm&&classificationIdValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&classificationIdValid}
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} direction='row' sx={{mt: 1}}>
            <Grid item xs={12} sm={12}>
              <ContainerWithLabel label={t("dialog.classifications.title.payroll")}>
                <Grid container spacing={3} direction='row'>
                  <Grid item xs={12} sm={4}>
                    <InputBox
                      label={t('table.activeEmployees.column.rate')}
                      name='ratePayroll'
                      value={ratePayroll}
                      onChange={onInputChange}
                      error={(sendForm&&ratePayrollValid)?true:false}
                      helperText={(sendForm &&!isFormValid)&&ratePayrollValid}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputBox
                      label={t('table.activeEmployees.column.percentOT')}
                      name='percOtPayroll'
                      value={percOtPayroll}
                      onChange={onPercOtPayrollChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputBox
                      label={t('table.payrolls.column.overtimeRate')}
                      name='rateOtPayroll'
                      value={rateOtPayroll}
                      onChange={onInputChange}
                    />
                  </Grid>
                </Grid>
              </ContainerWithLabel>
            </Grid>
          </Grid>
          <Grid container spacing={3} direction='row'>
            <Grid item xs={12} sm={12}>
              <ContainerWithLabel label={t("dialog.classifications.title.invoice")}>
                <Grid container spacing={3} direction='row'>
                  <Grid item xs={12} sm={4}>
                    <InputBox
                      label={t('table.activeEmployees.column.rate')}
                      name='rateInvoice'
                      value={rateInvoice}
                      onChange={onInputChange}
                      error={(sendForm&&rateInvoiceValid)?true:false}
                      helperText={(sendForm &&!isFormValid)&&rateInvoiceValid}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputBox
                      label={t('table.activeEmployees.column.percentOT')}
                      name='percOtInvoice'
                      value={percOtInvoice}
                      onChange={onPercOtInvoiceChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputBox
                      label={t('table.payrolls.column.overtimeRate')}
                      name='rateOtInvoice'
                      value={rateOtInvoice}
                      onChange={onInputChange}
                    />
                  </Grid>
                </Grid>
              </ContainerWithLabel>
            </Grid>
          </Grid>
          <Grid container spacing={3} direction='row'>
            <Grid item xs={12} textAlign={'right'}>
              <Button sx={{marginRight: '10px'}} startIcon={<Clear />} onClick={fnNewDocto} color='secondary' variant='contained'>
                {t("button.clear")}
              </Button>
              <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
                {t("button.save")}
              </Button>
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
      <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
        {t('button.save')}
      </Button>
    </DialogActions>
    <ModalConfirm {...propsToModalConfirm}/>
  </>
  )
}