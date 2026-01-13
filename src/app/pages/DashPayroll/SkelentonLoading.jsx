import { Grid } from '@mui/material'
import { SkeletonUI } from 'app/components/SkeletonUI'
import React from 'react'

export const SkelentonLoading = () => {
  return (
    <Grid container direction='row' spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <SkeletonUI />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SkeletonUI />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SkeletonUI />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SkeletonUI />
      </Grid>
    </Grid>
  )
}
