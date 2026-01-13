import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import { LAYOUT_NAMES } from 'app/layouts/layouts';
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import { getPrivilegeData } from 'app/utils/helpers';
import ToastAlert from 'app/components/ToastAlert';
import Loading from "app/components/loading";
import Content from './Content';
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';

const Adjustment = (props) => {
  document.title = "GC Staffing - Adjustments"
  const dispatch = useDispatch();
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const [isLoading, setLoading] = useState(false);
  const { sweetAlerts } = ToastAlert();

  const PRIVILEGE_ID = 9;
  const screenControl = getPrivilegeData(PRIVILEGE_ID);

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  useEffect(() => {
    dispatch(onTitleEdit('adjustments'));
    dispatch(onBreadcrumbEdit(['process', 'adjustments', 'adjustments']));
    if (sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY) setSidebarOptions({ open: false })
  }, []);

  return (
    <>
      <Loading show={isLoading} />
      <Content screenControl={screenControl} setLoading={setLoading} sweetAlerts={sweetAlerts} {...props} />
    </>
  )
}

export default Adjustment