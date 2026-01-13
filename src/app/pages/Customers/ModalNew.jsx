import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { ContainerWithLabel } from 'app/components/ContainerWithLabel';
import { InputBox } from 'app/components/InputBox';
import { CheckBox } from 'app/components/Checkbox';
import { RadioButtonsGroup } from 'app/components/RadioButtonsGroup';
import useModalNew from './useModalNew';

export const ModalNew = ({ setOpen, data, t }) => {

  const { sweetAlerts, setLoading, fnGetData, currentItem, screenControl } = data;
  const { formState, isFormValid, formValidation, sendForm, onInputChange, fnSave } = useModalNew({ t, sweetAlerts, setLoading, fnGetData, currentItem, setOpen, screenControl });

  const { name, phone, email, address, maxReghoursPayroll, maxReghoursInvoice, active, perDiemPayroll, perDiemInvoice, discountPercent, globalDeduction, invoiceType, invoiceLineDescription, invoicePerdiemType, messageInCheck, contractNumber, perdiemAdjustPercent, bothCompanies } = formState;

  const { nameValid } = formValidation;

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} sm={6}>
            <ContainerWithLabel label={t("dialog.customers.title.generalInfo")}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12}>
                  <InputBox
                    label={t('table.common.name')}
                    name='name'
                    value={name}
                    onChange={onInputChange}
                    error={(sendForm && nameValid) ? true : false}
                    helperText={(sendForm && !isFormValid) && nameValid}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <InputBox
                    label={t('table.common.phone')}
                    name='phone'
                    value={phone}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={7}>
                  <InputBox
                    label={t('table.common.email')}
                    name='email'
                    value={email}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputBox
                    label={t('table.customers.column.address')}
                    name='address'
                    value={address}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputBox
                    label={t('table.common.maxRegHoursPayroll')}
                    name='maxReghoursPayroll'
                    value={maxReghoursPayroll}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputBox
                    label={t('table.common.maxRegHoursInvoice')}
                    name='maxReghoursInvoice'
                    value={maxReghoursInvoice}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputBox
                    label={t('table.common.contractNumber')}
                    name='contractNumber'
                    value={contractNumber}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CheckBox
                    label={t("modal.input.checkbox.status")}
                    name="active"
                    checked={active}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CheckBox
                    label={t("modal.input.checkbox.bothCompanies")}
                    name="bothCompanies"
                    checked={bothCompanies}
                    onChange={onInputChange}
                  />
                </Grid>
              </Grid>
            </ContainerWithLabel>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ContainerWithLabel label={t("pages.settings")}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12} sm={6}>
                  <InputBox
                    label={t('table.common.payrollPerDiem')}
                    name='perDiemPayroll'
                    value={perDiemPayroll}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputBox
                    label={t('table.common.invoicePerDiem')}
                    name='perDiemInvoice'
                    value={perDiemInvoice}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputBox
                    label={t('table.common.discountPercent')}
                    name='discountPercent'
                    value={discountPercent}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputBox
                    label={t('table.common.globalDeduction')}
                    name='globalDeduction'
                    value={globalDeduction}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RadioButtonsGroup
                    label={t('dialog.customers.invoicePerdiemType')}
                    name='invoicePerdiemType'
                    value={invoicePerdiemType}
                    onChange={onInputChange}
                    row
                    options={[
                      { id: 1, name: t('dialog.customers.invoicePerdiemTypeVal1') },
                      { id: 2, name: t('dialog.customers.invoicePerdiemTypeVal2') },
                      { id: 3, name: t('dialog.customers.invoicePerdiemTypeVal3') }
                    ]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputBox
                    label={t('dialog.customers.perdiemAdjustPercent')}
                    name='perdiemAdjustPercent'
                    value={perdiemAdjustPercent}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RadioButtonsGroup
                    label={t('dialog.customers.invoiceType')}
                    name='invoiceType'
                    value={invoiceType}
                    onChange={onInputChange}
                    row
                    options={[
                      { id: 1, name: t('dialog.customers.invoiceTypeVal1') },
                      { id: 2, name: t('dialog.customers.invoiceTypeVal2') }
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RadioButtonsGroup
                    label={t('dialog.customers.invoiceLineDescription')}
                    name='invoiceLineDescription'
                    value={invoiceLineDescription}
                    onChange={onInputChange}
                    row
                    options={[
                      { id: 1, name: t('dialog.customers.invoiceLineDescriptionVal1') },
                      { id: 2, name: t('dialog.customers.invoiceLineDescriptionVal2') }
                    ]}
                  />
                </Grid>
              </Grid>
            </ContainerWithLabel>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
          {t('button.save')}
        </Button>
      </DialogActions>
    </>
  )
}