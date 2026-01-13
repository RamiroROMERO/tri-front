import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid } from '@mui/material';
import { Modal } from 'app/components/Modal';
import { useUsers } from './useUsers';
import UserProfileCard from './UserCard/UserCard';
import ModalNew from './ModalNew';
import ModalChangePass from './ModalChangePass';
import { CheckBox } from 'app/components/Checkbox';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

const Content = ({ setLoading, sweetAlerts, setActions, controlAdmin }) => {

  const { t } = useTranslation();
  const { dataUsers, fnEditUser, fnChangePassUser, fnViewDetail, openModalNew, setOpenModalNew, fnGetData, currentItem, listTypes, openModalPass, setOpenModalPass, listCustomers, setOnlyActives, onlyActives } = useUsers({ setLoading, sweetAlerts, setActions, controlAdmin });

  const propsToModalNew = {
    title: 'dialog.users.title',
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: "sm",
    data: {
      sweetAlerts,
      setLoading,
      fnGetData,
      currentItem,
      listTypes,
      listCustomers
    }
  }

  const propsToModalPass = {
    title: 'dialog.editPass.title',
    DialogContent: ModalChangePass,
    open: openModalPass,
    setOpen: setOpenModalPass,
    maxWidth: "xs",
    data: {
      currentItem,
      sweetAlerts,
      setLoading
    }
  }

  // const fnChangeValueCheck = ({ target }) => {
  //   setOnlyActives(target.checked);
  // }

  useEffect(() => {

  }, [onlyActives])

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>

              <CheckBox
                name='onlyActives'
                value={onlyActives}
                onChange={({ target }) => { setOnlyActives(target.checked) }}
                label={t("checkbox.active")}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid >
      <Grid container spacing={3}>
        {dataUsers.map((user, key) => (
          <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
            <UserProfileCard user={user} fnEdit={fnEditUser} fnChangePass={fnChangePassUser} fnDetail={fnViewDetail} />
          </Grid>))
        }
      </Grid>
      <Modal {...propsToModalNew} />
      <Modal {...propsToModalPass} />
    </>
  )
}


export default Content;