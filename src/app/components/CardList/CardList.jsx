import React from 'react'
import {useTranslation} from "react-i18next";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import ListItems from './ListItems';

const CardList = ({title, dataList, selectedIndex, setSelectedIndex}) => {
  const { t } = useTranslation();

  return (
    <JumboCardQuick
      title={t(title)}
      wrapperSx={{ p: 0 }}
      noWrapper={true}
      sx={{boxShadow:0}}
      headerSx={{p: theme => theme.spacing(2, 1)}}
    >
      <JumboScrollbar
        autoHeight
        autoHide
        autoHideDuration={200}
        autoHideTimeout={500}
        autoHeightMax={356}
      >
        <ListItems dataList={dataList} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
      </JumboScrollbar>
    </JumboCardQuick>
  );
}

export default CardList