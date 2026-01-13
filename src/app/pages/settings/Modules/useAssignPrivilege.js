import React, { useEffect, useState } from 'react'
import { Icon } from '@mui/material';
import { request } from 'app/utils/core';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Delete, Edit } from '@mui/icons-material';

export const useAssignPrivilege = ({moduleId, setLoading, sweetAlerts, t}) => {
  const [listPrivileges, setListPrivileges] = useState([]);
  const [listUserTypePrivileges, setListUserTypePrivileges] = useState([]);
  const [dataPrivGeneral, setDataPrivGeneral] = useState([]);
  const [dataPrivAdmin, setDataPrivAdmin] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [typePrivilege, setTypePrivilege] = useState(0);
  const [openModalNewPrivilege, setOpenModalNewPrivilege] = useState(false);
  const [openMsgDeletePriv, setOpenMsgDeletePriv] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [titleModalNew, setTitleModalNew] = useState('');

  const onTypePrivilegeChange = (event, newValue) => {
    setTypePrivilege(newValue);
  };

  const fnGetDataPrivileges = ()=>{
    setLoading(true);
    request.GET(`/usersTypesPrivileges`, (resp)=>{
      let privileges = resp.usersTypesPrivileges;

      // filtrar privilegios por modulo
      let filter = privileges.filter(item => {
        return item.privilege.module.id === moduleId
      });

      setListUserTypePrivileges(filter);

      // filtrar privilegios por tipo
      let generalPrivileges = filter.filter(item => {
        return item.isAdmin === 0;
      });

      let adminPrivileges = filter.filter(item => {
        return item.isAdmin === 1;
      });

      // llenar tabla
      const dataGeneral = generalPrivileges.map((item) => {
        item.privilegeName = item.privilege.name
        item.typeUser = item.userType.name
        item.optCreateIcon = item.optCreate == 1 ? "check_box" : "check_box_outline_blank";
        item.optUpdateIcon = item.optUpdate == 1 ? "check_box" : "check_box_outline_blank";
        item.optDeleteIcon = item.optDelete == 1 ? "check_box" : "check_box_outline_blank";
        return item;
      });

      const dataPriv = adminPrivileges.map((item) => {
        item.privilegeName = item.privilege.name
        item.typeUser = item.userType.name
        return item;
      });

      setDataPrivGeneral(dataGeneral);
      setDataPrivAdmin(dataPriv);

      setLoading(false);
    }, (err)=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  }

  const fnNewPrivilege = ()=>{
    setCurrentItem({});
    setTitleModalNew("dialog.addPrivileges.title");
    setOpenModalNewPrivilege(true);
  }

  const fnEditGeneral = (item)=>{
    setCurrentItem(item);
    setTitleModalNew("dialog.editPrivileges.title");
    setOpenModalNewPrivilege(true);
  }

  const fnDeletePrivilege = (item)=>{
    setCurrentItem(item);
    setOpenMsgDeletePriv(true);
  }

  const fnOnOkDeletePrivilege = ()=>{
    setLoading(true);
    request.DELETE(`/usersTypesPrivileges`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetDataPrivileges();
      setLoading(false);
    }, err=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    },{id: currentItem.id});
  }

  const tableGeneral = {
    title: "",
    columns: [
      {field: 'privilegeName', headerName: t('table.privileges.title'), flex: 1 },
      {field: 'typeUser', headerName: t('table.users.column.type') , flex: 0.8 },
      {field: 'optCreateIcon', headerName: t('table.users.detail.optCreate'), flex: 0.5,
        renderCell: ({row, field})=>{
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {field: 'optUpdateIcon', headerName: t('table.users.detail.optUpdate'), flex: 0.5,
        renderCell: ({row, field})=>{
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {field: 'optDeleteIcon', headerName: t('table.users.detail.optDelete'), flex: 0.5,
        renderCell: ({row, field})=>{
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnEditGeneral(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label= {t("button.delete")}
            onClick={() => fnDeletePrivilege(row)}
            color='error'
          />
        ],
      }
    ],
    data: dataPrivGeneral,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    },
    freeActions: [
      {
        Icon: () => <Add />,
        label: t("datatable.buttons.newDocument"),
        onClick: fnNewPrivilege
      }
    ]
  };

  const tableAdmin = {
    title: "",
    columns: [
      {field: 'privilegeName', headerName: t('table.privileges.title'), flex: 1},
      {field: 'typeUser', headerName: t('table.users.column.type'), flex: 0.5},
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Delete />}
            label= {t("button.delete")}
            onClick={() => fnDeletePrivilege(row)}
            color='error'
          />
        ],
      }
    ],
    data: dataPrivAdmin,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    },
    freeActions: [
      {
        Icon: () => <Add />,
        label: t("datatable.buttons.newDocument"),
        onClick: fnNewPrivilege
      }
    ]
  };


  useEffect(()=>{
    fnGetDataPrivileges();

    setLoading(true);
    request.GET('/userTypes', (resp)=>{
      const listType = resp.userTypes.map((item)=>{
        return {
          value: item.id,
          label: item.name
        }
      });
      setTypeList(listType);

      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET(`/modules?id=${moduleId}`, (resp)=>{
      const {modules} = resp;
      const listPriv = modules[0].privileges.map((item)=>{
        item.checked = true
        return item;
      });

      setListPrivileges(listPriv);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  },[]);

  return (
    {
      tableGeneral,
      tableAdmin,
      typePrivilege,
      onTypePrivilegeChange,
      openModalNewPrivilege,
      setOpenModalNewPrivilege,
      typeList,
      openMsgDeletePriv,
      setOpenMsgDeletePriv,
      fnOnOkDeletePrivilege,
      fnGetDataPrivileges,
      currentItem,
      listPrivileges,
      listUserTypePrivileges,
      titleModalNew
    }
  )
}
