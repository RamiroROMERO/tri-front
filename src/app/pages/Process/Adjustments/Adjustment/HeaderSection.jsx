import React from 'react'
import { Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { ContainerWithLabel, InputBox, SearchSelect, SimpleSelect } from 'app/components';
import { formatNumber, validFloat } from 'app/utils/helpers';
import { Clear, Save } from '@mui/icons-material';
import { useHeaderSection } from './useHeaderSection';

const HeaderSection = ({ t, listYears, listWeeksWorked, listEmployees, listTypeAdjusts, setLoading, sweetAlerts, fnGetData, currentItem, setCurrentItem, screenControl }) => {

  const { formState, formValidation, isFormValid, sendForm, listWeeks, dataPayroll, onInputChange, onEmployeeChange, fnNewDocto, fnSaveDocto } = useHeaderSection({ t, setLoading, listWeeksWorked, currentItem, setCurrentItem, sweetAlerts, fnGetData, screenControl });

  const { noYear, noWeek, employeeId, deductionTypeId, value, description } = formState;

  const { noYearValid, noWeekValid, employeeIdValid, deductionTypeIdValid, valueValid } = formValidation;

  return (
    <Card sx={{ marginBottom: '20px' }}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3} direction='row'>
              <Grid item xs={12} sm={3} md={2}>
                <SimpleSelect
                  label={t("table.common.year")}
                  name="noYear"
                  value={noYear}
                  onChange={onInputChange}
                  optionList={listYears}
                  error={(sendForm && noYearValid) ? true : false}
                  helperText={(sendForm && !isFormValid) && noYearValid}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={9} md={10}>
                <SearchSelect
                  label={t("table.common.week")}
                  name="noWeek"
                  value={noWeek}
                  onChange={onInputChange}
                  optionList={listWeeks}
                  error={(sendForm && noWeekValid) ? true : false}
                  helperText={(sendForm && !isFormValid) && noWeekValid}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <SearchSelect
                  label={t("table.common.employee")}
                  name="employeeId"
                  value={employeeId}
                  onChange={onEmployeeChange}
                  optionList={listEmployees}
                  error={(sendForm && employeeIdValid) ? true : false}
                  helperText={(sendForm && !isFormValid) && employeeIdValid}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={7} md={8}>
                <SimpleSelect
                  label={t("table.common.type")}
                  name="deductionTypeId"
                  value={deductionTypeId}
                  onChange={onInputChange}
                  optionList={listTypeAdjusts}
                  error={(sendForm && deductionTypeIdValid) ? true : false}
                  helperText={(sendForm && !isFormValid) && deductionTypeIdValid}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4}>
                <InputBox
                  label={t("table.common.value")}
                  name="value"
                  value={value}
                  onChange={onInputChange}
                  error={(sendForm && valueValid) ? true : false}
                  helperText={(sendForm && !isFormValid) && valueValid}
                  type='number'
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <InputBox
                  label={t("table.common.description")}
                  name="description"
                  value={description}
                  onChange={onInputChange}
                  multiline
                  maxRows={3}
                />
              </Grid>
              <Grid item xs={12} sm={12} textAlign={'right'}>
                <Button sx={{ marginRight: '10px' }} startIcon={<Clear />} onClick={fnNewDocto} color='secondary' variant='contained'>
                  {t("button.clear")}
                </Button>
                <Button startIcon={<Save />} onClick={fnSaveDocto} color='primary' variant='contained'>
                  {t('button.save')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <ContainerWithLabel label={t('pages.adjustments.TabTitle')}>
              <Grid container spacing={3} direction='row'>
                <Grid item xs={12} sm={7} md={12} lg={7}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.projects.column.customerName')}</Typography>
                  <Typography variant={"h5"} mb={1.25}>{dataPayroll?.customerName || ''}</Typography>
                </Grid>
                <Grid item xs={12} sm={5} md={6} lg={5}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.projects.column.name')}</Typography>
                  <Typography variant={"h5"} mb={1.25}>{`${dataPayroll?.projectCode || ''} | ${dataPayroll?.projectName || ''}`}</Typography>
                </Grid>
                <Grid item xs={12} sm={5} md={6} lg={5}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.employees.column.classificationName')}</Typography>
                  <Typography variant={"h5"} mb={1.25}>{dataPayroll?.classificationName || ''}</Typography>
                </Grid>
                <Grid item xs={12} sm={3} md={4} lg={2}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.payrolls.column.totalHours')}</Typography>
                  <Typography variant={"h5"} mb={1.25}>{dataPayroll?.hours || ''}</Typography>
                </Grid>
                <Grid item xs={12} sm={3} md={4} lg={2}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.activeEmployees.column.payRate')}</Typography>
                  <Typography variant={"h5"} mb={1.25}>{validFloat(dataPayroll?.employeeRate, 4) || ''}</Typography>
                </Grid>
                <Grid item xs={12} sm={3} md={4} lg={3}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.payrolls.column.totalPay')}</Typography>
                  <Typography variant={"h5"} mb={1.25}>{formatNumber(dataPayroll?.totalPayment, '$. ', 4) || '$ 0.00'}</Typography>
                </Grid>
              </Grid>
            </ContainerWithLabel>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default HeaderSection