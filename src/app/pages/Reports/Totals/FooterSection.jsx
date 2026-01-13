import React from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import { formatNumber } from 'app/utils/helpers'

const FooterSection = ({t, totalsData}) => {
  return (
    <Card sx={{marginTop: '20px'}}>
      <CardContent>
        <Grid container spacing={3} direction={'row'} textAlign={'right'}>
          <Grid item xs={6} sm={3} lg={2}>
            <Typography variant={"h6"} color="text.secondary">{t('table.totals.column.regularHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <Typography variant={"h5"}>{formatNumber(totalsData.regularHours,'',2)}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <Typography variant={"h6"} color="text.secondary">{t('table.totals.column.overtimeHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <Typography variant={"h5"}>{formatNumber(totalsData.overtimeHours,'',2)}</Typography>
          </Grid>
          <Grid item xs={6} sm={9} lg={2}>
            <Typography variant={"h6"} color="text.primary" sx={{fontWeight: '600'}}>{t('table.totals.column.totalHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <Typography variant={"h5"} sx={{fontWeight: '600'}}>{formatNumber(totalsData.totalHours, '', 2)}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <Typography variant={"h6"} color="text.secondary">{t('table.totals.column.regularPayment')}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <Typography variant={"h5"}>{formatNumber(totalsData.regularPayment,'$. ',2)}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <Typography variant={"h6"} color="text.secondary">{t('table.totals.column.overtimePayment')}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <Typography variant={"h5"}>{formatNumber(totalsData.overtimePayment,'$. ',2)}</Typography>
          </Grid>
          <Grid item xs={6} sm={9} lg={2}>
            <Typography variant={"h6"} color="text.primary" sx={{fontWeight: '600'}}>{t('table.totals.column.totalPayment')}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <Typography variant={"h5"} sx={{fontWeight: '600'}}>{formatNumber(totalsData.totalPayment, '$. ', 2)}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FooterSection