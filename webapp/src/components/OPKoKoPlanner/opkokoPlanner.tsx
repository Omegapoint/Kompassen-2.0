import { Box, Button } from '@mui/material';
import { ReactElement, useState } from 'react';
import { CSVDownload } from 'react-csv';
import { useParams } from 'react-router-dom';
import exportLecturers from '../../lib/helpers/ExportLecturers';
import exportLectures from '../../lib/helpers/ExportLectures';
import RegisteredLectures from '../../section/competencedayPlanner/RegisteredLectures';
import useEventLecturesWS from '../../section/competencedayPlanner/UseEventLecturesWS';

const OPKoKoPlanner = (): ReactElement => {
  const { id } = useParams<'id'>();
  const lectures = useEventLecturesWS(id!);
  const [lecturersData, setLecturersData] =
    useState<Array<Array<string | null | boolean | Array<string>>>>();

  const [lecturesData, setLecturesData] =
    useState<Array<Array<string | null | boolean | Array<string>>>>();

  const fetchLecturersData = async () => {
    const CSVData = await exportLecturers(lectures);
    setLecturersData(CSVData);
  };

  const fetchLecturesData = async () => {
    const CSVData = await exportLectures(lectures);
    setLecturesData(CSVData);
  };

  // const test = async () => {
  //   getGraphUser({ id: 'e7d343d4-c655-4164-a50b-e6d97498c879' });
  // };

  return (
    <>
      {/* <Box sx={{ display: 'grid', justifyItems: 'right' }}>
        <Button color="primary" variant="contained" onClick={test}>
          Test
        </Button>
      </Box> */}
      <Box sx={{ display: 'grid', justifyItems: 'center' }}>
        <RegisteredLectures lectures={lectures} admin />
      </Box>
      <Box sx={{ display: 'grid', justifyItems: 'right' }}>
        <Button color="primary" variant="contained" onClick={fetchLecturersData}>
          Exportera talare
        </Button>
        {lecturersData != null ? <CSVDownload data={lecturersData} target="_blank" /> : null}
      </Box>
      <Box sx={{ display: 'grid', justifyItems: 'right' }}>
        <Button color="primary" variant="contained" onClick={fetchLecturesData}>
          Exportera pass
        </Button>
        {lecturesData != null ? <CSVDownload data={lecturesData} target="_blank" /> : null}
      </Box>
    </>
  );
};

export default OPKoKoPlanner;
