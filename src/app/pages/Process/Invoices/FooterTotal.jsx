import React from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import { formatNumber, validFloat } from 'app/utils/helpers'

const FooterTotal = ({discount = 0, subTotal = 0, total = 0, t}) => {
  const DiscountPercent = validFloat((discount / subTotal) * 100);
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} direction={'row'} textAlign={'right'}>
          <Grid item xs={6} sm={8} md={10}>
            <Typography variant={"h6"} color="text.secondary">{t('table.common.subTotal')}</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant={"h5"}>{formatNumber(subTotal, '$ ', 2)}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3} direction={'row'} textAlign={'right'}>
          <Grid item xs={6} sm={8} md={10}>
            <Typography variant={"h6"} color="text.secondary">{`${t('table.common.discountPercent')}(${DiscountPercent}%)`}</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant={"h5"}>{`-${formatNumber(discount, '$ ', 2)}`}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3} direction={'row'} textAlign={'right'}>
          <Grid item xs={6} sm={8} md={10}>
            <Typography variant={"h6"} color="text.secondary">{t('table.common.total')}</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant={"h5"}>{formatNumber(total, '$ ', 2)}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FooterTotal