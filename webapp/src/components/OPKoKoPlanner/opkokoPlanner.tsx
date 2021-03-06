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
    const onlyAcceptedLectures = lectures.filter(
      (lecture) =>
        lecture.status?.statusID === '0c1140aa-c623-4ae1-9b91-c3e4bcfd255b' ||
        lecture.status?.statusID === 'b941b42c-f76d-44a3-9fc5-ffce17edef39'
    );
    const CSVData = await exportLecturers(onlyAcceptedLectures);
    setLecturersData(CSVData);
  };

  const fetchLecturesData = async () => {
    const CSVData = await exportLectures(lectures);
    setLecturesData(CSVData);
  };

  return (
    <>
      <Box sx={{ display: 'grid', justifyItems: 'center' }}>
        <RegisteredLectures lectures={lectures} admin opkoko />
      </Box>
      <Box sx={{ display: 'grid', justifyItems: 'right' }}>
        <Button color="primary" variant="contained" onClick={fetchLecturersData}>
          Exportera talare
        </Button>
        {lecturersData != null ? (
          <CSVDownload data={lecturersData} separator=";" target="_blank" />
        ) : null}
      </Box>
      <Box sx={{ display: 'grid', justifyItems: 'right' }}>
        <Button color="primary" variant="contained" onClick={fetchLecturesData}>
          Exportera pass
        </Button>
        {lecturesData != null ? (
          <CSVDownload data={lecturesData} separator=";" target="_blank" />
        ) : null}
      </Box>
    </>
  );
};

export default OPKoKoPlanner;
