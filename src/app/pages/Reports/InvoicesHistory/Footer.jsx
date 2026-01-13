import { Card, CardContent, Grid, Typography } from '@mui/material'
import { formatNumber } from 'app/utils/helpers'
import React from 'react'

export const Footer = ({invoiceTotals, t}) => {
  return (
    <Card style={{ marginTop: '20px' }}>
      <CardContent>
        <Grid container direction="row" justifyContent="flex-end" alignItems="flex-end">
        <Grid item xs={5} sm={1}>
          <Typography variant='h5' component='h5' >{t('table.common.total')}</Typography>
        </Grid>
          <Grid item xs={7} sm={3}>
            <Typography variant='h4' component='h4'>
              {formatNumber(invoiceTotals, '$. ', 2)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
