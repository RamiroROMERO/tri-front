import { IconButton, Stack, Typography } from '@mui/material'
import { Facebook, Instagram, WhatsApp } from '@mui/icons-material'
import React from 'react'
import { SocialMediaItem } from './SocialMediaItem'

export const SocialMedia = ({t}) => {
  return (
    <>
      <Typography variant={"body1"} mb={2}>{t("login.label.shareNetwork")}</Typography>
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <SocialMediaItem bgColor="#385196">
          <Facebook fontSize="small" />
        </SocialMediaItem>
        <SocialMediaItem bgColor="#EF4073">
          <Instagram fontSize="small" />
        </SocialMediaItem>
        <SocialMediaItem bgColor="#32BA46">
          <WhatsApp fontSize="small" />
        </SocialMediaItem>
      </Stack>
    </>
  )
}
