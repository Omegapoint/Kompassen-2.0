import { createStyles, IconButton, makeStyles, Typography } from '@material-ui/core';
import { ChatBubble, Favorite, FavoriteBorder } from '@material-ui/icons';
import { ReactElement, useContext } from 'react';
import { useMutation } from 'react-query';
import { likeLecture, unlikeLecture } from '../../api/Api';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';
import Expander, { ExpanderProps } from './Expander';
import LectureContext from './LectureContext';

const useStyles = makeStyles(() =>
  createStyles({
    topContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr max-content min-content',
      gridTemplateAreas: `"infoBar icons icons"
                          "header header header"
                          "content content content"
                          "tags registerButton registerButton"
                          "expandButtonContainer expandButtonContainer expandButtonContainer"`,
      padding: padding.small,
      gridGap: `${padding.minimal} 0`,
      position: 'relative',
    },
    infoBar: {
      color: colors.grey,
      fontWeight: 300,
      fontSize: '1rem',
      gridArea: 'infoBar',
    },
    icons: {
      display: 'grid',
      gridArea: 'icons',
      gridAutoFlow: 'column',
      gridGap: padding.minimal,
      justifyContent: 'end',
    },
    icon: {
      width: '20px',
      height: '20px',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    header: {
      gridArea: 'header',
    },
    content: {
      gridArea: 'content',
    },
    tags: {
      display: 'flex',
      gridGap: padding.small,
      gridArea: 'tags',
    },
  })
);

const getAnnotation = (lecture: Lecture): string | undefined => {
  if (lecture.lecturer === null) return 'Söker passhållare';
  if (lecture.createdBy === lecture.lecturer) return 'Feedback önskas';
  return undefined;
};

const formatInfoBar = (location?: string | null, annotation?: string | null) =>
  [location, annotation].filter((e) => e).join(' • ');

const formatTags = (tags: string[]) =>
  tags.map((e) => (
    <Typography key={e} variant="subtitle2">
      #{e}
    </Typography>
  ));

const TopContainer = ({ isExpanded, expand }: ExpanderProps): ReactElement => {
  const classes = useStyles({ isExpanded });
  const { lecture, chat } = useContext(LectureContext);
  const annotation = getAnnotation(lecture);
  const user = useAppSelector((state) => state.user);
  const locations = useAppSelector((state) => state.locations);
  const location = locations.find((e) => e.id === lecture.locationID)?.name as string;

  const likes = lecture.likes?.length || 0;

  const likeMutation = useMutation(likeLecture);
  const unlikeMutation = useMutation(unlikeLecture);

  const like = () => {
    likeMutation.mutate({ id: lecture.id });
  };

  const unlike = () => {
    unlikeMutation.mutate({ id: lecture.id });
  };
  return (
    <div className={classes.topContainer}>
      <Typography className={classes.infoBar} variant="subtitle1">
        {formatInfoBar(location, annotation)}
      </Typography>
      <div className={classes.icons}>
        <div className={classes.iconContainer}>
          <IconButton className={classes.icon}>
            <ChatBubble className={classes.icon} color="primary" />
          </IconButton>
          <Typography color="primary">{chat.length || 0}</Typography>
        </div>
        <div className={classes.iconContainer}>
          {lecture.likes?.includes(user.id) ? (
            <IconButton className={classes.icon} onClick={unlike}>
              <Favorite className={classes.icon} color="primary" />
            </IconButton>
          ) : (
            <IconButton className={classes.icon} onClick={like}>
              <FavoriteBorder className={classes.icon} color="primary" />
            </IconButton>
          )}
          <Typography color="primary">{likes}</Typography>
        </div>
      </div>

      <Typography className={classes.header} variant="h6">
        {lecture.title}
      </Typography>

      <Typography className={classes.content}>{lecture.description}</Typography>
      <div className={classes.tags}>{formatTags(lecture.tags)}</div>
      <Expander isExpanded={isExpanded} expand={expand} />
    </div>
  );
};

export default TopContainer;
