import React from 'react'
import { useHeaderSection } from './useHeaderSection'
import { Button, Card, CardContent, Grid } from '@mui/material';
import { SearchSelect } from 'app/components/SearchSelect';
import { FilterList } from '@mui/icons-material';
import { SimpleSelect } from 'app/components/SimpleSelect';

const HeaderSection = ({ t, setLoading, sweetAlerts, listCustomers, defaultColumns, table, dataWeek, setTable, screenControl, setCustomerName, setDataWeek, fnExportDocumentXLSX }) => {

  const {formState, formValidation, isFormValid, sendForm, listWeeks, listYears, onCustomerChange, onYearChange, onWeekChange, fnGetData} = useHeaderSection({t, setLoading, sweetAlerts, table, dataWeek, setTable, screenControl, defaultColumns, setCustomerName, setDataWeek, listCustomers, fnExportDocumentXLSX});

  const { customerId, noYear, weekId } = formState;

  const { customerIdValid, noYearValid, weekIdValid } = formValidation;

  return (
    <Card sx={{ marginBottom: '20px' }}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={8} md={4} lg={4}>
            <SearchSelect
              label={t("table.common.customer")}
              name="customerId"
              value={customerId}
              onChange={onCustomerChange}
              optionList={listCustomers}
              error={(sendForm && customerIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && customerIdValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={1}>
            <SimpleSelect
              label={t("table.common.year")}
              name="noYear"
              value={noYear}
              onChange={onYearChange}
              optionList={listYears}
              error={(sendForm && noYearValid) ? true : false}
              helperText={(sendForm && !isFormValid) && noYearValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={5}>
            <SearchSelect
              label={t("table.common.week")}
              name="weekId"
              value={weekId}
              onChange={onWeekChange}
              optionList={listWeeks}
              error={(sendForm && weekIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && weekIdValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} textAlign={'right'}>
            <Button sx={{ marginRight: '10px' }} startIcon={<FilterList />} onClick={fnGetData} color='primary' variant='contained'>
              {t("action.filter")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default HeaderSection