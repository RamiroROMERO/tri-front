import React, {useState} from 'react'
import { ListItemIcon, Menu, MenuItem } from '@mui/material'
import Language from '@mui/icons-material/Language'
import { useTranslation } from "react-i18next";
import { enUS, esES } from '@mui/material/locale';
import JumboIconButton from '@jumbo/components/JumboIconButton';

const LocalizationOptions = () => {

  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const languages = [
    {
      label: "English",
      locale: "en-US",
      muiLocale: enUS
    },
    {
      label: "Spanish",
      locale: "es-ES",
      muiLocale: esES
    }
  ]

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (lang)=>{
    const localeIndex = languages.findIndex(language => language.locale === lang);
    if (localeIndex !== -1) {
      i18n.changeLanguage(languages[localeIndex].locale).then(() => {
        localStorage.setItem('mw-language-selected', languages[localeIndex].locale);
      });
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <JumboIconButton
        elevation={25}
        onClick={handleClick}
        >
        <Language />
      </JumboIconButton>
        
      <Menu
        style={{top:'15px'}}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={()=>handleClose(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem id="lang-es-ES" onClick={()=>handleClose('es-ES')}>
        <ListItemIcon><span className="fi fi-hn"></span></ListItemIcon>
          {t('lang.spanish')}
        </MenuItem>
        <MenuItem id="lang-en-US" onClick={()=>handleClose('en-US')}>
          <ListItemIcon><span className='fi fi-us'></span></ListItemIcon>
          {t('lang.english')}
        </MenuItem>
      </Menu>
    </div>
    )
}

export default LocalizationOptions