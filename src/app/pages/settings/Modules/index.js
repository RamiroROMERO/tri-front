import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import { LAYOUT_NAMES } from "../../../layouts/layouts";
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import SpeedDialButton from 'app/components/SpeedDialButton';
import ToastAlert from 'app/components/ToastAlert';
import Loading from "app/components/loading";
import Content from './Content';
import { getPrivilegeData } from 'app/utils/helpers';
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';

const Modules = (props) => {
  document.title = "GC Staffing - Modules"
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [actions, setActions] = useState([]);
  const { sweetAlerts } = ToastAlert();

  const PRIVILEGE_ID2 = 26;
  const controlAdmin = getPrivilegeData(PRIVILEGE_ID2);

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  useEffect(() => {
    dispatch(onTitleEdit('modules'));
    dispatch(onBreadcrumbEdit(['settings', 'modules']));
    if (sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY) setSidebarOptions({ open: false })
  }, []);

  return (
    <>
      <Loading show={isLoading} />
      <Content controlAdmin={controlAdmin} setLoading={setLoading} sweetAlerts={sweetAlerts} setActions={setActions} {...props} />
      <SpeedDialButton actions={actions} />
    </>
  )
}

export default Modules