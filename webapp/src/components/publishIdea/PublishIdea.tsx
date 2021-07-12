import { ReactElement, MouseEvent, FormEvent, useContext } from 'react';
import { IEmojiData } from 'emoji-picker-react';
import {
  Button,
  createStyles,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import { borderRadius, colors, padding } from '../../theme/Theme';
import useForm from '../../hooks/UseForm';
import TextPanel from '../textPanel/TextPanel';
import { useCreateLectureIdea } from '../../lib/Hooks';
import UserContext from '../../UserContext';

const useStyles = makeStyles(() =>
  createStyles({
    page: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridTemplateColumns: 'min-content 1fr',
    },
    formContainer: {
      display: 'grid',
      gridGap: padding.medium,
      justifyItems: 'start',
      padding: padding.medium,
      gridTemplateColumns: 'max-content 1fr max-content',
      gridTemplateAreas: `". header ."
                          "title title title"
                          "content content content"
                          "tags tags tags"
                          "desire . ."
                          "cancel . submit"`,
    },
    line: {
      width: '6px',
      background: colors.primary,
      borderRadius: `${borderRadius.small} 0 0 ${borderRadius.small}`,
    },
    header: {
      gridArea: 'header',
      justifySelf: 'center',
    },
    title: {
      gridArea: 'title',
    },
    content: {
      gridArea: 'content',
      width: '100%',
    },
    tags: {
      gridArea: 'tags',
    },
    desire: {
      gridArea: 'desire',
    },
    cancel: {
      gridArea: 'cancel',
      padding: 0,
    },
    submit: {
      gridArea: 'submit',
    },
  })
);

interface PublishIdeaProps {
  cancel: () => void;
}

const defaultFormValue = {
  content: '',
  title: '',
  tags: '',
  desire: '',
};

const PublishIdea = ({ cancel }: PublishIdeaProps): ReactElement => {
  const classes = useStyles();
  const { values, handleChange, appendChange } = useForm(defaultFormValue);
  const [, createLectureIdeaRequest] = useCreateLectureIdea();
  const { user } = useContext(UserContext);

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    await createLectureIdeaRequest({
      body: {
        title: values.title,
        description: values.content,
        tags: values.tags.split(' '),
        lecturer: values.desire === 'önskas' ? user.name : null,
      },
    });
    cancel();
  };

  const handleSmiley = (_: MouseEvent, data: IEmojiData) => {
    appendChange('content', data.emoji);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.page}>
        <div className={classes.line} />
        <Paper className={classes.formContainer}>
          <Typography className={classes.header} variant="h2">
            Ny idé
          </Typography>
          <TextField
            className={classes.title}
            fullWidth
            onChange={handleChange}
            required
            name="title"
            label="Titel"
            variant="outlined"
          />
          <div className={classes.content}>
            <TextField
              fullWidth
              multiline
              rows={3}
              maxRows={5}
              value={values.content}
              onChange={handleChange}
              required
              name="content"
              label="Innehåll"
              variant="outlined"
            />
            <TextPanel handleEmojiClick={handleSmiley} />
          </div>

          <TextField
            className={classes.tags}
            fullWidth
            onChange={handleChange}
            name="tags"
            label="Taggar"
            variant="outlined"
          />

          <FormControl className={classes.desire} component="fieldset">
            <FormLabel component="legend">Typ av idé</FormLabel>
            <RadioGroup name="desire" onChange={handleChange}>
              <FormControlLabel value="sökes" control={<Radio />} label="Passhållare sökes" />
              <FormControlLabel value="önskas" control={<Radio />} label="Endast feedback önskas" />
            </RadioGroup>
          </FormControl>

          <IconButton className={classes.cancel} onClick={cancel} color="primary">
            <Typography>Avbryt</Typography>
          </IconButton>
          <Button
            className={classes.submit}
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            Publisera idé
          </Button>
        </Paper>
      </div>
    </form>
  );
};

export default PublishIdea;
