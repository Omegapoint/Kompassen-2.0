import { Box, IconButton, Typography } from '@mui/material';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ReactElement, useContext } from 'react';
import { ReactComponent as AlarmCircled } from '../../assets/alarmCircled.svg';
import useAzureUser from '../../hooks/UseAzureUser';
import { padding } from '../../theme/Theme';
import Discussion from './Discussion';
import LectureContext from './LectureContext';

const formatTime = (d: Date): string => {
  const date = format(d, 'dd MMMM', { locale: sv });
  const time = format(d, 'HH:mm', { locale: sv });
  return `${date} kl. ${time}`;
};

const BottomContainer = (): ReactElement => {
  const { lecture } = useContext(LectureContext);
  const date = formatTime(lecture.createdAt);
  const { name } = useAzureUser(lecture.createdBy);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'max-content max-content 1fr max-content',
        gridTemplateAreas: `"title icon . info"
                            "content content content content"`,
        padding: padding.small,
        gridGap: `${padding.minimal}`,
      }}
    >
      <Typography sx={{ gridArea: 'title' }} variant="subtitle2">
        Diskussion
      </Typography>
      <IconButton sx={{ gridArea: 'icon', height: '25px', width: '25px' }} size="large">
        <div>
          <AlarmCircled height="25px" width="25px" />
        </div>
      </IconButton>
      <Typography
        sx={{ gridArea: 'info', maxWidth: '200px', textAlign: 'end' }}
        variant="subtitle1"
      >
        {/* {`Publicerat av ${name} ${date}`} */}
      </Typography>
      <Discussion />
    </Box>
  );
};

export default BottomContainer;
