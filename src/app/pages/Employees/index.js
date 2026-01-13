import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import { LAYOUT_NAMES } from 'app/layouts/layouts';
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import ToastAlert from 'app/components/ToastAlert';
import Loading from "app/components/loading";
import SpeedDialButton from 'app/components/SpeedDialButton';
import Content from './Content';
import { getAdminControl, getPrivilegeData } from 'app/utils/helpers';
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';

const Employees = (props) => {
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  document.title = "GC Staffing - Employees"
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [actions, setActions] = useState([]);
  const { sweetAlerts } = ToastAlert();

  const PRIVILEGE_ID = 2;
  const screenControl = getPrivilegeData(PRIVILEGE_ID);
  const adminControl = getAdminControl();

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  useEffect(() => {
    dispatch(onTitleEdit('employees'));
    dispatch(onBreadcrumbEdit(['employees']));
    if (sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY) setSidebarOptions({ open: false })
  }, []);

  return (
    <>
      <Loading show={isLoading} />
      <Content screenControl={screenControl} adminControl={adminControl} setLoading={setLoading} sweetAlerts={sweetAlerts} setActions={setActions} {...props} />
      <SpeedDialButton actions={actions} />
    </>
  )
}

export default Employees