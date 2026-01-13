import React from 'react'
import { useFilter } from './useFilter'
import { Button, Card, CardContent, Grid } from '@mui/material';
import { SearchSelect } from 'app/components/SearchSelect';
import { SimpleSelect } from 'app/components/SimpleSelect';
import { DirectionsRun } from '@mui/icons-material';

export const Filter = ({ setLoading, t, setDataTable }) => {

  const { customerList, weeksForYear, yearList, formState, formValidation, isFormValid, sendForm, onCustomerChange, onYearChange, onInputChange, fnGeteneratePerdiems } = useFilter({ setLoading, setDataTable, t });

  const { customerId, yearId, weekId } = formState;
  const { customerIdValid, yearIdValid, weekIdValid } = formValidation;

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8} md={6}>
              <SearchSelect
                label={t("table.common.customer")}
                id="customerId"
                name="customerId"
                value={customerId}
                onChange={onCustomerChange}
                optionList={customerList}
                error={(sendForm && customerIdValid) ? true : false}
                helperText={(sendForm && !isFormValid) && customerIdValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3} lg={2}>
              <SimpleSelect
                label={t("table.common.year")}
                name="yearId"
                value={yearId}
                onChange={onYearChange}
                optionList={yearList}
                error={(sendForm && yearIdValid) ? true : false}
                helperText={(sendForm && !isFormValid) && yearIdValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={9} lg={4}>
              <SearchSelect
                label={t("table.common.week")}
                name="weekId"
                value={weekId}
                onChange={onInputChange}
                optionList={weeksForYear}
                error={(sendForm && weekIdValid) ? true : false}
                helperText={(sendForm && !isFormValid) && weekIdValid}
                required
              />
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Button sx={{ marginRight: '10px', marginTop: '20px' }} startIcon={<DirectionsRun />} onClick={fnGeteneratePerdiems} color='primary' variant='contained'>
              {t("button.generate")}
            </Button>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
