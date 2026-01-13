import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import { LAYOUT_NAMES } from "../../../layouts/layouts";
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import { getPrivilegeData } from 'app/utils/helpers';
import ToastAlert from 'app/components/ToastAlert';
import Loading from "app/components/loading";
import Content from './Content';
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';

const DeductionsTypes = (props) => {
  document.title = "GC Staffing - Deductions Types"
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const { sweetAlerts } = ToastAlert();

  const PRIVILEGE_ID2 = 23;
  const controlAdmin = getPrivilegeData(PRIVILEGE_ID2);

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  useEffect(() => {
    dispatch(onTitleEdit('deductionsTypes'));
    dispatch(onBreadcrumbEdit(['settings', 'deductionsTypes']));
    if (sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY) setSidebarOptions({ open: false })
  }, []);

  return (
    <>
      <Loading show={isLoading} />
      <Content controlAdmin={controlAdmin} setLoading={setLoading} sweetAlerts={sweetAlerts} {...props} />
    </>
  )
}

export default DeductionsTypes