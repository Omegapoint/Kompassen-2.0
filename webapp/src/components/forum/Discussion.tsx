import { MouseEvent, ReactElement } from 'react';
import { Button, IconButton, makeStyles, TextField } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { IEmojiData } from 'emoji-picker-react';
import Row from './Row';
import { borderRadius, colors, padding } from '../../theme/Theme';
import TextPanel from '../textPanel/TextPanel';
import useForm from '../../hooks/UseForm';

const date = new Date();
date.setDate(date.getDate() - 1);

const messages = [
  {
    sender: 'börje',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eisodo.',
    date,
  },
  {
    sender: 'börje',
    message: 'Lorem ipsum dolor sit amet.',
    date: new Date(),
  },
  {
    sender: 'jonas',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eisodo.\n' +
      ',consectetur adipiscing elit, sed do eisodo!.',
    date: new Date(),
  },
];

const useStyles = makeStyles(() => ({
  container: {
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
  content: '',
};

const Discussion = (): ReactElement => {
  const classes = useStyles({ name: 'jonas' });
  const { values, handleChange, appendChange } = useForm(defaultFormValue);

  const handleSmiley = (_: MouseEvent, data: IEmojiData) => {
    appendChange('content', data.emoji);
  };

  return (
    <div className={classes.container}>
      {messages.map((e) => (
        <Row sender={e.sender} message={e.message} date={e.date} />
      ))}
      <form className={classes.form}>
        <IconButton className={classes.icon}>
          <AccountCircle />
        </IconButton>
        <TextField
          className={classes.text}
          fullWidth
          multiline
          rows={1}
          rowsMax={5}
          value={values.content}
          onChange={handleChange}
          required
          name="content"
          label="Skriv en kommentar, eller tagga en kollega."
          variant="outlined"
        />
        <div className={classes.panel}>
          <TextPanel handleEmojiClick={handleSmiley} />
        </div>
        <Button className={classes.submit} color="primary" variant="contained">
          Skicka
        </Button>
      </form>
    </div>
  );
};

export default Discussion;
