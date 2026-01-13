
import React from 'react';
import Swal from 'sweetalert2';
import useStyles from "@jumbo/vendors/sweetalert2/style";
const ToastAlert = () => {

  const sweetAlertStyles = useStyles();
  const sweetAlerts = (variant, title) => {
    const typeToast = ['success', 'error', 'warning', 'information'];
    variant = typeToast.includes(variant) ? variant : typeToast[0];
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: variant ==='error'? 5000:3000,
      timerProgressBar: true,
      customClass: {
        container: `${sweetAlertStyles.container}`,
        popup: `${sweetAlertStyles.popup}`,
        title: `${sweetAlertStyles.title}`,
        closeButton: `${sweetAlertStyles.closeButton}`,
        image: `${sweetAlertStyles.image}`,
        htmlContainer: `${sweetAlertStyles.htmlContainer}`,
        confirmButton: `${sweetAlertStyles.confirmButton}`,
        cancelButton: `${sweetAlertStyles.cancelButton}`,
        footer: `${sweetAlertStyles.footer}`
    }
    });

    Toast.fire({
      icon: variant,
      title: title
    });
  };
  return {sweetAlerts}
};

export default ToastAlert;



// export const ToastAlert = (variant, title, message = undefined) => {
//   const typeToast = ['success', 'error', 'warning', 'information'];
//   const typeTitles = ['Success', 'Error', 'Warning', 'Information'];
//   variant = typeToast.includes(variant) ? variant : typeToast[0];
//   if (!message) {
//     message = title;
//     title = typeTitles[typeToast.indexOf(variant)];
//   }

//   // const theme = useTheme();
//   const sweetAlertStyles = useStyles();

//   // Swal.mixin({
//   //   customClass: {
//   //     container: `${sweetAlertStyles.container}`,
//   //     popup: `${sweetAlertStyles.popup}`,
//   //     title: `${sweetAlertStyles.title}`,
//   //     closeButton: `${sweetAlertStyles.closeButton}`,
//   //     image: `${sweetAlertStyles.image}`,
//   //     htmlContainer: `${sweetAlertStyles.htmlContainer}`,
//   //     confirmButton: `${sweetAlertStyles.confirmButton}`,
//   //     cancelButton: `${sweetAlertStyles.cancelButton}`,
//   //     footer: `${sweetAlertStyles.footer}`,
//   //   },
//   //   buttonsStyling: false,
//   // });

//   Swal.fire({
//     toast: true,
//     position: 'top-end',
//     timer: 4000,
//     timerProgressBar: true,
//     title: title,
//     text: message,
//     icon: variant,
//     showConfirmButton: false,
//     customClass:{
//       container:`${sweetAlertStyles.container}`
//     }
//     // confirmButtonText: 'Cool'
//     // background: theme.palette.background.paper,
//     // onOpen: toast => {
//     //   toast.addEventListener('mouseenter', Swal.stopTimer);
//     //   toast.addEventListener('mouseleave', Swal.resumeTimer);
//     // }
//   })

//   // const theme = useTheme();
//   // const Toast = Swal.mixin({
//   //   toast: true,
//   //   position: 'top-end',
//   //   showConfirmButton: false,
//   //   timer: 4000,
//   //   timerProgressBar: true,
//   //   onOpen: toast => {
//   //     toast.addEventListener('mouseenter', Swal.stopTimer);
//   //     toast.addEventListener('mouseleave', Swal.resumeTimer);
//   //   },
//   // });

//   // Toast.fire({
//   //   icon: variant,
//   //   title: title,
//   //   background: theme.palette.background.paper,
//   // });
// }
