import React, { useState } from 'react';
import { useSubsequentWork } from './useSubsequentWork';
import { Filter } from './Filter';
import { useTranslation } from 'react-i18next';
import { XDataGrid } from 'app/components/XDataGrid';
import { Card, CardContent, Grid } from '@mui/material';

const Content = ({ setLoading, sweetAlerts }) => {

  const { t } = useTranslation();
  const [currentCustomer, setCurrentCustomer] = useState({});
  const [tableData, setTableData] = useState([]);
  const { table } = useSubsequentWork({ setLoading, sweetAlerts, t, tableData })

  return (
    <>
      <Filter setLoading={setLoading} setCurrentCustomer={setCurrentCustomer} tableData={tableData} setTableData={setTableData} t={t} />
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <XDataGrid {...table} />
        </CardContent>
      </Card >
    </>
  );
};

export default Content;