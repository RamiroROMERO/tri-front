import React from 'react'
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import { roundTwoDecimals } from 'app/utils/helpers'

const FooterTotals = ({t, totalRegularHours, totalExtraTimeHours, totalOvertimeHours, totalHolidayHours, totalDoubleTimeHours , totalRegHoursFixed, totalVACHours, totalHours, totalExtraTime}) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} direction={'row'} textAlign={'right'}>
          <Grid item xs={6} sm={4} md={3} lg={5}>
            <Typography variant={"h6"} color="text.secondary">{t('table.dailiesPayrolls.summary.totalRegularHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={1} lg={1}>
            <Typography variant={"h5"}>{roundTwoDecimals(totalRegularHours)}</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Typography variant={"h6"} color="text.secondary">{t('table.dailiesPayrolls.summary.totalExtraHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={1} lg={1}>
            <Typography variant={"h5"}>{roundTwoDecimals(totalExtraTimeHours + totalExtraTime)}</Typography>
          </Grid>
          <Grid item xs={6} sm={10} md={2} lg={2}>
            <Typography variant={"h6"} color="text.primary" sx={{fontWeight: '600'}}>{t('table.dailiesPayrolls.summary.totalWeekHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={2} lg={1}>
            <Typography variant={"h5"} sx={{fontWeight: '600'}}>{roundTwoDecimals(totalRegularHours + totalExtraTimeHours + totalExtraTime)}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{mt: 2, mb: 2}}/>
        <Grid container spacing={3} direction={'row'} textAlign={'right'}>
          <Grid item xs={6} sm={4} md={3} lg={5}>
            <Typography variant={"h6"} color="text.secondary">{t('table.dailiesPayrolls.summary.totalOvertimeHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={1} lg={1}>
            <Typography variant={"h5"}>{roundTwoDecimals(totalOvertimeHours)}</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Typography variant={"h6"} color="text.secondary">{t('table.dailiesPayrolls.summary.totalHolidayHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={1} lg={1}>
            <Typography variant={"h5"}>{roundTwoDecimals(totalHolidayHours)}</Typography>
          </Grid>
          <Grid item xs={6} sm={10} md={2} lg={2}>
            <Typography variant={"h6"} color="text.secondary">{t('table.dailiesPayrolls.summary.totalDoubleTimeHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={2} lg={1}>
            <Typography variant={"h5"}>{roundTwoDecimals(totalDoubleTimeHours)}</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={5}>
            <Typography variant={"h6"} color="text.secondary">{t('table.dailiesPayrolls.summary.totalRegHoursFixed')}</Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={1} lg={1}>
            <Typography variant={"h5"}>{roundTwoDecimals(totalRegHoursFixed)}</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Typography variant={"h6"} color="text.secondary">{t('table.dailiesPayrolls.summary.totalVACHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={1} lg={1}>
            <Typography variant={"h5"}>{roundTwoDecimals(totalVACHours)}</Typography>
          </Grid>
          <Grid item xs={6} sm={10} md={2} lg={2}>
            <Typography variant={"h6"} color="text.primary" sx={{fontWeight: '600'}}>{t('table.dailiesPayrolls.summary.totalHours')}</Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={2} lg={1}>
            <Typography variant={"h5"} sx={{fontWeight: '600'}}>{roundTwoDecimals(totalHours)}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FooterTotals