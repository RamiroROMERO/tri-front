import React from 'react'
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import {useTheme} from "@mui/material";

const Notifications = (type, message)=>{

  const Swal = useSwalWrapper();
  const theme = useTheme();
  const sweetAlerts = (type, message) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        onOpen: toast => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    });

    Toast.fire({
        icon: type,
        title: message,
        background: theme.palette.background.paper,
    });
  };

  sweetAlerts(type, message);

}

export default Notifications;