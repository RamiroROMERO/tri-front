import React, { useEffect } from 'react'
import { DialogActions, DialogContent, Button, Grid, Autocomplete, TextField } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { CheckBox, InputBox, SearchSelect, XDatePicker } from 'app/components';
import { useForm } from 'app/hooks';
import { validInt } from 'app/utils/helpers';
import { useState } from 'react';
import { request } from 'app/utils/core';
import moment from 'moment';

export const ModalNewEmployee = ({ setOpen, data, t }) => {

  const { sectorList, classificationList, setLoading, sweetAlerts, onRefreshData, listEmployees = [], projectId = 0, customerId = 0, screenControl } = data;
  const { optCreate, optUpdate } = screenControl;
  const [sendForm, setSendForm] = useState(false);
  const [nameEmployee, setNameEmployee] = useState('');

  const formValidations = {
    "firstName": [(val) => val.length >= 3, t("alertMessages.warning.employees.nameValid")],
    "lastName": [(val) => val.length >= 3, t("alertMessages.warning.employees.nameValid")],
    "name": [(val) => val.length > 5, t("alertMessages.warning.employees.nameValid")],
    "classificationId": [(val) => validInt(val) > 0, t("alertMessages.warning.classification")],
    "dateStarted": [val => val !== "", t("alertMessages.warning.employees.dateValid")]
  };

  const { formState, formValidation, isFormValid, onInputChange } = useForm({
    id: 0,
    code: '',
    firstName: '',
    lastName: '',
    name: '',
    classificationId: 8,
    sectorId: 0,
    address: "",
    dateStarted: moment(new Date()).format("YYYY-MM-DD"),
    status: true,
    noPayment: false,
    pernr: '',
    bothCompanies: 0
  }, formValidations);

  const { code, firstName, lastName, name, classificationId, sectorId, address, dateStarted, noPayment, pernr, bothCompanies } = formState;
  const { nameValid, firstNameValid, lastNameValid, classificationIdValid, dateStartedValid } = formValidation;

  const onNameEmployeeChange = e => {
    setNameEmployee(e.target.value);
  }

  useEffect(() => {
    onInputChange({ target: { name: 'name', value: `${firstName} ${lastName}` } });
  }, [firstName, lastName])

  useEffect(() => {
    setNameEmployee(name);
  }, [name])

  const fnSave = () => {

    if (optCreate === 0) {
      sweetAlerts('error', t("alertMessages.warning.unauthorizedUser"));
      return;
    }

    if (validInt(projectId) === 0) {
      setSendForm(true);
      if (!isFormValid) {
        sweetAlerts('error', t("alertMessages.warning.missingData"));
        return;
      }
    }

    const newData = {
      code,
      customerId,
      name: validInt(projectId) > 0 ? nameEmployee : name,
      firstName,
      lastName,
      classificationId: classificationId === 0 ? 8 : classificationId,
      sectorId,
      address,
      dateStarted,
      noPayment,
      ciaAccount: 'CSS',
      pernr,
      bothCompanies
    };

    if (validInt(projectId) > 0 && nameEmployee === "") {
      sweetAlerts('error', t("alertMessages.warning.employeeId"));
      return;
    }
    if (validInt(projectId) > 0 && classificationId === 0) {
      sweetAlerts('error', t("alertMessages.warning.classification"));
      return;
    }

    request.POST('/employees', newData, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }

      if (validInt(projectId) > 0) {
        const idEmployee = resp.newRecord.id;

        const newEmployee = {
          projectId: projectId,
          employeeId: idEmployee
        }

        setLoading(true);
        request.POST('/weeklyPayrolls', newEmployee, resp => {
          const { messages } = resp;
          if (messages?.length > 0) {
            messages.map(elem => {
              sweetAlerts(elem.type, t(elem.message));
            });
          }

          onRefreshData();
          setSendForm(false);
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
      } else {
        setSendForm(false);
        setOpen(false);
        if (onRefreshData) onRefreshData();
      }

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

  };

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction='row'>
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
            />
          </Grid>
          <Grid item xs={12} sm={8} style={{ display: projectId > 0 ? 'none' : 'block' }}>
            <InputBox
              label={t('input.fullName')}
              name='name'
              value={name}
              onChange={onInputChange}
              error={(sendForm && nameValid) ? true : false}
              helperText={(sendForm && !isFormValid) && nameValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SearchSelect
              label={t("table.employees.column.homeLocation")}
              name="sectorId"
              value={sectorId}
              onChange={onInputChange}
              optionList={sectorList}
            />
          </Grid>
          <Grid item xs={12} sm={8} style={{ display: projectId > 0 ? 'block' : 'none' }}>
            <Autocomplete
              id="combo-box-employees"
              freeSolo
              options={listEmployees}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setNameEmployee(newValue?.name2 ? newValue.name2 : "");
              }}
              inputValue={nameEmployee}
              renderInput={(params) =>
                <TextField {...params}
                  value={nameEmployee}
                  onChange={onNameEmployeeChange}
                  name="nameEmployee"
                  id="nameEmployee"
                  label={t("table.common.name")}
                  variant='standard'
                />
              }
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <SearchSelect
              label={t("table.common.classifications")}
              name="classificationId"
              value={classificationId}
              onChange={onInputChange}
              optionList={classificationList}
              error={(sendForm && classificationIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && classificationIdValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
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

          <Grid item xs={12} sm={12}>
            <InputBox
              label={t('table.employees.column.address')}
              name='address'
              value={address}
              onChange={onInputChange}
            />
          </Grid>

        </Grid>
        <Grid container spaccing={3} direction='row' sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <InputBox
              label={t('table.employees.column.pernr')}
              name='pernr'
              value={pernr}
              onChange={onInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3} sx={{ ml: 3 }}>
            <CheckBox
              label={t("modal.payroll.detail.checkNoPayment")}
              name="noPayment"
              checked={noPayment}
              onChange={onInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CheckBox
              label={t("modal.input.checkbox.bothCompanies")}
              name="bothCompanies"
              checked={bothCompanies}
              onChange={onInputChange}
            />
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