import React from 'react'
import { Grid } from '@mui/material'
import { InputBox } from 'app/components/InputBox'
import { formatNumber } from 'app/utils/helpers'

const Totals = ({t, onInputChange, subtotal, discount, tax, total}) => {
  return (
    <Grid container spacing={3} direction={'row'} style={{marginTop:'10px'}}>
      <Grid item xs={12} sm={3} md={2}>
        <InputBox
          label={t('table.purchaseOrders.column.subtotal')}
          name='subtotal'
          value={formatNumber(subtotal,'$ ',2)}
          onChange={onInputChange}
          disabled
        />
      </Grid>
      <Grid item xs={12} sm={3} md={2}>
        <InputBox
          label={t('table.purchaseOrders.column.discount')}
          name='discount'
          value={formatNumber(discount,'$ ',2)}
          onChange={onInputChange}
          disabled
        />
      </Grid>
      <Grid item xs={12} sm={3} md={2}>
        <InputBox
          label={t('table.purchaseOrders.column.tax')}
          name='tax'
          value={formatNumber(tax,'$ ',2)}
          onChange={onInputChange}
          disabled
        />
      </Grid>
      <Grid item xs={12} sm={3} md={2}>
        <InputBox
          label={t('table.common.total')}
          name='total'
          value={formatNumber(total,'$ ',2)}
          onChange={onInputChange}
          disabled
        />
      </Grid>
    </Grid>
  )
}

export default Totals