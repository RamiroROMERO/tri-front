import React from 'react';
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Div from "@jumbo/shared/Div";

const JumboSearch = ({ onChange, value, sx }) => {
  const { t } = useTranslation();
  const [searchKeywords, setSearchKeywords] = React.useState('');
  const handleChange = (e) => {
    setSearchKeywords(e.target.value);
  };

  React.useEffect(() => {
    onChange(searchKeywords);
  }, [searchKeywords]);

  return (
    <Div sx={{
      position: 'relative',
      borderRadius: 24,
      backgroundColor: theme => theme.palette.grey.A100,
      width: '100%',
      ...sx
    }}>
      <Div sx={{
        padding: theme => theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <SearchIcon />
      </Div>
      <InputBase
        sx={{
          color: 'inherit',
          display: 'flex',
          '& .MuiInputBase-input': {
            padding: theme => theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: theme => `calc(1em + ${theme.spacing(4)})`,
            transition: theme => theme.transitions.create('width'),
            width: '100%',
            height: 24
          },
        }}
        placeholder={t("input.search")}
        inputProps={{ 'aria-label': t("input.search") }}
        onChange={handleChange}
        value={searchKeywords}
      />
    </Div>
  );
};

export default React.memo(JumboSearch);
