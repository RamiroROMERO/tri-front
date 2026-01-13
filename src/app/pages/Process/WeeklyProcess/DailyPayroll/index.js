import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import { LAYOUT_NAMES } from "../../../../layouts/layouts";
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import { getAdminControl, getPrivilegeData } from 'app/utils/helpers';
import ToastAlert from 'app/components/ToastAlert';
import Loading from "app/components/loading";
import Content from './Content';
import SpeedDialButton from 'app/components/SpeedDialButton';
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';

const DailyPayroll = (props) => {
  document.title = "Techmasys - DailyPayroll"
  const dispatch = useDispatch();
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const [isLoading, setLoading] = useState(false);
  const [actions, setActions] = useState([]);
  const { sweetAlerts } = ToastAlert();
  const adminControl = getAdminControl();

  const PRIVILEGE_ID = 5;
  const screenControl = getPrivilegeData(PRIVILEGE_ID);

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  useEffect(() => {
    dispatch(onTitleEdit('dailyPayroll'));
    dispatch(onBreadcrumbEdit(['process', 'weeklyProcess', 'dailyPayroll']));
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

export default DailyPayroll