import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePerdiems } from './usePerdiems';
import { Filter } from './Filter';
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';

const Perdiems = ({ setLoading, sweetAlerts }) => {

  const { t } = useTranslation();

  const { table, setTableData } = usePerdiems({ setLoading, sweetAlerts, t });

  return (
    <>
      <Filter setLoading={setLoading} sweetAlerts={sweetAlerts} t={t} setTableData={setTableData} />
      <Card style={{ marginTop: '10px' }}>
        <CardContent>
          <XDataGrid {...table} />
        </CardContent>
      </Card>
    </>
  );
};

export default Perdiems;