import { Skeleton } from '@mui/material'
import React from 'react'

export const SkeletonUI = () => {
  return (
    <div style={{margin:'10px'}}>
      <Skeleton variant="text" width="100%"  sx={{ fontSize: '1rem' }} />
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width="100%" height={60} />
      <Skeleton variant="rounded" width="100%" height={60} />
    </div>
  )
}
