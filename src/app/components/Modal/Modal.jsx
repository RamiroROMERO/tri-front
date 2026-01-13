import React from 'react'
import { useTranslation } from 'react-i18next';
import { Dialog} from '@mui/material'
import { ModalHeader } from './ModalHeader'

export const Modal = (props) => {
  const {t} = useTranslation();
  const {title, DialogContent: Content, open, setOpen, maxWidth, data, setLoading} = props;

 const propsToDialog = {
  fullWidth:true,
  maxWidth,
  scroll:"paper",
  disableEscapeKeyDown:true,
  open
 }

  const modalContent = {
    handleClose:()=>setOpen(false),
    setLoading,
    setOpen,
    t,
    data
  }

  return (
    <Dialog
    {...propsToDialog}
    >
      <ModalHeader title={title} onClose={setOpen} /> 
      <Content {...modalContent}/>
    </Dialog>
  )
};