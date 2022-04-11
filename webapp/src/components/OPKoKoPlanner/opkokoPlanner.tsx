import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import RegisteredLectures from '../../section/competencedayPlanner/RegisteredLectures';
import useEventLecturesWS from '../../section/competencedayPlanner/UseEventLecturesWS';

const OPKoKoPlanner = (): ReactElement => {
  const { id } = useParams<'id'>();
  const lectures = useEventLecturesWS(id!);

  return (
    <Box sx={{ display: 'grid', justifyItems: 'center' }}>
      <RegisteredLectures lectures={lectures} admin />
    </Box>
  );
};

export default OPKoKoPlanner;
