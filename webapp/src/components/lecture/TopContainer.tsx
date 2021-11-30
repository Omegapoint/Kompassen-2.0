import { ChatBubble, Favorite, FavoriteBorder } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { ReactElement, useContext } from 'react';
import { useMutation } from 'react-query';
import { likeLecture, unlikeLecture } from '../../api/Api';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';
import Expander, { ExpanderProps } from './Expander';
import LectureContext from './LectureContext';

const iconContainerStyle = { display: 'flex', alignItems: 'center' };
const iconStyle = { width: '20px', height: '20px' };

const getAnnotation = (lecture: Lecture): string | undefined =>
  lecture.lecturer === null ? 'Söker passhållare' : 'Feedback önskas';

const formatInfoBar = (location?: string | null, annotation?: string | null) =>
  [location, annotation].filter((e) => e).join(' • ');

const formatTags = (tags: string[]) =>
  tags.map((e) => (
    <Typography key={e} variant="subtitle2">
      #{e}
    </Typography>
  ));

const TopContainer = ({ isExpanded, expand }: ExpanderProps): ReactElement => {
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
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr max-content min-content',
        gridTemplateAreas: `"infoBar icons icons"
                          "header header header"
                          "content content content"
                          "tags registerButton registerButton"
                          "expandButtonContainer expandButtonContainer expandButtonContainer"`,
        gridGap: `${padding.minimal} 0`,
        position: 'relative',
      }}
    >
      <Typography
        sx={{
          color: colors.grey,
          fontWeight: 300,
          fontSize: '1rem',
          gridArea: 'infoBar',
        }}
        variant="subtitle1"
      >
        {formatInfoBar(location, annotation)}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridArea: 'icons',
          gridAutoFlow: 'column',
          gridGap: padding.minimal,
          justifyContent: 'end',
        }}
      >
        <Box sx={iconContainerStyle}>
          <IconButton sx={iconStyle} size="large">
            <ChatBubble sx={iconStyle} color="primary" />
          </IconButton>
          <Typography color="primary">{chat.length || 0}</Typography>
        </Box>
        <Box sx={iconContainerStyle}>
          {lecture.likes?.includes(user.id) ? (
            <IconButton sx={iconStyle} onClick={unlike} size="large">
              <Favorite sx={iconStyle} color="primary" />
            </IconButton>
          ) : (
            <IconButton sx={iconStyle} onClick={like} size="large">
              <FavoriteBorder sx={iconStyle} color="primary" />
            </IconButton>
          )}
          <Typography color="primary">{likes}</Typography>
        </Box>
      </Box>

      <Typography sx={{ gridArea: 'header' }} variant="h6">
        {lecture.title}
      </Typography>

      <Typography sx={{ gridArea: 'content' }}>{lecture.description}</Typography>
      <Box sx={{ display: 'flex', gridGap: padding.small, gridArea: 'tags' }}>
        {formatTags(lecture.tags)}
      </Box>
      <Expander isExpanded={isExpanded} expand={expand} />
    </Box>
  );
};

export default TopContainer;
