import React from 'react'
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarQuickFilter } from '@mui/x-data-grid'

export const CustomGridToolBar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <div style={{ flex: 1 }} />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  )
}

export default CustomGridToolBar;