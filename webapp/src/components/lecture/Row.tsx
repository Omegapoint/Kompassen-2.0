import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { ReactElement } from 'react';
import useAzureUser from '../../hooks/UseAzureUser';
import { useAppSelector } from '../../lib/Lib';
import { LectureMessage } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';

const monthNames = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'nov', 'dec'];

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const padTime = (str: number): string => (str.toString().length === 2 ? str.toString() : `0${str}`);

export const formatDate = (date: Date): string => {
  const today = isToday(date);
  if (today) {
    const hours = padTime(date.getHours());
    const minutes = padTime(date.getMinutes());
    return `idag ${hours}:${minutes}`;
  }
  return `${date.getDate().toString()} ${monthNames[date.getMonth()]}`;
};

interface RowProps {
  message: LectureMessage;
}

const Row = ({ message }: RowProps): ReactElement => {
  const user = useAppSelector((state) => state.user);
  const isSender = message.userID === user.id;
  const { initials, name } = useAzureUser(message.userID);

  return (
    <Box
      sx={{
        justifySelf: isSender ? 'end' : 'start',
        display: 'grid',
        gridGap: padding.minimal,
        gridAutoFlow: 'column',
        alignItems: 'start',
        maxWidth: '90%',
        direction: isSender ? 'rtl' : 'ltr',
        padding: 0,
      }}
    >
      <IconButton sx={{ padding: 0, width: '36px', height: '36px' }} size="large">
        <Avatar
          sx={{
            backgroundColor: colors.grey,
            color: colors.white,
            fontSize: '1rem',
            width: '34px',
            height: '34px',
          }}
        >
          {initials}
        </Avatar>
      </IconButton>
      {/* <ProfileImage commenter={message.userID} width="36px" height="36px" /> */}
      <div>
        <Typography variant="subtitle1">{name}</Typography>
        <Typography
          sx={{
            direction: 'ltr',
            background: colors.lightBlue,
            padding: padding.minimal,
            borderRadius: borderRadius.standard,
          }}
        >
          {message.message}
        </Typography>
      </div>
      <Typography variant="subtitle1" sx={{ alignSelf: 'center' }}>
        {formatDate(message.createdAt)}
      </Typography>
    </Box>
  );
};

export default Row;
