import { MouseEvent, ReactElement, useContext } from 'react';
import { Button, IconButton, makeStyles, TextField } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { IEmojiData } from 'emoji-picker-react';
import Row from './Row';
import { borderRadius, colors, padding } from '../../theme/Theme';
import TextPanel from '../textPanel/TextPanel';
import useForm from '../../hooks/UseForm';
import LectureContext from './LectureContext';

const useStyles = makeStyles(() => ({
  container: {
    gridArea: 'content',
    width: '100%',
    display: 'grid',
    gridGap: padding.minimal,
  },
  form: {
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
  },
  text: {
    gridArea: 'text',
    backgroundColor: colors.white,
  },
  icon: {
    gridArea: 'icon',
    padding: 0,
  },
  panel: {
    display: 'grid',
    alignSelf: 'center',
    gridArea: 'panel',
  },
  submit: {
    gridArea: 'submit',
  },
}));

const defaultFormValue = {
  message: '',
};

const Discussion = (): ReactElement => {
  const classes = useStyles({ name: 'jonas' });
  const { chat, sendWSMessage } = useContext(LectureContext);
  const { values, handleChange, appendChange, updateValues } = useForm(defaultFormValue);

  const handleSmiley = (_: MouseEvent, data: IEmojiData) => {
    appendChange('message', data.emoji);
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    updateValues({ message: '' });
    sendWSMessage(values.message);
  };

  return (
    <div className={classes.container}>
      {chat && chat.map((e) => <Row key={e.id} message={e} />)}
      <form className={classes.form}>
        <IconButton className={classes.icon}>
          <AccountCircle />
        </IconButton>
        <TextField
          className={classes.text}
          fullWidth
          multiline
          minRows={1}
          maxRows={5}
          value={values.message}
          onChange={handleChange}
          required
          name="message"
          label="Skriv en kommentar, eller tagga en kollega."
          variant="outlined"
        />
        <div className={classes.panel}>
          <TextPanel handleEmojiClick={handleSmiley} />
        </div>
        <Button
          type="submit"
          className={classes.submit}
          onClick={(e) => handleSubmit(e)}
          color="primary"
          variant="contained"
        >
          Skicka
        </Button>
      </form>
    </div>
  );
};

export default Discussion;
