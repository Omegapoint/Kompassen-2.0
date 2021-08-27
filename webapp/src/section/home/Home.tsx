import { Button, makeStyles, Typography } from '@material-ui/core';
import { ReactElement, useEffect, useState } from 'react';
import CompetenceDays from '../../components/competenceDays/CompetenceDays';
import Filter from '../../components/filter/Filter';
import Interested from '../../components/interested/Interested';
import LatestLectures from '../../components/latestLectures/LatestLectures';
import PublishIdea from '../../components/publishIdea/PublishIdea';
import SideCard from '../../components/sideCard/SideCard';
import WordCloud from '../../components/wordCloud/WordCloud';
import useBoolean from '../../hooks/UseBoolean';
import useUnmount from '../../hooks/UseUnmount';
import { formatDates, isAdmin, useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr max-content',
    gridTemplateRows: 'max-content auto auto auto auto',
    gridGap: `${padding.medium} ${padding.large}`,
    padding: '0 20px',
    '& > :nth-child(1)': {
      gridColumn: '1 / 3',
    },
  },
  leftPanel: {
    display: 'grid',
    gridGap: padding.standard,
    alignContent: 'start',
  },
  rightPanel: {
    display: 'grid',
    width: '320px',
    gridGap: padding.standard,
    alignContent: 'start',
  },
  button: {
    fontSize: '0.95rem',
    padding: padding.minimal,
  },
  emptyContainer: {
    display: 'grid',
    justifyContent: 'center',
    alignContent: 'center',
    minHeight: '300px',
  },
}));

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

const Home = (): ReactElement => {
  const [active, { off, on }] = useBoolean();
  const classes = useStyles();
  const lectureIdeas = useLectureIdeasWS();

  return (
    <div className={classes.container}>
      <Typography variant="h1">Idéer till kompetensdagar</Typography>
      <div className={classes.leftPanel}>
        {active && <PublishIdea cancel={off} />}
        {!active && (
          <Button onClick={on} className={classes.button} variant="contained" color="primary">
            Publicera ny idé
          </Button>
        )}
        {lectureIdeas?.length ? (
          <Filter lectures={lectureIdeas} />
        ) : (
          <div className={classes.emptyContainer}>
            <Typography variant="h5">Här var det tomt.</Typography>
          </div>
        )}
      </div>
      <div className={classes.rightPanel}>
        {isAdmin() && (
          <SideCard hrefText="Planera kompetensdagar" hrefBarColor={colors.blue} href="/events" />
        )}

        <SideCard
          title="Nästa kompetensdag"
          hrefText="Anmäl pass till kompetensdagar"
          hrefBarColor={colors.orange}
          href="/lecture/create"
        >
          <CompetenceDays />
        </SideCard>
        <SideCard
          title="Mina senaste pass"
          hrefText="Hantera mina anmälda pass "
          href="/lecture/user"
        >
          <LatestLectures />
        </SideCard>
        <SideCard title="Trendar just nu">
          <WordCloud />
        </SideCard>
        <SideCard title="Funderar på att hålla i ett pass?">
          <Interested />
        </SideCard>
        {/* TODO: Add some content to this */}
        {/* <SideCard title="Snabbguide för KomPass 2.0"> */}
        {/*  <QuickGuide /> */}
        {/* </SideCard> */}
        {/* <SideCard title="Nuvarande planerare"> */}
        {/*  <CurrentPlanner /> */}
        {/* </SideCard> */}
      </div>
    </div>
  );
};

export default Home;
