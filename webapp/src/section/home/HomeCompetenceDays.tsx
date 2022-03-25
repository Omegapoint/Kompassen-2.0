import { Box, Button, Typography } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import CompetenceDays from '../../components/competenceDays/CompetenceDays';
import Filter from '../../components/filter/Filter';
import LatestLectures from '../../components/latestLectures/LatestLectures';
import PublishIdea from '../../components/publishIdea/PublishIdea';
import SideCard from '../../components/sideCard/SideCard';
import WordCloud from '../../components/wordCloud/WordCloud';
import useBoolean from '../../hooks/UseBoolean';
import useUnmount from '../../hooks/UseUnmount';
import { formatDates, isAdmin, useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';

const useLectureIdeasWS = () => {
  const socket = useAppSelector((state) => state.session.socket);
  const [lectureIdeas, setLectureIdeas] = useState<Lecture[]>([]);
  const mounted = useUnmount();

  useEffect(() => {
    if (socket) {
      socket.on('lectureIdeas', (lectures) => {
        if (mounted.current) {
          setLectureIdeas(formatDates(lectures));
        }
      });

      socket.on('lectureIdeas/update', (lecture: Lecture) => {
        if (mounted.current) {
          setLectureIdeas((ideas) =>
            ideas.map((e) => (e.id === lecture.id ? formatDates(lecture) : e))
          );
        }
      });

      socket.on('lectureIdeas/create', (lecture: Lecture) => {
        if (mounted.current) {
          setLectureIdeas((ideas) => [formatDates(lecture), ...ideas]);
        }
      });

      socket.on('lectureIdeas/delete', (lecture: Lecture) => {
        if (mounted.current) {
          setLectureIdeas((ideas) => ideas.filter((e) => e.id !== lecture.id));
        }
      });
      socket.emit('lectureIdeas');
    }
    return () => {};
  }, [mounted, socket]);

  return lectureIdeas;
};

const HomeCompetenceDays = (): ReactElement => {
  const [active, { off, on }] = useBoolean();
  const lectureIdeas = useLectureIdeasWS();

  return (
<>
<Typography variant="h1" sx={{ gridColumn: 'span 2' }}>
        Idéer till kompetensdagar
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridGap: padding.standard,
          alignContent: 'start',
        }}
      >
        {active && <PublishIdea cancel={off} opkoko={false} />}
        {!active && (
          <Button
            onClick={on}
            sx={{ fontSize: '0.95rem', padding: padding.minimal }}
            variant="contained"
            color="primary"
          >
            Publicera ny idé
          </Button>
        )}
        {lectureIdeas?.length ? (
          <Filter lectures={lectureIdeas} />
        ) : (
          <Box
            sx={{
              display: 'grid',
              justifyContent: 'center',
              alignContent: 'center',
              minHeight: '300px',
            }}
          >
            <Typography variant="h5">Här var det tomt.</Typography>
          </Box>
        )}
      </Box>
     
    </>
  );
};

export default HomeCompetenceDays;
