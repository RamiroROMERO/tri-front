import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { CheckBox, ContainerWithLabel, InputBox, SearchSelect, SimpleSelect } from 'app/components';
import { useModalNew } from './useModalNew';

export const ModalNew = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, fnGetProjects, fnGetListCustomers, currentItem, customerId, listCustomers, listStatus, listLocations, screenControl} = data;

  const {formState, formValidation, isFormValid, sendForm, showCustomerCode, onInputChange, fnSave} = useModalNew({t, sweetAlerts, setLoading, fnGetProjects, fnGetListCustomers, customerId, setOpen, currentItem, screenControl});

  const {name, code, customerCode, locationId, description, descInInvoice, statusId, groupPerdiem, rate, rateOvertime, rateInvoice, rateInvoiceOvertime} = formState;

  const {nameValid, codeValid, locationIdValid, statusIdValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={7}>
          <SearchSelect
            label={t("table.common.customer")}
            name="customerId"
            value={customerId}
            onChange={()=>{}}
            optionList={listCustomers}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={5} style={{display: showCustomerCode}}>
          <InputBox
            label={t('table.projects.column.customerCode')}
            name='customerCode'
            value={customerCode}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <InputBox
            label={t('table.projects.column.code')}
            name='code'
            value={code}
            onChange={onInputChange}
            error={(sendForm&&codeValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&codeValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <InputBox
            label={t('table.projects.column.name')}
            name='name'
            value={name}
            onChange={onInputChange}
            error={(sendForm&&nameValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&nameValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <SearchSelect
            label={t("table.projects.column.location")}
            name="locationId"
            value={locationId}
            onChange={onInputChange}
            optionList={listLocations}
            error={(sendForm&&locationIdValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&locationIdValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={7} style={{display: showCustomerCode}}>
          <SimpleSelect
            label={t("table.employees.column.status")}
            name="statusId"
            value={statusId}
            onChange={onInputChange}
            optionList={listStatus}
            error={(sendForm&&statusIdValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&statusIdValid}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.common.description')}
            name='description'
            value={description}
            onChange={onInputChange}
            multiline
            maxRows={3}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CheckBox
            label={t("table.projects2.column.descInInvoice")}
            name="descInInvoice"
            checked={descInInvoice}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CheckBox
            label={t("table.projects2.column.groupPerdiem")}
            name="groupPerdiem"
            checked={groupPerdiem}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <ContainerWithLabel label={t("dialog.rateByProjects.label.rateByProject")}>
            <Grid container spacing={3} direction={'row'}>
              <Grid item xs={12} sm={6}>
                <ContainerWithLabel label={t("dialog.classifications.title.payroll")}>
                  <Grid container spacing={3} direction='row'>
                    <Grid item xs={12} sm={6}>
                      <InputBox
                        label={t('table.activeEmployees.column.rate')}
                        name='rate'
                        value={rate}
                        onChange={onInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputBox
                        label={t('table.payrolls.column.overtimeRate')}
                        name='rateOvertime'
                        value={rateOvertime}
                        onChange={onInputChange}
                      />
                    </Grid>
                  </Grid>
                </ContainerWithLabel>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ContainerWithLabel label={t("dialog.classifications.title.invoice")}>
                  <Grid container spacing={3} direction='row'>
                    <Grid item xs={12} sm={6}>
                      <InputBox
                        label={t('table.activeEmployees.column.rate')}
                        name='rateInvoice'
                        value={rateInvoice}
                        onChange={onInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputBox
                        label={t('table.payrolls.column.overtimeRate')}
                        name='rateInvoiceOvertime'
                        value={rateInvoiceOvertime}
                        onChange={onInputChange}
                      />
                    </Grid>
                  </Grid>
                </ContainerWithLabel>
              </Grid>
            </Grid>
          </ContainerWithLabel>
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
  </>
  )
}