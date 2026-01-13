import React from 'react';
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { useActiveEmployees } from './useActiveEmployees';
import HeaderSection from './HeaderSection';

const Content = ({setLoading, sweetAlerts, screenControl}) => {

  const {table, propsToHeader} = useActiveEmployees({setLoading, sweetAlerts, screenControl});

  return (
    <>
      <HeaderSection {...propsToHeader}/>
      <Card>
        <CardContent>
          <XDataGrid {...table}/>
        </CardContent>
      </Card>
    </>
  )
}

export default Content