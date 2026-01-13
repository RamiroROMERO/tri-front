import React from 'react'
import { Button, Card, CardContent, Grid } from '@mui/material';
import { SearchSelect, SimpleSelect } from 'app/components';
import { FilterList } from '@mui/icons-material';
import { useHeaderSection } from './useHeaderSection'

const HeaderSection = ({ t, setLoading, sweetAlerts, listCustomers, setTableData, setEnableFreeActions, setParamsFilter, screenControl }) => {

  const { formState, formValidation, isFormValid, sendForm, listWeeks, listYears, onInputChange, onCustomerChange, onYearChange, fnGetData } = useHeaderSection({ t, setLoading, sweetAlerts, setTableData, setEnableFreeActions, setParamsFilter, screenControl });

  const { customerId, noYear, weekId } = formState;

  const { customerIdValid, noYearValid, weekIdValid } = formValidation;

  return (
    <Card sx={{ marginBottom: '20px' }}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={9} lg={4}>
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
          <Grid item xs={12} sm={3} lg={2}>
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
          <Grid item xs={12} sm={9} lg={4}>
            <SearchSelect
              label={t("table.common.week")}
              name="weekId"
              value={weekId}
              onChange={onInputChange}
              optionList={listWeeks}
              error={(sendForm && weekIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && weekIdValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3} lg={2} textAlign={'right'}>
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