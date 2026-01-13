import React from 'react'
import { DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

export const ModalHeader = ({title, onClose}) => {
  const {t} = useTranslation()
  return (
    <>
      <DialogTitle>{t(title)}
      <IconButton
          aria-label="close"
          onClick={()=> onClose(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
    </>
  )
}
