import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import ToastAlert from 'app/components/ToastAlert';
import Loading from "app/components/loading";
import { LAYOUT_NAMES } from "app/layouts/layouts";
import { getPrivilegeData } from 'app/utils/helpers';
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import Content from './Content';
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';

const BanksPage = (props) => {
  document.title = "GC Staffing - Banks"
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const { sweetAlerts } = ToastAlert();

  const PRIVILEGE_ID2 = 24;
  const controlAdmin = getPrivilegeData(PRIVILEGE_ID2);

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  useEffect(() => {
    dispatch(onTitleEdit('settings.banks'));
    dispatch(onBreadcrumbEdit(['settings', 'banks']));
    if (sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY) setSidebarOptions({ open: false })
  }, []);

  return (
    <>
      <Loading show={isLoading} />
      <Content controlAdmin={controlAdmin} setLoading={setLoading} sweetAlerts={sweetAlerts} t={t} {...props} />
    </>
  )
}

export default BanksPage;