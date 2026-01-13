import { Icon } from '@mui/material';
import { request } from 'app/utils/core';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

export const useUsers = ({ setLoading, sweetAlerts, setActions, controlAdmin }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dataUsers, setDataUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([])
  const [listTypes, setListTypes] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openModalPass, setOpenModalPass] = useState(false);
  const [onlyActives, setOnlyActives] = useState(true);

  const fnGetData = () => {
    setLoading(true);
    request.GET('/users', (resp) => {
      const { users } = resp;
      const dataUsers = users.map((item) => {
        item.userType = item.type === 1 ? "Administrator" : (item.type === 2 ? "Supervisor" : "Digitizer")
        return item;
      });
      setAllUsers(dataUsers);
      if (onlyActives === true) {
        setDataUsers(dataUsers.filter(user => user.status === 1));
      } else {
        setDataUsers(dataUsers);
      }
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnNew = () => {
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem({});
    setOpenModalNew(true);
  }

  const fnEditUser = (item) => {
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setOpenModalNew(true);
  }

  const fnChangePassUser = (item) => {
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setOpenModalPass(true);
  }

  const fnViewDetail = (item) => {
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    navigate(`/settings/users/userProfile/${item.id}`, {
      replace: true
    });
  }

  const fnMenuOptions = () => {
    let actions = [
      { icon: () => <Icon>add</Icon>, name: 'button.add', onClick: fnNew }
    ];
    setActions(actions)
  }

  useEffect(() => {
    fnGetData();
    fnMenuOptions();
    setListTypes([
      { value: 1, label: "Administrator" },
      { value: 2, label: "Supervisor" },
      { value: 3, label: "Digitizer" }
    ]);
  }, []);

  useEffect(() => {
    if (onlyActives === true) {
      setDataUsers(allUsers.filter(user => user.status === 1));
    } else {
      setDataUsers(allUsers);
    }
  }, [onlyActives]);

  return (
    {
      dataUsers,
      fnEditUser,
      fnChangePassUser,
      fnViewDetail,
      openModalNew,
      setOpenModalNew,
      listTypes,
      openModalPass,
      setOpenModalPass,
      fnGetData,
      currentItem,
      onlyActives,
      setOnlyActives
    }
  )
}
