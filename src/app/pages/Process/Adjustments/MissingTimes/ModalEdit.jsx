import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { InputBox, CheckBox } from 'app/components';
import { useModalEdit } from './useModalEdit';

export const ModalEdit = ({setOpen, data, t}) => {
  const {currentItem, setLoading, sweetAlerts, fnGetData, screenControl} = data;

  const {formState, formValidation, isFormValid, sendForm, onInputChange, fnSaveDocto} = useModalEdit({t, currentItem, setLoading, sweetAlerts, fnGetData, setOpen, screenControl});

  const {qty, pricePayroll, priceInvoice, totalPayroll, totalInvoice, inInvoice, inCheck} = formState;

  const {qtyValid, totalInvoiceValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={4} md={3}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.projects.column.no_week')}</Typography>
          <Typography variant={"h5"} mb={0}>{currentItem?.weekYear || ''}</Typography>
        </Grid>
        <Grid item xs={12} sm={8} md={4}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.employee')}</Typography>
          <Typography variant={"h5"} mb={0}>{currentItem?.name || ''}</Typography>
        </Grid>
        <Grid item xs={12} sm={7} md={5}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.projects.column.name')}</Typography>
          <Typography variant={"h5"} mb={0}>{currentItem?.project || ''}</Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={3}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.categories.column.type')}</Typography>
          <Typography variant={"h5"} mb={0}>{currentItem?.type || ''}</Typography>
        </Grid>
        <Grid item xs={4} sm={3} md={2}>
          <InputBox
            label={t("table.missingtime.textField.hours")}
            name="qty"
            value={qty}
            onChange={onInputChange}
            error={(sendForm&&qtyValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&qtyValid}
            type='number'
            required
          />
        </Grid>
        <Grid item xs={4} sm={3} md={2}>
          <InputBox
            label={t("table.missingtime.textField.payRate")}
            name="pricePayroll"
            value={pricePayroll}
            onChange={onInputChange}
            type='number'
          />
        </Grid>
        <Grid item xs={4} sm={3} md={2}>
          <InputBox
            label={t("table.missingtime.textField.invoiceRate")}
            name="priceInvoice"
            value={priceInvoice}
            onChange={onInputChange}
            type='number'
          />
        </Grid>
        <Grid item xs={4} sm={3} md={3}>
          <InputBox
            label={t("table.missingtime.textField.payTotal")}
            name="totalPayroll"
            value={totalPayroll}
            onChange={onInputChange}
            type='number'
            disabled
          />
        </Grid>
        <Grid item xs={4} sm={3} md={3}>
          <InputBox
            label={t("table.missingtime.textField.invoiceTotal")}
            name="totalInvoice"
            value={totalInvoice}
            onChange={onInputChange}
            error={(sendForm&&totalInvoiceValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&totalInvoiceValid}
            type='number'
            required
            disabled
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <CheckBox
            label={t("table.missingtime.checkBox.inInvoice")}
            name="inInvoice"
            checked={inInvoice}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <CheckBox
            label={t("table.missingtime.checkBox.inCheck")}
            name="inCheck"
            checked={inCheck}
            onChange={onInputChange}
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
      <Button startIcon={<Save />} onClick={fnSaveDocto} color='primary' variant='contained'>
        {t('button.save')}
      </Button>
    </DialogActions>
  </>
  )
}