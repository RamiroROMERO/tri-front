import React from 'react'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { useDailyHours } from './useDailyHours';
import HeaderSection from './HeaderSection';

const Content = ({ setLoading, sweetAlerts, screenControl }) => {
  const {table, propsToHeader} = useDailyHours({setLoading, sweetAlerts, screenControl});

  return (
    <>
      <HeaderSection {...propsToHeader}/>
      <Card style={{ marginTop: '20px' }}>
        <CardContent>
          <XDataGrid {...table} />
        </CardContent>
      </Card>
    </>
  )
}

export default Content