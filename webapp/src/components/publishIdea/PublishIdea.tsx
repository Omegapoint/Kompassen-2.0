import { ReactElement, MouseEvent, FormEvent } from 'react';
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
import { useAppSelector } from '../../lib/Lib';
import { formIsInvalid, FormValidation, useFormValidation } from '../../hooks/UseFormValidation';
import { LARGE_STRING_LEN, SHORT_STRING_LEN } from '../../lib/constants';

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
      padding: padding.medium,
      gridTemplateColumns: 'max-content 1fr max-content',
      gridTemplateAreas: `"header header header"
                          "title title title"
                          "content content content"
                          "tags tags tags"
                          "status status status"
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
    radioButtons: {
      paddingTop: padding.minimal,
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
    status: {
      gridArea: 'status',
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
  description: '',
  title: '',
  tags: '',
  status: 'lecturer_wanted',
};

const descriptionText = `Innehållet måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;
const titleText = `Titeln måste vara mellan 1-${SHORT_STRING_LEN} tecken långt`;
const tagsText = `Du måste ha minst en tagg`;

const invalidShortString = (str: string) => str.length < 1 || str.length > SHORT_STRING_LEN;
const invalidLongString = (str: string) => str.length < 1 || str.length > LARGE_STRING_LEN;
const invalidTags = (str: string) => str.split(' ').filter((e) => e).length === 0;

type FormValues = typeof defaultFormValue;

const useValidate = (values: FormValues): FormValidation<FormValues> => {
  const validate = {
    description: useFormValidation(values.description, descriptionText, invalidLongString),
    title: useFormValidation(values.title, titleText, invalidShortString),
    tags: useFormValidation(values.tags, tagsText, invalidTags),
  };

  return {
    validate,
    invalid: formIsInvalid(validate),
  };
};

const PublishIdea = ({ cancel }: PublishIdeaProps): ReactElement => {
  const classes = useStyles();
  const { values, handleChange, appendChange } = useForm(defaultFormValue);
  const { validate, invalid } = useValidate(values);
  const [, createLectureIdeaRequest] = useCreateLectureIdea();
  const user = useAppSelector((state) => state.user);

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    await createLectureIdeaRequest({
      body: {
        title: values.title,
        description: values.description,
        tags: values.tags.split(' ').filter((e) => e),
        lecturer: values.status === 'feedback_wanted' ? user.name : null,
      },
    });
    cancel();
  };

  const handleSmiley = (_: MouseEvent, data: IEmojiData) => {
    appendChange('description', data.emoji);
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
            {...validate.title}
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
              {...validate.description}
              fullWidth
              multiline
              minRows={3}
              maxRows={5}
              value={values.description}
              onChange={handleChange}
              required
              name="description"
              label="Innehåll"
              variant="outlined"
            />
            <TextPanel handleEmojiClick={handleSmiley} />
          </div>

          <TextField
            {...validate.tags}
            className={classes.tags}
            fullWidth
            onChange={handleChange}
            name="tags"
            label="Taggar"
            variant="outlined"
          />

          <FormControl className={classes.status} component="fieldset">
            <FormLabel className={classes.radioButtons} component="legend">
              Typ av idé
            </FormLabel>
            <RadioGroup name="status" onChange={handleChange} value={values.status}>
              <FormControlLabel
                value="lecturer_wanted"
                control={<Radio />}
                label="Passhållare sökes"
              />
              <FormControlLabel
                value="feedback_wanted"
                control={<Radio />}
                label="Endast feedback önskas"
              />
            </RadioGroup>
          </FormControl>

          <IconButton className={classes.cancel} onClick={cancel} color="primary">
            <Typography>Avbryt</Typography>
          </IconButton>
          <Button
            className={classes.submit}
            onClick={handleSubmit}
            disabled={invalid}
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
