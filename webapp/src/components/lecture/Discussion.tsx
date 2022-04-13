import { AccountCircle } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { IEmojiData } from 'emoji-picker-react';
import { KeyboardEvent, MouseEvent, ReactElement, useContext } from 'react';
import useForm from '../../hooks/UseForm';
import { borderRadius, colors, padding } from '../../theme/Theme';
import TextPanel from '../textPanel/TextPanel';
import LectureContext from './LectureContext';
import Row from './Row';

const defaultFormValue = {
  message: '',
};

interface DiscussionProps {
  opkoko?: boolean;
}

const Discussion = ({ opkoko }: DiscussionProps): ReactElement => {
  const { chat, sendWSMessage } = useContext(LectureContext);
  const { values, handleChange, appendChange, updateValues } = useForm(defaultFormValue);

  const handleSmiley = (_: MouseEvent, data: IEmojiData) => {
    appendChange('message', data.emoji);
  };

  const submit = () => {
    updateValues({ message: '' });
    sendWSMessage(values.message);
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    submit();
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  return (
    <Box
      sx={{
        gridArea: 'content',
        width: '100%',
        display: 'grid',
        gridGap: padding.minimal,
      }}
    >
      {chat && chat.map((e) => <Row key={e.id} message={e} />)}
      <form>
        <Box
          sx={{
            display: 'grid',
            background: colors.background,
            padding: padding.minimal,
            gridTemplateColumns: 'min-content 1fr max-content',
            gridTemplateAreas: `"icon text text"
                        ". panel submit"`,
            alignItems: 'start',
            gridAutoFlow: 'column',
            border: `1px solid ${colors.lightGrey}`,
            borderRadius: borderRadius.small,
            gridGap: padding.minimal,
          }}
        >
          <IconButton sx={{ gridArea: 'icon', padding: 0 }} size="large">
            <AccountCircle />
          </IconButton>
          <TextField
            sx={{ gridArea: 'text', backgroundColor: colors.white }}
            fullWidth
            multiline
            minRows={1}
            maxRows={5}
            value={values.message}
            onChange={handleChange}
            onKeyPress={(e) => handleKeyPress(e)}
            required
            name="message"
            label={opkoko ? 'Skriv hellre i Slack för snabb återkoppling' : 'Skriv en kommentar'}
            variant="outlined"
          />
          <Box sx={{ display: 'grid', alignSelf: 'center', gridArea: 'panel' }}>
            <TextPanel handleEmojiClick={handleSmiley} />
          </Box>
          <Button
            type="submit"
            sx={{ gridArea: 'submit' }}
            onClick={(e) => handleSubmit(e)}
            color="primary"
            variant="contained"
          >
            Skicka
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Discussion;
