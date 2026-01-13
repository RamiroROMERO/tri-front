import React from 'react'
import { Box, Button, Card, CardContent, Divider, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material'
import { CheckBox, SearchSelect, SimpleSelect } from 'app/components';
import { InputBox } from 'app/components';
import { usePlacesWidget } from 'react-google-autocomplete';
import envs from 'app/config/envs';

const FormEmployee = ({t, formState, onInputChange, isFormValid, formValidation, sendForm, activeStep, steps, listBanks, listCiaAccount, listClassification, listCustomer, listSector, listStatus, onBulkForm, handleBack, handleNext}) => {

  const {code, ssnItin, name, phone, email, address, dateStarted, customerId, classificationId, sectorId, needCheck, sameNameInCheck, bankId, accountBank, nameInCheck, ciaAccount, noteBank, dni, statusId, firstName, lastName} = formState;

  const {ssnItinValid, nameValid, phoneValid, emailValid, addressValid, dateStartedValid, bankIdValid, ciaAccountValid, statusIdValid} = formValidation;

  const { ref } = usePlacesWidget({
    apiKey: envs.keyGoogle,
    options: {
      types: ["geocode", "establishment"],
      componentRestrictions: { country: "us" },
    },
    onPlaceSelected: (place) =>{
      onBulkForm({address: place.formatted_address});
    }
  });

  return (
    <>
    <Card>
      <CardContent>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => {
              return (
                <Step key={label}>
                  <StepLabel>{t(label)}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <Divider sx={{marginTop: 2}}/>
          <React.Fragment>
            {activeStep === 0?
              <Grid container spacing={3} marginTop={1} direction='row'>
                <Grid item xs={12} sm={5} md={2}>
                  <InputBox
                    label={t('input.code')}
                    name='code'
                    value={code}
                    onChange={onInputChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={7} md={4}>
                  <InputBox
                    label={t('table.employees.ssnItin')}
                    name='ssnItin'
                    value={ssnItin}
                    onChange={onInputChange}
                    error={(sendForm&&ssnItinValid)?true:false}
                    helperText={(sendForm &&!isFormValid)&&ssnItinValid}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputBox
                    label={t('input.firstName')}
                    name='firstName'
                    value={firstName}
                    onChange={onInputChange}
                    error={(sendForm&&nameValid)?true:false}
                    helperText={(sendForm &&!isFormValid)&&nameValid}
                    required
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputBox
                    label={t('input.lastName')}
                    name='lastName'
                    value={lastName}
                    onChange={onInputChange}
                    error={(sendForm&&nameValid)?true:false}
                    helperText={(sendForm &&!isFormValid)&&nameValid}
                    required
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <InputBox
                    label={t('input.fullName')}
                    name='name'
                    value={name}
                    onChange={onInputChange}
                    error={(sendForm&&nameValid)?true:false}
                    helperText={(sendForm &&!isFormValid)&&nameValid}
                    required
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={4}>
                  <InputBox
                    label={t('table.employees.phone')}
                    name='phone'
                    value={phone}
                    onChange={onInputChange}
                    error={(sendForm&&phoneValid)?true:false}
                    helperText={(sendForm &&!isFormValid)&&phoneValid}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={4}>
                  <InputBox
                    label={t('table.employees.email')}
                    name='email'
                    value={email}
                    onChange={onInputChange}
                    error={(sendForm&&emailValid)?true:false}
                    helperText={(sendForm &&!isFormValid)&&emailValid}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={7} md={8}>
                  <InputBox
                    label={t('table.employees.address')}
                    name='address'
                    value={address}
                    onChange={onInputChange}
                    error={(sendForm&&addressValid)?true:false}
                    helperText={(sendForm &&!isFormValid)&&addressValid}
                    required
                    inputRef={ref}
                  />
                </Grid>
              </Grid>
            : activeStep === 1 ?
              <Grid container spacing={3} marginTop={1} direction='row'>
                <Grid item xs={12} sm={5} md={4}>
                  <InputBox
                    label={t("table.employees.dateStarted")}
                    name="dateStarted"
                    value={dateStarted}
                    onChange={onInputChange}
                    type="date"
                    error={(sendForm&&dateStartedValid)?true:false}
                    helperText={(sendForm &&!isFormValid)&&dateStartedValid}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={7} md={8}>
                  <SearchSelect
                    label={t("table.employees.customerId")}
                    name="customerId"
                    value={customerId}
                    onChange={onInputChange}
                    optionList={listCustomer}
                    required
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SearchSelect
                    label={t("table.employees.classificationId")}
                    name="classificationId"
                    value={classificationId}
                    onChange={onInputChange}
                    optionList={listClassification}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SearchSelect
                    label={t("table.employees.column.homeLocation")}
                    name="sectorId"
                    value={sectorId}
                    onChange={onInputChange}
                    optionList={listSector}
                  />
                </Grid>
              </Grid>
            : activeStep === 2 ?
              <Grid container spacing={3} marginTop={1} direction='row'>
                <Grid item xs={12} sm={5} md={4}>
                  <CheckBox
                    label={t("table.employees.needCheck")}
                    name="needCheck"
                    checked={needCheck}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={4}>
                  <CheckBox
                    label={t("table.employees.sameNameInCheck")}
                    name="sameNameInCheck"
                    checked={sameNameInCheck}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={5}>
                  <SearchSelect
                    label={t("table.employees.bankId")}
                    name="bankId"
                    value={bankId}
                    onChange={onInputChange}
                    optionList={listBanks}
                    error={(sendForm&&bankIdValid)?true:false}
                    helperText={(sendForm &&!isFormValid)&&bankIdValid}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputBox
                    label={t("table.employees.bankAccount")}
                    name="accountBank"
                    value={accountBank}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputBox
                    label={t("table.employees.nameInCheck")}
                    name="nameInCheck"
                    value={nameInCheck}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SimpleSelect
                    label={t("table.employees.ciaAccount")}
                    name="ciaAccount"
                    value={ciaAccount}
                    onChange={onInputChange}
                    optionList={listCiaAccount}
                    error={(sendForm&&ciaAccountValid)?true:false}
                    helperText={(sendForm &&!isFormValid)&&ciaAccountValid}
                    required
                    disabled
                  />
                </Grid>
              </Grid>
            :
              <Grid container spacing={3} marginTop={1} direction='row'>
                <Grid item xs={3} sm={4}>
                  <SimpleSelect
                    label={t("table.employees.status")}
                    name="statusId"
                    value={statusId}
                    onChange={onInputChange}
                    optionList={listStatus}
                    error={(sendForm&&statusIdValid)?true:false}
                    helperText={(sendForm &&!isFormValid)&&statusIdValid}
                    required
                    disabled
                  />
                </Grid>
              </Grid>
            }
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color='secondary'
                variant='contained'
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                {t('button.back')}
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} color='primary' variant='contained'>
                {activeStep === steps.length - 1 ? t('button.save') : t('button.next')}
              </Button>
            </Box>
          </React.Fragment>
        </Box>
      </CardContent>
    </Card>
    </>
  )
}

export default FormEmployee;