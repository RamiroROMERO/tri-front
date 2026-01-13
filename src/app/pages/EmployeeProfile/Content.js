import React from 'react'
import { useEmployee } from './useEmployee'
import { Modal } from 'app/components/Modal';
import { ModalSeekEmployee } from './ModalSeekEmployee';
import { Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { XDataGrid } from 'app/components/XDataGrid';

const Content = ({ setLoading, sweetAlerts }) => {

  const { t } = useTranslation();
  const {employeeId, currentItem, table, openSeekEmployee, listBanks, listCiaAccount, listClassification, listCustomer, listSector, listStatus, setOpenSeekEmployee, fnGetEmployeeList } = useEmployee({ setLoading, sweetAlerts });

  const propsToSeekEmployees = {
    title: 'dialog.employeeProfile.seek',
    DialogContent: ModalSeekEmployee,
    open: openSeekEmployee,
    setOpen: setOpenSeekEmployee,
    maxWidth: 'md',
    t: t,
    data: {
      listBanks, listCiaAccount, listClassification, listCustomer, listSector, listStatus,
      currentItem,
      setLoading,
      sweetAlerts,
      employeeId,
      fnGetEmployeeList
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <XDataGrid {...table} />
        </CardContent>
      </Card>
      <Modal {...propsToSeekEmployees} />
    </>
  )
}

export default Content