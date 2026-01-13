import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent } from '@mui/material'
import { Clear, ExitToApp, Save } from '@mui/icons-material'
import { XDataGrid } from 'app/components/XDataGrid';
import { SearchSelect } from 'app/components/SearchSelect';
import { CheckBox } from 'app/components/Checkbox';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { InputBox } from 'app/components/InputBox';
import { useQuickbookCustomer } from './useQuickbookCustomer';

export const ModalQuickbookCustomer = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, currentItem, listCompanyQuickbook} = data;
  const customerName = currentItem.name?currentItem.name:'';
  const customerId = currentItem?.id || 0;

  const {table, formState, formValidation, isFormValid, sendForm, listCustomerQuickbook, onInputChange, onQuickbookCompanyChange, fnSave, fnNewDocto, openMsgDelete, setOpenMsgDelete, fnOkDelete} = useQuickbookCustomer({t, sweetAlerts, setLoading, customerId});

  const {quickbookCompanyId, quickbookCustomerId, status} = formState;

  const {quickbookCompanyIdValid, quickbookCustomerIdValid} = formValidation;

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
          <Grid container spacing={3} direction={'row'}>
            <Grid item xs={12} md={6}>
              <InputBox
                label={t('table.common.customer')}
                name='customerName'
                value={customerName}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SearchSelect
                label={t("table.common.quickBookCompany")}
                name="quickbookCompanyId"
                value={quickbookCompanyId}
                onChange={onQuickbookCompanyChange}
                optionList={listCompanyQuickbook}
                error={(sendForm&&quickbookCompanyIdValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&quickbookCompanyIdValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SearchSelect
                label={t("table.common.quickBookCustomer")}
                name="quickbookCustomerId"
                value={quickbookCustomerId}
                onChange={onInputChange}
                optionList={listCustomerQuickbook}
                error={(sendForm&&quickbookCustomerIdValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&quickbookCustomerIdValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CheckBox
                label={t("modal.input.checkbox.status")}
                name="status"
                checked={status}
                onChange={onInputChange}
              />
            </Grid>
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
    </DialogActions>
    <ModalConfirm {...propsToModalConfirm}/>
  </>
  )
}