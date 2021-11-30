import { EmojiEmotions } from '@mui/icons-material';
import { IconButton, Popover } from '@mui/material';
import Picker, { IEmojiData } from 'emoji-picker-react';
import { MouseEvent, ReactElement } from 'react';
import useAnchor from '../../hooks/UseAnchor';

interface TextPanelProps {
  handleEmojiClick: (_: MouseEvent, data: IEmojiData) => void;
}

const TextPanel = ({ handleEmojiClick }: TextPanelProps): ReactElement => {
  const { handleClose, handleClick, open, anchorEl } = useAnchor();

  return (
    <div>
      <IconButton sx={{ padding: 0 }} onClick={handleClick} size="large">
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
