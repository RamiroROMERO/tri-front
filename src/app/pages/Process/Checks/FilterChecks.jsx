import React from 'react'
import { Button, Card, CardContent, Grid } from '@mui/material';
import { SearchSelect, SimpleSelect } from 'app/components';
import { YoutubeSearchedFor } from '@mui/icons-material';
import AccordionCheck from 'app/components/AccordionCheck/AccordionCheck';


const paymentDeliveryList = [{
  value: 0,
  label: 'Seleccione...'
}, {
  value: 1,
  label: 'Entregar'
}, {
  value: 2,
  label: 'Depositar'
},]

const FilterChecks = ({ t, formState, formValidation, isFormValid, sendForm, listCustomers, listYears, listWeeks, customerSelected, listQbAccounts, listExpenses, setListCustomers, setCustomerSelected, onYearChange, onWeekChange, onQuickBookCompanyChange, onExpenseChange, fnCustomersChange, fnGetChecks, onPaymentDeliveryChange }) => {

  const { noYear, weekId, quickBookCompany, expenseId, paymentDeliveryType } = formState;

  const { noYearValid, weekIdValid, quickBookCompanyValid, expenseIdValid } = formValidation;
  return (
    <Card sx={{ marginBottom: '20px' }}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={3} md={2}>
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
          <Grid item xs={12} sm={9} md={5}>
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
          <Grid item xs={12} sm={7} md={5}>
            <SearchSelect
              label={t("table.invoice.qbAccount")}
              name="quickBookCompany"
              value={quickBookCompany}
              onChange={onQuickBookCompanyChange}
              optionList={listQbAccounts}
              error={(sendForm && quickBookCompanyValid) ? true : false}
              helperText={(sendForm && !isFormValid) && quickBookCompanyValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={5} md={5}>
            <SearchSelect
              label={t("table.checks.qbExpense")}
              name="expenseId"
              value={expenseId}
              onChange={onExpenseChange}
              optionList={listExpenses}
              error={(sendForm && expenseIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && expenseIdValid}
              required
            />
          </Grid>
          {/* <Grid item xs={12} sm={5} md={5}>
            <SearchSelect
              label={t("table.employees.column.paymentDeliveryType")}
              name="paymentDeliveryType"
              value={paymentDeliveryType}
              onChange={onPaymentDeliveryChange}
              optionList={paymentDeliveryList}
              error={(sendForm&&expenseIdValid)?true:false}
              helperText={(sendForm &&!isFormValid)&&expenseIdValid}
              required
            />
          </Grid> */}
          <Grid item xs={12}>
            <AccordionCheck
              list={listCustomers}
              listSelected={customerSelected}
              setList={setListCustomers}
              setListSelected={setCustomerSelected}
              fnOptionsChange={fnCustomersChange}
              title={t("table.common.customer")}
              t={t}
            />
          </Grid>
          <Grid item xs={12} textAlign={'right'}>
            <Button startIcon={<YoutubeSearchedFor />} onClick={fnGetChecks} color='primary' variant='contained'>
              {t("button.generate")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FilterChecks