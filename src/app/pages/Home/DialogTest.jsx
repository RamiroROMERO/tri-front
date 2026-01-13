import React from 'react'

import { ModalContent } from 'app/components/Modal/ModalContent'
import { Button, DialogActions } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// import ToastAlert from 'app/components/ToastAlert';

export const DialogTest = (props) => {
  const {setOpen, data} = props;
  const {listUsers, setLoading, sweetAlerts} = data;
  return (
    <>
    <ModalContent>
      <p>Contenido de la Modal.</p>
      {/* {listUsers.map(elem=>{
        return <p key={elem.id}>{elem.name}</p>
      })}
      {listUsers.map(elem=>{
        return <p key={elem.id}>{elem.name}</p>
      })}
      {listUsers.map(elem=>{
        return <p key={elem.id}>{elem.name}</p>
      })}
      {listUsers.map(elem=>{
        return <p key={elem.id}>{elem.name}</p>
      })}
      {listUsers.map(elem=>{
        return <p key={elem.id}>{elem.name}</p>
      })}
      {listUsers.map(elem=>{
        return <p key={elem.id}>{elem.name}</p>
      })} */}
    </ModalContent>
    <DialogActions>
      <Button variant='contained' color='secondary' startIcon={<ExitToAppIcon />} disableElevation onClick={()=>sweetAlerts('error', 'Mensaje de Error!')} >Salir</Button>
      <Button variant='contained' color='success' startIcon={<SaveIcon />} disableElevation onClick={() => setOpen(false)}>Guardar</Button>
    </DialogActions>
    </>
  )
}
