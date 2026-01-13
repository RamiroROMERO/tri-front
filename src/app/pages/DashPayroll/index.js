import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import ToastAlert from 'app/components/ToastAlert';
import Loading from "../../components/loading";
import { LAYOUT_NAMES } from "../../layouts/layouts";
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import DashPayroll from './DashPayroll';
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';

const DashPayrollPage = (props) => {
  document.title = "GC Staffing - Home"
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const dispatch = useDispatch();
  const { sweetAlerts } = ToastAlert();

  dispatch(onTitleEdit('dashPayroll'));
  dispatch(onBreadcrumbEdit(['dashPayroll']))

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY) setSidebarOptions({ open: false })
  }, [])


  return (
    <>
      <Loading show={isLoading} />
      <DashPayroll isLoading={isLoading} setLoading={setLoading} sweetAlerts={sweetAlerts} {...props} />
    </>
  )
}

export default DashPayrollPage;