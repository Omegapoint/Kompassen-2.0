import { Clear } from '@mui/icons-material';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import React, { KeyboardEvent, ReactElement, useState } from 'react';
import { colors, padding } from '../../theme/Theme';

interface RoomPickerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateValues: (e: Record<string, any>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any;
}

const RoomPicker = ({ values, updateValues }: RoomPickerProps): ReactElement => {
  const [text, setText] = useState<string>('');

  const deleteRoom = (str: string) => {
    updateValues({ rooms: values.rooms.filter((e: string) => e !== str) });
  };

  const addRoom = () => {
    if (text && !values.rooms.includes(text)) {
      setText('');
      updateValues({ rooms: [...values.rooms, text] });
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') addRoom();
  };

  const generateRooms = (str: string, i: number) => (
    <Box
      sx={{ display: 'grid', gridTemplateColumns: '1fr min-content', alignItems: 'center' }}
      key={str}
    >
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: '1fr 2fr',
          border: `1px solid ${colors.lightGrey}`,
          padding: padding.tiny,
        }}
      >
        <Typography>Rum {i + 1}</Typography>
        <Typography>{str}</Typography>
      </Box>
      <IconButton
        sx={{ color: colors.red, padding: padding.tiny }}
        onClick={() => deleteRoom(str)}
        size="large"
      >
        <Clear />
      </IconButton>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridAutoRows: '1fr',
        gridGap: `${padding.tiny} ${padding.medium}`,
      }}
    >
      {values.rooms.map(generateRooms)}
      <TextField
        fullWidth
        onChange={(e) => setText(e.target.value)}
        required
        onKeyDown={handleKeyDown}
        onBlur={addRoom}
        value={text}
        name="room"
        label="Nytt rum"
        variant="outlined"
      />
    </Box>
  );
};

export default RoomPicker;
