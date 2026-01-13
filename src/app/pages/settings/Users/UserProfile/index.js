import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import { LAYOUT_NAMES } from "app/layouts/layouts";
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import { useParams } from 'react-router-dom';
import { getPrivilegeData } from 'app/utils/helpers';
import SpeedDialButton from 'app/components/SpeedDialButton';
import ToastAlert from 'app/components/ToastAlert';
import Loading from "app/components/loading";
import Content from './Content';
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';

const UserProfile = (props) => {
  document.title = "GC Staffing - User Profile"
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [actions, setActions] = useState([]);
  const { sweetAlerts } = ToastAlert();

  const PRIVILEGE_ID2 = 25;
  const controlAdmin = getPrivilegeData(PRIVILEGE_ID2);

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  useEffect(() => {
    dispatch(onTitleEdit('userProfile'));
    dispatch(onBreadcrumbEdit(['settings', 'users', 'userProfile']));
    if (sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY) setSidebarOptions({ open: false })
  }, []);

  return (
    <>
      <Loading show={isLoading} />
      <Content controlAdmin={controlAdmin} setLoading={setLoading} sweetAlerts={sweetAlerts} setActions={setActions} userId={userId} {...props} />
      <SpeedDialButton actions={actions} />
    </>
  )
}

export default UserProfile