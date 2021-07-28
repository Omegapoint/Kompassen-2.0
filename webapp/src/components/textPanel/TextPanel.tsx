import { IconButton, makeStyles, Popover } from '@material-ui/core';
import { EmojiEmotions } from '@material-ui/icons';
import Picker, { IEmojiData } from 'emoji-picker-react';
import * as React from 'react';
import { ReactElement } from 'react';
import useAnchor from '../../hooks/UseAnchor';

interface TextPanelProps {
  handleEmojiClick: (_: React.MouseEvent, data: IEmojiData) => void;
}

const useStyles = makeStyles(() => ({
  iconButton: {
    padding: 0,
  },
}));

const TextPanel = ({ handleEmojiClick }: TextPanelProps): ReactElement => {
  const classes = useStyles();
  const { handleClose, handleClick, open, anchorEl } = useAnchor();

  return (
    <div>
      <IconButton className={classes.iconButton} onClick={handleClick}>
        <EmojiEmotions />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Picker onEmojiClick={handleEmojiClick} />
      </Popover>
    </div>
  );
};

export default TextPanel;
