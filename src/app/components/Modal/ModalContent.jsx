import Div from '@jumbo/shared/Div'
import { DialogContent } from '@mui/material'
import React from 'react'

export const ModalContent = ({ children }) => {
  return (
    <DialogContent dividers>
      {children}
    </DialogContent>
  );
}
