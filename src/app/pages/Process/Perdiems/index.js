import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import ToastAlert from 'app/components/ToastAlert';
import Loading from "../../../components/loading";
import { LAYOUT_NAMES } from "../../../layouts/layouts";
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import Perdiems from './Perdiems';
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';

const HomePage = (props) => {
  document.title = "GC Staffing - Perdiems"
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const dispatch = useDispatch();
  const { sweetAlerts } = ToastAlert();

  useEffect(() => {
    dispatch(onTitleEdit('perdiems'));
    dispatch(onBreadcrumbEdit(['process', 'perdiems']));

    if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
      setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
    }

    if (sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY) setSidebarOptions({ open: false })

  }, []);


  const [isLoading, setLoading] = useState(false);
  return (
    <>
      <Loading show={isLoading} />
      <Perdiems setLoading={setLoading} sweetAlerts={sweetAlerts} {...props} />
    </>
  )
}

export default HomePage;