import React from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import { formatNumber } from 'app/utils/helpers'

const FooterSection = ({t, totalRegHours, totalOTHours, totalPayment}) => {
  return (
    <Card sx={{marginTop: '20px'}}>
      <CardContent>
        <Grid container spacing={3} direction={'row'} textAlign={'right'}>
          <Grid item xs={6} sm={4} md={2} lg={4}>
            <Typography variant={"h6"} color="text.secondary">{t('table.paymentHistory.column.regularHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={1} lg={1}>
            <Typography variant={"h5"}>{formatNumber(totalRegHours,'',2)}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} lg={2}>
            <Typography variant={"h6"} color="text.secondary">{t('table.paymentHistory.column.overtimeHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={1} lg={1}>
            <Typography variant={"h5"}>{formatNumber(totalOTHours,'',2)}</Typography>
          </Grid>
          <Grid item xs={6} sm={9} md={2} lg={2}>
            <Typography variant={"h6"} color="text.primary" sx={{fontWeight: '600'}}>{t('table.paymentHistory.column.totalPayment')}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} lg={2}>
            <Typography variant={"h5"} sx={{fontWeight: '600'}}>{formatNumber(totalPayment, '$. ', 2)}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FooterSection