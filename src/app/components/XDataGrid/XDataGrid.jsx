import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import CustomGridToolBar from './CustomGridToolBar'
import { Button, Divider, Grid, IconButton, Typography } from '@mui/material'

export const XDataGrid = ({title, data, columns, options={}, freeActions=[], customControls=[], extraData=undefined, ...others}) => {

  const [pageSize, setPageSize] = useState(options.pageSize||5)

  const tableOptions = {
    pageSizeDefault:options.pageSize,
    pageSize:5,
    autoHeight:(options.autoHeightTable===false && data.length>8)?false:true,
    pagination:true,
    rowsPerPageOptions:[5,10,20],
    disableSelectionOnClick: options.disableSelection===false?false:true,
    hideFooterRowCount:false,
    showCellRightBorder:true,
    showCellVerticalBorder:true,
    showColumnRightBorder:true,
    showColumnVerticalBorder:true,
    withBorder:true,
    ...options,
  }

  return (
      <>
      <Grid container spacing={3} direction={"row"} style={{marginBottom:'15px'}}>
        {title && (<Grid item xs={12} sm={5} style={{alignSelf:'center'}} > <Typography variant='h4'>{title}</Typography> </Grid>)}
        <Grid item xs={12} sm={title?7:12}>
        <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            {customControls.map(item=>item)}
            {customControls.length>0 &&(<Divider style={{marginLeft:'10px'}} variant='middle' orientation="vertical" flexItem />)}
            {freeActions.map((elem, idx)=>{
              const {label, Icon, onClick, color='primary', disabled=false, showLabel=false} = elem;
              return(
                showLabel?<Button sx={{ml:1}} key={`freeActionsTable-${idx}`} color={color} variant='outlined' aria-label={label} onClick={onClick} disabled={disabled}><Icon /> {label} </Button>:
              <IconButton key={`freeActionsTable-${idx}`} color={color} variant='outlined' aria-label={label} onClick={onClick} disabled={disabled}>
              <Icon />
            </IconButton>
            )})}
        </Grid>
      </Grid>
      </Grid>
      <div style={{ width: '100%', height: (options.heightTable && data.length>8)?options.heightTable:'' }}>
      <DataGrid
        {...tableOptions}
        rows={data}
        components={{ Toolbar: CustomGridToolBar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 100 },
          }
        }}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        experimentalFeatures={{ newEditingApi: true }}
        sx={{
          borderColor: 'primary.light',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
        }}
        {...others}
      />
    </div>
    </>
  )
}
