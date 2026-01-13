import ForgotPassword from "app/pages/ForgotPassword";
import ResetPassword from "app/pages/ResetPassword";
import React from "react";
import Login from "../pages/Login";

export const publicRoutes = [
  {
    path: "/login",
    element: <Login/>
  },{
    path:'/reset-password',
    element: <ResetPassword />
  },{
    path: '/forgot-password',
    element: <ForgotPassword />
  }
];