import React, { useState } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Auth = ({ fallbackPath }) => {

  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('mw-user-data')))

  if (authUser?.isLoading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={authUser.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!!authUser && authUser.id && authUser.module) {
    return <Outlet />;
  }

  return <Navigate to={fallbackPath} />;
};

export default Auth;