import { Box, Button, Typography } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import Filter from '../../components/filter/Filter';
import PublishIdea from '../../components/publishIdea/PublishIdea';
import useBoolean from '../../hooks/UseBoolean';
import useUnmount from '../../hooks/UseUnmount';
import { formatDates, useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';

const useLectureIdeasWS = () => {
  const socket = useAppSelector((state) => state.session.socket);
  const [lectureIdeas, setLectureIdeas] = useState<Lecture[]>([]);
  const mounted = useUnmount();

  useEffect(() => {
    if (socket) {
      socket.on('lectureIdeas', (lectures) => {
        if (mounted.current) {
          setLectureIdeas(formatDates(lectures).filter((ideas: { lecturer: null; })=> ideas.lecturer === null));
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

const HomeOPKoKo = (): ReactElement => {
  const [active, { off, on }] = useBoolean();
  const lectureIdeas = useLectureIdeasWS();

  return (
    <>
      <Typography variant="h1" sx={{ gridColumn: 'span 2' }}>
        Har du en idé om något du vill höra på OPKoKo?
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridGap: padding.standard,
          alignContent: 'start',
        }}
      >
        {active && <PublishIdea cancel={off} opkoko />}
        {!active && (
          <>
            <Button
              onClick={on}
              sx={{ fontSize: '0.95rem', padding: padding.minimal }}
              variant="contained"
              color="primary"
            >
              Publicera ny idé
            </Button>
            <Typography variant="h6">
              Vi har enorm kompetens här på Omegapoint, och för att vi alla ska kunna förkovra oss
              så kan det vara en bra idé att hinta för dina kollegor om vad du vill utvecklas inom.
              Hjälp oss alla genom att lyfta dina önskade kompetenspass här, så kan vi alla
              tillsammans hjälpas åt att sprida sådan kompetens!
            </Typography>
          </>
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

export default HomeOPKoKo;
