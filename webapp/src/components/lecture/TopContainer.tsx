import { ReactElement, useContext, useState } from 'react';
import { createStyles, IconButton, makeStyles, Typography } from '@material-ui/core';
import { ChatBubble, Favorite, FavoriteBorder } from '@material-ui/icons';
import { colors, padding } from '../../theme/Theme';
import Expander, { ExpanderProps } from './Expander';
import { Lecture } from '../../lib/Types';
import { useLikeLecture, useUnlikeLecture } from '../../lib/Hooks';
import LectureContext from './LectureContext';
import UserContext from '../../UserContext';

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
  const { user } = useContext(UserContext);
  const annotation = getAnnotation(lecture);
  const [liked, setLiked] = useState(lecture.likes?.includes(user.id) || false);

  const likes = (lecture.likes?.filter((e) => e !== user.id).length || 0) + (liked ? 1 : 0);

  const [, likeRequest] = useLikeLecture();
  const [, unlikeRequest] = useUnlikeLecture();

  const like = () => {
    setLiked(true);
    likeRequest({ urlParams: { id: lecture.id } });
  };

  const unlike = () => {
    setLiked(false);
    unlikeRequest({ urlParams: { id: lecture.id } });
  };
  return (
    <div className={classes.topContainer}>
      <Typography className={classes.infoBar} variant="subtitle1">
        {formatInfoBar(lecture.location, annotation)}
      </Typography>
      <div className={classes.icons}>
        <div className={classes.iconContainer}>
          <IconButton className={classes.icon}>
            <ChatBubble className={classes.icon} color="primary" />
          </IconButton>
          <Typography color="primary">{chat.length || 0}</Typography>
        </div>
        <div className={classes.iconContainer}>
          {liked ? (
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
