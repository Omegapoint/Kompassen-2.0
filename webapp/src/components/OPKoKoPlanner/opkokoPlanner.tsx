import { Box, Button } from '@mui/material';
import { ReactElement, useState } from 'react';
import { CSVDownload } from 'react-csv';
import { useParams } from 'react-router-dom';
import exportLecturers from '../../lib/helpers/ExportHelper';
import RegisteredLectures from '../../section/competencedayPlanner/RegisteredLectures';
import useEventLecturesWS from '../../section/competencedayPlanner/UseEventLecturesWS';

const OPKoKoPlanner = (): ReactElement => {
  const { id } = useParams<'id'>();
  const lectures = useEventLecturesWS(id!);
  const [lecturerData, setLecturerData] =
    useState<Array<Array<string | null | boolean | Array<string>>>>();

  const fetchData = async () => {
    const CSVData = await exportLecturers(lectures);
    setLecturerData(CSVData);
  };

  return (
    <>
      <Box sx={{ display: 'grid', justifyItems: 'center' }}>
        <RegisteredLectures lectures={lectures} admin />
      </Box>
      <Box sx={{ display: 'grid', justifyItems: 'right' }}>
        <Button color="primary" variant="contained" onClick={fetchData}>
          Exportera talare
        </Button>
        {lecturerData != null ? <CSVDownload data={lecturerData} target="_blank" /> : null}
      </Box>
    </>
  );
};

export default OPKoKoPlanner;
