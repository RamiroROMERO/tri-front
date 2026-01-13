import React from 'react'
import { Button, Card, CardContent, Grid } from '@mui/material';
import { CheckBox, ContainerWithLabel, InputBox, SearchSelect, SimpleSelect } from 'app/components';
import { Save } from '@mui/icons-material';
import { useHeaderSection } from './useHeaderSection'

const HeaderSection = ({ t, setLoading, sweetAlerts, listYears, listWeeksWorked, listEmployees, listMissingType, fnGetData, screenControl }) => {

  const { formState, formValidation, isFormValid, sendForm, listWeeks, listWeeks2, listProjects, onInputChange, onWeekChange, onWeek2Change, onEmployeeChange, fnSaveDocto } = useHeaderSection({ t, setLoading, sweetAlerts, listWeeksWorked, fnGetData, screenControl });

  const { noYear, noYear2, weekId, projectId, employeeId, typeId, qty, pricePayroll, priceInvoice, totalPayroll, totalInvoice, inCheck, inInvoice, weekId2 } = formState;

  const { noYearValid, noYear2Valid, weekIdValid, weekId2Valid, projectIdValid, employeeIdValid, typeIdValid, qtyValid, totalInvoiceValid } = formValidation;

  return (
    <Card sx={{ marginBottom: '20px' }}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={6} lg={4}>
            <ContainerWithLabel label={t("table.missingtime.card1.title")} style={{ fontSize: '18px', color: '#252525' }}>
              <Grid container spacing={3} direction='row'>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <SearchSelect
                    label={t("table.projects.column.no_week")}
                    name="weekId"
                    value={weekId}
                    onChange={onWeekChange}
                    optionList={listWeeks}
                    error={(sendForm && weekIdValid) ? true : false}
                    helperText={(sendForm && !isFormValid) && weekIdValid}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <SearchSelect
                    label={t("table.common.project")}
                    name="projectId"
                    value={projectId}
                    onChange={onInputChange}
                    optionList={listProjects}
                    error={(sendForm && projectIdValid) ? true : false}
                    helperText={(sendForm && !isFormValid) && projectIdValid}
                    required
                  />
                </Grid>
              </Grid>
            </ContainerWithLabel>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <ContainerWithLabel label={t("table.missingtime.card2.title")} style={{ fontSize: '18px', color: '#252525' }}>
              <Grid container spacing={3} direction='row'>
                <Grid item xs={12}>
                  <SimpleSelect
                    label={t("table.common.year")}
                    name="noYear2"
                    value={noYear2}
                    onChange={onInputChange}
                    optionList={listYears}
                    error={(sendForm && noYear2Valid) ? true : false}
                    helperText={(sendForm && !isFormValid) && noYear2Valid}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <SearchSelect
                    label={t("table.projects.column.no_week")}
                    name="weekId2"
                    value={weekId2}
                    onChange={onWeek2Change}
                    optionList={listWeeks2}
                    error={(sendForm && weekId2Valid) ? true : false}
                    helperText={(sendForm && !isFormValid) && weekId2Valid}
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
                <Grid item xs={8} sm={8}>
                  <SimpleSelect
                    label={t("table.common.type")}
                    name="typeId"
                    value={typeId}
                    onChange={onInputChange}
                    optionList={listMissingType}
                    error={(sendForm && typeIdValid) ? true : false}
                    helperText={(sendForm && !isFormValid) && typeIdValid}
                    required
                  />
                </Grid>
                <Grid item xs={4} sm={4}>
                  <InputBox
                    label={t("table.missingtime.textField.hours")}
                    name="qty"
                    value={qty}
                    onChange={onInputChange}
                    error={(sendForm && qtyValid) ? true : false}
                    helperText={(sendForm && !isFormValid) && qtyValid}
                    type='number'
                    required
                  />
                </Grid>
              </Grid>
            </ContainerWithLabel>
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <ContainerWithLabel label={t("table.missingtime.card3.title")} style={{ fontSize: '18px', color: '#252525' }}>
              <Grid container spacing={3} direction='row'>
                <Grid item xs={6} sm={4} md={3} lg={6}>
                  <InputBox
                    label={t("table.missingtime.textField.payRate")}
                    name="pricePayroll"
                    value={pricePayroll}
                    onChange={onInputChange}
                    type='number'
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={6}>
                  <InputBox
                    label={t("table.missingtime.textField.payTotal")}
                    name="totalPayroll"
                    value={totalPayroll}
                    onChange={onInputChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={6}>
                  <InputBox
                    label={t("table.missingtime.textField.invoiceRate")}
                    name="priceInvoice"
                    value={priceInvoice}
                    onChange={onInputChange}
                    type='number'
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={6}>
                  <InputBox
                    label={t("table.missingtime.textField.invoiceTotal")}
                    name="totalInvoice"
                    value={totalInvoice}
                    onChange={onInputChange}
                    error={(sendForm && totalInvoiceValid) ? true : false}
                    helperText={(sendForm && !isFormValid) && totalInvoiceValid}
                    type='number'
                    required
                    disabled
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={6}>
                  <CheckBox
                    label={t("table.missingtime.checkBox.inInvoice")}
                    name="inInvoice"
                    checked={inInvoice}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={6}>
                  <CheckBox
                    label={t("table.missingtime.checkBox.inCheck")}
                    name="inCheck"
                    checked={inCheck}
                    onChange={onInputChange}
                  />
                </Grid>
              </Grid>
            </ContainerWithLabel>
          </Grid>
        </Grid>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} textAlign={'right'}>
            <Button startIcon={<Save />} onClick={fnSaveDocto} color='primary' variant='contained'>
              {t('button.save')}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default HeaderSection