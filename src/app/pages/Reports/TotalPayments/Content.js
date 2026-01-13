import React from 'react'
import { Box, Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { useTotalPayments } from './useTotalPayments'
import HeaderSection from './HeaderSection'

const Content = ({setLoading, sweetAlerts, screenControl}) => {

  const {table, propsToHeader} = useTotalPayments({setLoading, sweetAlerts, screenControl});

  return (
    <>
      <HeaderSection {...propsToHeader}/>
      <Card>
        <CardContent>
          <Box
            sx={{
              '& .divider-cell': {
                fontWeight: '600',
                borderBottom: '2px solid #adadad !important'
              }
            }}
          >
            <XDataGrid {...table}/>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default Content