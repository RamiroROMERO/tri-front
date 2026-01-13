import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp } from "@jumbo/hooks";
import { LAYOUT_NAMES } from "../../../layouts/layouts";
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import { getPrivilegeData } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';
import ToastAlert from 'app/components/ToastAlert';
import Loading from "app/components/loading";
import SpeedDialButton from 'app/components/SpeedDialButton';
import Content from './Content';

const Invoices = (props) => {
  document.title = "GC Staffing - Invoices"
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeLayout, setActiveLayout } = useJumboApp();
  const [isLoading, setLoading] = useState(false);
  const [actions, setActions] = useState([]);
  const { sweetAlerts } = ToastAlert();

  const PRIVILEGE_ID = 6;
  const screenControl = getPrivilegeData(PRIVILEGE_ID);
  const PRIVILEGE_ID2 = 29;
  const controlAdmin = getPrivilegeData(PRIVILEGE_ID2);

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  useEffect(() => {
    dispatch(onTitleEdit('invoices'));
    dispatch(onBreadcrumbEdit(['process', 'invoices']));
  }, []);

  return (
    <>
      <Loading show={isLoading} />
      <Content screenControl={screenControl} controlAdmin={controlAdmin} setLoading={setLoading} sweetAlerts={sweetAlerts} setActions={setActions} t={t} {...props} />
      <SpeedDialButton actions={actions}/>
    </>
  )
}

export default Invoices