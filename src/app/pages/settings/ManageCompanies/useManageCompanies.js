import { useEffect, useState } from 'react';
import { request } from 'app/utils/core';
import { useTranslation } from 'react-i18next';
import { ModalEditCompany } from './ModalEditCompany';

export const useManageCompanies = ({setLoading, sweetAlerts, controlAdmin}) => {
  const {t} = useTranslation();
  const companyData = JSON.parse(localStorage.getItem('mw-company-data'));
  const [companyId, setCompanyId] = useState(companyData.id);
  const [dataCompany, setDataCompany] = useState({});
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const fnGetDataCompany = ()=>{
    setLoading(true);
    request.GET(`/adminCompany/findOne?id=${companyId}`, (resp)=>{
      setDataCompany(resp.adminCompanies);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnEditDocto = ()=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setOpenModalEdit(true);
  }

  useEffect(()=>{
    fnGetDataCompany();
  },[]);

  const propsToModalEditCompany = {
    title: 'pages.adminCompanies',
    DialogContent: ModalEditCompany,
    open: openModalEdit,
    setOpen: setOpenModalEdit,
    maxWidth: 'md',
    data: {
      dataCompany,
      setLoading,
      sweetAlerts,
      fnGetDataCompany
    }
  };

  return (
    {
      t,
      companyId,
      dataCompany,
      propsToModalEditCompany,
      fnEditDocto
    }
  )
}
