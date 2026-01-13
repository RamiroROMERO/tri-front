import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import { LAYOUT_NAMES } from 'app/layouts/layouts';
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import ToastAlert from 'app/components/ToastAlert';
import Loading from "app/components/loading";
import Content from './Content';
import { getAdminControl, getPrivilegeData, validInt } from 'app/utils/helpers';
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';

const Customers = (props) => {
  document.title = "GC Staffing - Customers"
  const dispatch = useDispatch();
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const [isLoading, setLoading] = useState(false);
  const { sweetAlerts } = ToastAlert();

  const PRIVILEGE_ID = 1;
  const screenControl = getPrivilegeData(PRIVILEGE_ID);
  const adminControl = getAdminControl();

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  useEffect(() => {
    dispatch(onTitleEdit('customers'));
    dispatch(onBreadcrumbEdit(['customers']));
    if (sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY) setSidebarOptions({ open: false })
  }, []);

  return (
    <>
      <Loading show={isLoading} />
      <Content screenControl={screenControl} adminControl={adminControl} setLoading={setLoading} sweetAlerts={sweetAlerts} {...props} />
    </>
  )
}

export default Customers
