import React from 'react';
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal, ModalConfirm } from 'app/components';
import { useManageCompanies } from './useManageCompanies';
import { useTableAccounts } from './useTableAccounts';
import { ModalNewAccount } from './ModalNewAccount';
import { ModalEditAccount } from './ModalEditAccount';
import HeaderSection from './HeaderSection';

const Content = ({setLoading, sweetAlerts, controlAdmin}) => {

  const {t, companyId, dataCompany, propsToModalEditCompany, fnEditDocto} = useManageCompanies({setLoading, sweetAlerts, controlAdmin });

  const {table, propsToModalConfirm, currentItem, openModalAddAccount, setOpenModalAddAcount, openModalEditAccount, setOpenModalEditAccount, fnGetData} = useTableAccounts({setLoading, sweetAlerts, t, controlAdmin, companyId});

  const propsToModalNewAccount = {
    title: 'table.manageCompanies.modal.add',
    DialogContent: ModalNewAccount,
    open: openModalAddAccount,
    setOpen: setOpenModalAddAcount,
    maxWidth: 'sm',
    data: {
      companyId: dataCompany.id,
      setLoading,
      sweetAlerts,
      currentItem,
      fnGetData
    }
  };

  const propsToModalEditAccout = {
    title: 'table.manageCompanies.modal.edit',
    DialogContent: ModalEditAccount,
    open: openModalEditAccount,
    setOpen: setOpenModalEditAccount,
    maxWidth: 'md',
    data: {
      companyId: dataCompany.id,
      setLoading,
      sweetAlerts,
      currentItem,
      fnGetData
    }
  };

  return (
    <>
      <HeaderSection t={t} dataCompany={dataCompany} fnEditDocto={fnEditDocto}/>
      <Card>
        <CardContent>
          <XDataGrid {...table}/>
        </CardContent>
      </Card>
      <Modal {...propsToModalNewAccount}/>
      <Modal {...propsToModalEditAccout}/>
      <Modal {...propsToModalEditCompany}/>
      <ModalConfirm {...propsToModalConfirm}/>
    </>
  )
}

export default Content