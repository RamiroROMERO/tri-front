import { IconButton } from '@mui/material'
import React from 'react'

export const SocialMediaItem = ({bgColor, children}) => {
  return (
    <IconButton sx={{
      bgcolor: bgColor,
      color: 'common.white',
      p: theme => theme.spacing(1.25),

      '&:hover': {
        backgroundColor: bgColor,
      }
    }} aria-label="Facebook">
      {children}
    </IconButton>
  )
}
