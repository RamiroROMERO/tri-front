import React from 'react'
import Header from "./Header";
import JumboContentLayout from "@jumbo/components/JumboContentLayout";
import {useJumboTheme} from "@jumbo/hooks";
import {alpha} from "@mui/material/styles";
import { ASSET_IMAGES } from "app/utils/constants/paths";
import { useTranslation } from 'react-i18next';
import { Modal } from 'app/components/Modal';
import Privileges from './Components/Privileges';
import UserProfileSidebar from "./UserProfileSidebar";
import { useUserProfile } from './useUserProfile';
import ModalNew from '../ModalNew';

const Content = ({setLoading, sweetAlerts, userId, setActions, controlAdmin}) => {
  const {theme} = useJumboTheme();
  const {t} = useTranslation();

  const {typeUser, listModules, moduleId, setModuleId, typePrivilege, onTypePrivilegeChange, fnEditUser, openModalEditUser, setOpenModalEditUser, listTypes, fnGetDataUser, currentItem} = useUserProfile({setLoading, userId, setActions});

  const propsToHeader = {
    currentItem,
    t,
    fnEditUser
  }

  const propsToUserProfile = {
    t,
    currentItem,
    typeUser,
    userId,
    sweetAlerts,
    setLoading
  }

  const propsToPrivileges = {
    t,
    listModules,
    moduleId,
    setModuleId,
    typePrivilege,
    onTypePrivilegeChange,
    setLoading,
    userId,
    sweetAlerts,
    currentItem,
    controlAdmin
  }

  const propsToModalEditUser = {
    title: 'dialog.users.title',
    DialogContent: ModalNew,
    open: openModalEditUser,
    setOpen: setOpenModalEditUser,
    maxWidth: "sm",
    data:{
      sweetAlerts,
      setLoading,
      fnGetData:fnGetDataUser,
      currentItem,
      listTypes
    }
  }

  return (
    <>
    <JumboContentLayout
      header={<Header {...propsToHeader}/>}
      sidebar={<UserProfileSidebar {...propsToUserProfile}/>}
      layoutOptions={{
        header: {
          sx: {
            mt: -4,
            mb: -7.25,
            mx: {xs: -4, lg: -6},
            p: {xs: theme.spacing(5, 4, 9), lg: theme.spacing(5, 6, 9)},
            background: `#002447 url(${`${ASSET_IMAGES}/banner_users.jpg`}) no-repeat center`,
            backgroundSize: 'cover',
            color: 'common.white',
            position: 'relative',

            '&::after': {
              display: 'inline-block',
              position: 'absolute',
              content: `''`,
              inset: 0,
              backgroundColor: alpha(theme.palette.common.black, .65)
            }
          }
        },
        sidebar: {
          sx: {
            mr: 3,
            mb: 3,
            width: {xs: '100%', lg: '33%', xl: '25%'},
            [theme.breakpoints.down('lg')]: {
              minHeight: 0,
              mr: 0
            }
          }
        },
        wrapper: {
          sx: {
            [theme.breakpoints.down('lg')]: {
              flexDirection: 'column'
            }
          }
        },
        main: {
          sx: {
            [theme.breakpoints.down('lg')]: {
              minHeight: 0
            }
          }
        }
      }}
    >
      <Privileges {...propsToPrivileges}/>
    </JumboContentLayout>
    <Modal {...propsToModalEditUser}/>
    </>
  )
}

export default Content