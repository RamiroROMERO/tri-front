import React from 'react'
import { Card, CardContent, Grid } from '@mui/material';
import { SimpleSelect, MenuList } from 'app/components';

const CardListCustomer = ({ t, yearId, customerId, onYearChange, listYears, listCustomers, fnGetProjects }) => {

  const propsToMenuListCustomers = {
    itemsList: listCustomers,
    optSelect: customerId,
    fnExecute: fnGetProjects
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} style={{ paddingTop: '12px' }}>
            <SimpleSelect
              label={t("table.common.year")}
              name="yearId"
              value={yearId}
              onChange={onYearChange}
              optionList={listYears}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12}>
            <MenuList {...propsToMenuListCustomers} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CardListCustomer