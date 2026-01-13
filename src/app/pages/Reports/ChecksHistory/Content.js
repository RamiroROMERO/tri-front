import React, { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { ModalViewDetail } from './ModalViewDetail';
import { Modal } from 'app/components';
import { useChecksHistory } from './useChecksHistory';
import HeaderSection from './HeaderSection';
import FooterSection from './FooterSection';

const Content = ({ setLoading, sweetAlerts, screenControl }) => {

  const [totalCheks, setTotalChecks] = useState('0.00');

  const { table, propsToHeader, currentItem, openModalViewDetail, setOpenModalViewDetail } = useChecksHistory({ setLoading, sweetAlerts, screenControl });

  const propsToModalViewDetail = {
    title: 'dialog.detailChecks.title',
    DialogContent: ModalViewDetail,
    open: openModalViewDetail,
    setOpen: setOpenModalViewDetail,
    maxWidth: 'sm',
    data: {
      currentItem
    }
  };

  return (
    <>
      <HeaderSection {...propsToHeader} setTotalCheks={setTotalChecks} />
      <Card>
        <CardContent>
          <XDataGrid {...table} />
        </CardContent>
      </Card>
      <FooterSection totalChecks={totalCheks} />
      <Modal {...propsToModalViewDetail} />
    </>
  )
}

export default Content