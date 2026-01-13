import Error404 from "app/pages/Error404";
import Error403 from "app/pages/Error403";
import React from "react";
import Home from "../pages/Home";
import Users from "../pages/settings/Users";
import Auth from "./middleware/Auth";
import Banks from "app/pages/settings/Banks";

export const privateRoutes = [
  { 
    middleware:[
      {
        element: Auth,
        fallbackPath: '/login'
      }
    ],
    routes:[
      {
        path:'/',
        element:<Home />
      },{
        path:'/settings/users',
        element:<Users />
      },{
        path:'/settings/banks',
        element:<Banks />
      },{
        path: '/unauthorized',
        element: <Error403 />
      },{
        path: '/*',
        element: <Error404 />
      }
    ]
  }
];