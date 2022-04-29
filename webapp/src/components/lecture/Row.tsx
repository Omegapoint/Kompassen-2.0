import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import React, { ReactElement, useContext, useState } from 'react';
import useAzureUser from '../../hooks/UseAzureUser';
import { useAppSelector } from '../../lib/Lib';
import { LectureMessage } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import LectureContext from './LectureContext';

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

const options = ['Edit', 'Delete'];

const Row = ({ message }: RowProps): ReactElement => {
  const user = useAppSelector((state) => state.user);
  const isSender = message.userID === user.id;
  const { initials, name } = useAzureUser(message.userID);
  const { updateWSMessage, deleteWSMessage } = useContext(LectureContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (option: string) => {
    switch (option) {
      case 'Edit':
        updateWSMessage({
          message: 'Hej jag funkar att uppdatera',
          id: message.id,
          lectureID: message.lectureID,
        });
        break;
      case 'Delete':
        deleteWSMessage({
          message: 'Hej jag funkar att uppdatera',
          id: message.id,
          lectureID: message.lectureID,
        });
        break;
      default:
        break;
    }
    setAnchorEl(null);
  };

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
      <div>
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
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {options.map((option) => (
            <MenuItem key={option} onClick={(event) => handleClose(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
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
