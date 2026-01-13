import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import ToastAlert from 'app/components/ToastAlert';
import { getPrivilegeData } from 'app/utils/helpers';
import { LAYOUT_NAMES } from "../../../layouts/layouts";
import Loading from "../../../components/loading";
import Content from './Content';

const DailyHours = (props) => {
  document.title = "Techmasys - Daily Hours"
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const dispatch = useDispatch();
  const { sweetAlerts } = ToastAlert();

  const PRIVILEGE_ID = 32;
  const screenControl = getPrivilegeData(PRIVILEGE_ID);

  useState(() => {
    dispatch(onTitleEdit('dailyHours'));
    dispatch(onBreadcrumbEdit(['reports', 'dailyHours']));
    if (sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY) setSidebarOptions({ open: false })
  }, []);

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  const [isLoading, setLoading] = useState(false);

  return (
    <>
      <Loading show={isLoading} />
      <Content screenControl={screenControl} setLoading={setLoading} sweetAlerts={sweetAlerts} {...props} />
    </>
  )
}

export default DailyHours