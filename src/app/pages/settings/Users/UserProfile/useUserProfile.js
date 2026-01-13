import { useEffect, useState } from 'react'
import { request } from 'app/utils/core';
import { Icon } from '@mui/material';
import { useNavigate } from "react-router-dom";

export const useUserProfile = ({userId, setLoading, setActions}) => {
  const navigate = useNavigate();
  const [typeUser, setTypeUser] = useState('');
  const [moduleId, setModuleId] = useState(1);
  const [typePrivilege, setTypePrivilege] = useState(0);
  const [currentItem, setCurrentItem] = useState({});
  const [listModules, setListModules] = useState([]);
  const [listTypes, setListTypes] = useState([]);
  const [openModalEditUser, setOpenModalEditUser] = useState(false);

  const fnEditUser = ()=>{
    setOpenModalEditUser(true);
  }

  const fnGetDataUser = ()=>{
    setLoading(true);
    request.GET(`/users/${userId}`, (resp)=>{
      const {user} = resp;
      setCurrentItem(user);
      setTypeUser(user.type===1?"Administrator":(user.type===2?"Supervisor":"Digitizer"));
      setListModules(user.modules);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const onTypePrivilegeChange = (event, newValue) => {
    setTypePrivilege(newValue);
  };

  const fnReturnUser = ()=>{
    navigate('/settings/users/', {
      replace:true
    });
  }

  const fnMenuOptions = () => {
    let actions = [
      { icon: () => <Icon>arrow_back</Icon>, name: 'button.backToUsers', onClick: fnReturnUser }
    ];
    setActions(actions)
  }

  useEffect(()=>{
    fnGetDataUser();
    fnMenuOptions();
    setListTypes([
      {value: 1, label: "Administrator"},
      {value: 2, label: "Supervisor"},
      {value: 3, label: "Digitizer"}
    ]);
  },[]);

  return (
    {
      typeUser,
      listModules,
      moduleId,
      setModuleId,
      typePrivilege,
      onTypePrivilegeChange,
      fnEditUser,
      openModalEditUser,
      setOpenModalEditUser,
      listTypes,
      fnGetDataUser,
      currentItem
    }
  )
}
