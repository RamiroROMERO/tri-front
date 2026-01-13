import React from 'react'
import { Card, CardContent, Grid } from '@mui/material'
import { SimpleSelect } from 'app/components';

const FilterWeeks = ({ yearFilter, listYears, fnFilterWeeks, t }) => {
  return (
    <Card sx={{ marginBottom: '20px' }}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={6} md={4}>
            <SimpleSelect
              label={t("table.common.year")}
              name="yearFilter"
              value={yearFilter}
              onChange={fnFilterWeeks}
              optionList={listYears}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FilterWeeks