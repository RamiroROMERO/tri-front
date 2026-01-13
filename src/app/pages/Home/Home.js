import React, { useEffect, useState } from 'react';
import PayrollDashboard from './PayrollDashboard';
import { InventoryDashboard } from './InventoryDashboard';

const Home = ({ setLoading, sweetAlerts }) => {

  const { module } = JSON.parse(localStorage.getItem('mw-user-data'));
  const { textId: textModuleId } = module;
  return (
    <>
      {
        textModuleId === 'payroll-control' && (<PayrollDashboard setLoading={setLoading} sweetAlerts={sweetAlerts} />)
      }

      {
        textModuleId === 'inventory-control' && (<InventoryDashboard setLoading={setLoading} sweetAlert={sweetAlerts} />)
      }
    </>
  );
};

export default Home;