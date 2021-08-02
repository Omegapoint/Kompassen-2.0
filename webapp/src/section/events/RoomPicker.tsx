import { IconButton, makeStyles, TextField, Typography } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import React, { KeyboardEvent, ReactElement, useState } from 'react';
import { colors, padding } from '../../theme/Theme';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridAutoRows: '1fr',
    gridGap: `${padding.tiny} ${padding.medium}`,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr min-content',
    alignItems: 'center',
  },
  rowItem: {
    height: '100%',
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr 2fr',
    border: `1px solid ${colors.lightGrey}`,
    padding: padding.tiny,
  },
  delete: {
    color: colors.red,
    padding: padding.tiny,
  },
}));

interface RoomPickerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateValues: (e: Record<string, any>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any;
}

const RoomPicker = ({ values, updateValues }: RoomPickerProps): ReactElement => {
  const classes = useStyles();
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
    <div className={classes.row}>
      <div className={classes.rowItem}>
        <Typography>Rum {i + 1}</Typography>
        <Typography>{str}</Typography>
      </div>
      <IconButton className={classes.delete} onClick={() => deleteRoom(str)}>
        <Clear />
      </IconButton>
    </div>
  );

  return (
    <div className={classes.container}>
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
    </div>
  );
};

export default RoomPicker;
