import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Tabs, Tab, Divider } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { useForm } from 'app/hooks';
import { useState } from 'react';
import { CheckBox, InputBox, SimpleSelect, TabPanel, XDatePicker } from 'app/components';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const ModalEditEmployee = ({ setOpen, data, t }) => {

  const formValidations = {
    firstName: [(val) => val.length >= 3, t('alertMessages.warning.employees.nameValid')],
    lastName: [(val) => val.length >= 3, t('alertMessages.warning.employees.nameValid')],
    name: [(val) => val.length > 5, t('alertMessages.warning.employees.nameValid')],
    classificationId: [(val) => validInt(val) > 0, t('alertMessages.warning.employees.classificationId')],
    dateStarted: [(val) => val.length >= 10, t('alertMessages.warning.employees.dateValid')],
    statusId: [(val) => validInt(val) > 0, t('alertMessages.warning.employees.statusValid')],
    ciaAccount: [(val) => val.length > 0, t('alertMessages.warning.employees.ciaAccountValid')]
  };

  const [sendForm, setSendForm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const paymentDeliveryList = [{
    value: 0,
    label: 'Seleccione...'
  }, {
    value: 1,
    label: 'Entregar'
  }, {
    value: 2,
    label: 'Depositar'
  }]

  const { classificationList, sectorList, statusList, bankList, customerList, ciaAccountList, selectedRecord, setLoading, sweetAlerts, onRefreshData } = data;

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    id: selectedRecord.id || 0,
    code: selectedRecord.code || '',
    firstName: selectedRecord.firstName || '',
    lastName: selectedRecord.lastName || '',
    name: selectedRecord.name || '',
    classificationId: selectedRecord.classificationId || 0,
    sectorId: selectedRecord.sectorId || 0,
    address: selectedRecord.address || '',
    dateStarted: selectedRecord.dateStarted || '',
    statusId: selectedRecord.statusId || 0,
    customerId: selectedRecord.customerId || 0,
    bankId: selectedRecord.bankId || 0,
    accountBank: selectedRecord.accountBank || '',
    needCheck: selectedRecord.needCheck || false,
    nameInCheck: selectedRecord.nameInCheck || '',
    originalNameInCheck: selectedRecord.originalNameInCheck || false,
    paymentDeliveryType: selectedRecord.paymentDeliveryType || 0,
    noteBank: selectedRecord.noteBank || '',
    ciaAccount: selectedRecord.ciaAccount || '',
    noPayment: selectedRecord.noPayment || false,
    pernr: selectedRecord.pernr || '',
    bothCompanies: selectedRecord?.bothCompanies || 0
  }, formValidations);

  const { code, firstName, lastName, name, classificationId, sectorId, address, dateStarted, statusId, customerId, bankId, accountBank, needCheck, nameInCheck, originalNameInCheck, noteBank, ciaAccount, paymentDeliveryType, noPayment, pernr, bothCompanies } = formState;
  const { firstNameValid, lastNameValid, nameValid, classificationIdValid, dateStartedValid, statusIdValid, ciaAccountValid } = formValidation;

  const onChangeSelectedTab = (e, newValue) => {
    setActiveTab(newValue);
  };

  const fnSave = () => {
    setSendForm(true);
    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return
    };

    request.PUT('/employees', formState, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setSendForm(false);
      setOpen(false);
      setLoading(false);
      if (onRefreshData) onRefreshData();
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    })
  };

  const fnUpdateNoPaymentInPayroll = () => {
    const updateData = {
      noPayment,
      employeeId: formState.id || 0
    };
    request.PUT('/weeklyPayrollsDetails/updateCurrentNoPayment', updateData, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    }, err => {
      console.error(err);
      setLoading(false);
    });
  }

  return (
    <>
      <DialogContent dividers>
        <Tabs value={activeTab} onChange={onChangeSelectedTab} >
          <Tab label={t("modal.employees.detail.tab.generalInfo")} id="tab-simple-0" />
          <Tab label={t("modal.employees.detail.tab.bankInfo")} id="tab-simple-1" />
          <Tab label={t("modal.employees.detail.tab.others")} id="tab-simple-2" />
        </Tabs>
        <Divider />
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3} direction={'row'}>
            <Grid item xs={12} sm={4}>
              <InputBox
                label={t('table.employees.column.code')}
                name='code'
                value={code}
                onChange={onInputChange}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputBox
                label={t('input.firstName')}
                name='firstName'
                value={firstName}
                onChange={onInputChange}
                error={(sendForm && firstNameValid) ? true : false}
                helperText={(sendForm && !isFormValid) && firstNameValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputBox
                label={t('input.lastName')}
                name='lastName'
                value={lastName}
                onChange={onInputChange}
                error={(sendForm && lastNameValid) ? true : false}
                helperText={(sendForm && !isFormValid) && lastNameValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={8}>
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
          </Grid>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Grid container spacing={3} direction={"row"}>
            <Grid item xs={12} sm={6}>
              <SimpleSelect
                label={t('table.common.classifications')}
                name='classificationId'
                value={classificationId}
                onChange={onInputChange}
                optionList={classificationList}
                error={(sendForm && classificationIdValid) ? true : false}
                helperText={(sendForm && !isFormValid) && classificationIdValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SimpleSelect
                label={t('table.employees.column.homeLocation')}
                name='sectorId'
                value={sectorId}
                onChange={onInputChange}
                optionList={sectorList}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SimpleSelect
                label={t('table.employees.column.status')}
                name='statusId'
                value={statusId}
                onChange={onInputChange}
                optionList={statusList}
                error={(sendForm && statusIdValid) ? true : false}
                helperText={(sendForm && !isFormValid) && statusIdValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <XDatePicker
                label={t('table.dailiesPayrolls.column.dateStarted')}
                name='dateStarted'
                value={dateStarted}
                onChange={onInputChange}
                error={(sendForm && dateStartedValid) ? true : false}
                helperText={(sendForm && !isFormValid) && dateStartedValid}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <InputBox
                label={t('table.employees.column.address')}
                name='address'
                value={address}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <SimpleSelect
                label={t('dialog.employees.customerDefault')}
                name='customerId'
                value={customerId}
                onChange={onInputChange}
                optionList={customerList}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputBox
                label={t('table.employees.column.pernr')}
                name='pernr'
                value={pernr}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CheckBox
                label={t("modal.input.checkbox.bothCompanies")}
                name="bothCompanies"
                checked={bothCompanies}
                onChange={onInputChange}
              />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3} direction={"row"}>
            <Grid item xs={12} sm={6}>
              <SimpleSelect
                label={t('table.employees.column.bankName')}
                name='bankId'
                value={bankId}
                onChange={onInputChange}
                optionList={bankList}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputBox
                label={t('table.employees.column.accountBank')}
                name='accountBank'
                value={accountBank}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CheckBox
                label={t("table.employees.column.needCheck")}
                name="needCheck"
                checked={needCheck}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputBox
                label={t('table.employees.column.nameInCheck')}
                name='nameInCheck'
                value={nameInCheck}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CheckBox
                label={t("table.employees.column.originalNameInCheck")}
                name="originalNameInCheck"
                checked={originalNameInCheck}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SimpleSelect
                label={t('table.employees.column.paymentDeliveryType')}
                name='paymentDeliveryType'
                value={paymentDeliveryType}
                onChange={onInputChange}
                optionList={paymentDeliveryList}
              // error={(sendForm&&classificationIdValid)?true:false}
              // helperText={(sendForm &&!isFormValid)&&classificationIdValid}
              // required
              />
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Grid container spacing={3} direction={"row"}>
            <Grid item xs={12} sm={7}>
              <SimpleSelect
                label={t('table.employees.column.ciaAccount')}
                name='ciaAccount'
                value={ciaAccount}
                onChange={onInputChange}
                optionList={ciaAccountList}
                error={(sendForm && ciaAccountValid) ? true : false}
                helperText={(sendForm && !isFormValid) && ciaAccountValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <InputBox
                label={t('table.employees.column.notesBank')}
                name='noteBank'
                value={noteBank}
                onChange={onInputChange}
              />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3} direction='row'>
            <Grid item xs={12} md={6} lg={4}>
              <CheckBox
                label={t("modal.payroll.detail.checkNoPayment")}
                name="noPayment"
                checked={noPayment}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button color='success' variant='contained' onClick={fnUpdateNoPaymentInPayroll}> {t('modal.employees.detail.button.updateCurrentPayroll')} </Button>
            </Grid>
          </Grid>
        </TabPanel>
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