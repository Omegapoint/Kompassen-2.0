import {
  Button,
  createStyles,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  makeStyles,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { ChangeEvent, FormEvent, ReactElement, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { createLecture, updateLecture } from '../../api/Api';
import useForm from '../../hooks/UseForm';
import { formIsInvalid, FormValidation, useFormValidation } from '../../hooks/UseFormValidation';
import { LARGE_STRING_LEN, SHORT_STRING_LEN } from '../../lib/Constants';
import { useAppSelector } from '../../lib/Lib';
import { Category, Lecture } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import { formatEventTime } from '../competenceDays/DayPicker';

const useStyles = makeStyles(() =>
  createStyles({
    formContainer: {
      display: 'grid',
      padding: padding.large,
      justifyItems: 'start',
      rowGap: padding.medium,
    },
    line: {
      width: '6px',
      background: colors.primary,
      borderRadius: `${borderRadius.small} 0 0 ${borderRadius.small}`,
    },
    header: {
      display: 'grid',
      justifySelf: 'center',
      color: colors.orange,
    },
    radioButtons: {
      paddingTop: padding.minimal,
    },
    row: {
      display: 'grid',
      gridGap: padding.medium,
      gridTemplateAreas: `"day hours minutes"`,
    },
    subContainer: {
      display: 'flex',
      gridGap: padding.standard,
    },
    day: {
      gridArea: 'day',
    },
    hours: {
      gridArea: 'hours',
    },
    minutes: {
      gridArea: 'minutes',
    },
    dateLineMargin: {
      marginBottom: padding.minimal,
    },
    buttonRow: {
      display: 'grid',
      gridTemplateColumns: 'max-content 1fr max-content',
      gridTemplateAreas: `"cancel . buttons"`,
      width: '100%',
    },
    cancel: {
      gridArea: 'cancel',
    },
    buttons: {
      gridArea: 'buttons',
      display: 'flex',
      gridGap: padding.standard,
    },
  })
);

interface LectureFormProps {
  data?: Lecture;
}

const hoursText = `Timmar måste vara mellan 0-100`;
const minutesText = `Minuter måste vara mellan 0-59`;
const titleText = `Titeln måste vara mellan 1-${SHORT_STRING_LEN} tecken långt`;
const descriptionText = `Innehållet måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;
const maxParticipantsText = `Maxdeltagare måste vara mellan 0-100000 tecken långt`;
const requirementsText = `Förkunskapskrav måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;
const preparationsText = `Förberedelser måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;
const tagsText = `Du måste ha minst en tagg`;
const messageText = `Meddelandet måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;

const invalidHours = (str: string) => {
  const val = parseInt(str, 10);
  if (Number.isNaN(val)) return true;
  return val < 0 || val > 100;
};

const invalidMinutes = (str: string) => {
  const val = parseInt(str, 10);
  if (Number.isNaN(val)) return true;
  return val < 0 || val > 59;
};

const invalidParticipants = (str: string) => {
  const val = parseInt(str, 10);
  if (Number.isNaN(val)) return true;
  return val < 0 || val > 100000;
};

const invalidShortString = (str: string) => str.length < 1 || str.length > SHORT_STRING_LEN;
const invalidLongString = (str: string) => str.length < 1 || str.length > LARGE_STRING_LEN;
const invalidTags = (str: string) => str.split(' ').filter((e) => e).length === 0;

interface FormValues {
  locationID: string;
  eventID: string;
  hours: string;
  minutes: string;
  title: string;
  category: string;
  lecturer: string;
  description: string;
  maxParticipants: string;
  requirements: string;
  preparations: string;
  tags: string;
  message: string;
}

const useValidate = (values: FormValues): FormValidation<FormValues> => {
  const validate = {
    hours: useFormValidation(values.hours, hoursText, invalidHours),
    minutes: useFormValidation(values.hours, minutesText, invalidMinutes),
    title: useFormValidation(values.title, titleText, invalidShortString),
    description: useFormValidation(values.description, descriptionText, invalidLongString),
    maxParticipants: useFormValidation(
      values.maxParticipants,
      maxParticipantsText,
      invalidParticipants
    ),
    requirements: useFormValidation(values.requirements, requirementsText, invalidLongString),
    preparations: useFormValidation(values.preparations, preparationsText, invalidLongString),
    tags: useFormValidation(values.tags, tagsText, invalidTags),
    message: useFormValidation(values.message, messageText, invalidLongString),
  };

  return {
    validate,
    invalid: formIsInvalid(validate),
  };
};

const LectureForm = ({ data }: LectureFormProps): ReactElement => {
  const classes = useStyles();
  const locations = useAppSelector((state) => state.locations);
  const categories = useAppSelector((state) => state.categories);
  const { azureUser } = useAppSelector((state) => state.session);
  const events = useAppSelector((state) => state.events);
  const createLectureRequest = useMutation(createLecture);
  const updateLectureRequest = useMutation(updateLecture);
  const history = useHistory();

  const defaultFormValue = {
    locationID: locations[0].id,
    eventID: events[0].id,
    hours: '',
    minutes: '',
    title: data?.title || '',
    category: categories[0].name,
    lecturer: azureUser.displayName,
    description: data?.description || '',
    maxParticipants: '',
    requirements: '',
    preparations: '',
    tags: data?.tags.reduce((s, e) => `${s} ${e}`, '') || '',
    message: '',
  };
  const { values, handleChange } = useForm(defaultFormValue);
  const { validate, invalid } = useValidate(values);

  const handleSubmit = (evt: FormEvent, published: boolean) => {
    evt.preventDefault();
    const category = categories.find((e) => e.name === values.category) as Category;
    const formData = {
      title: values.title,
      description: values.description,
      lecturer: values.lecturer,
      tags: values.tags.split(' ').filter((e) => e),

      locationID: values.locationID,
      eventID: values.eventID,
      duration: parseInt(values.hours, 10) * 60 + parseInt(values.minutes, 10),
      categoryID: category.id,
      maxParticipants: parseInt(values.maxParticipants, 10),
      requirements: values.requirements,
      preparations: values.preparations,
      message: values.message,
    };
    if (data) {
      updateLectureRequest.mutate({ id: data.id, published, ...formData });
    } else {
      createLectureRequest.mutate({ ...formData, published });
    }
  };

  useEffect(() => {
    if (updateLectureRequest.isSuccess) {
      history.push(`/lecture/${updateLectureRequest.data?.id}/confirm`);
    }
  }, [history, updateLectureRequest.data?.id, updateLectureRequest.isSuccess]);

  useEffect(() => {
    if (createLectureRequest.isSuccess) {
      history.push(`/lecture/${createLectureRequest.data?.id}/confirm`);
    }
  }, [history, createLectureRequest.data?.id, createLectureRequest.isSuccess]);

  const checkNumberLimit = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (parseInt(e.target.value, 10) < 60) {
      handleChange(e);
    }
  };

  return (
    <form>
      <Paper className={classes.formContainer}>
        <Typography className={classes.header} variant="h1">
          Anmäl pass till kompetensdag
        </Typography>

        <div>
          <FormLabel className={classes.radioButtons} required component="legend">
            Plats
          </FormLabel>
          <RadioGroup name="locationID" onChange={handleChange} value={values.locationID}>
            {locations.map((e) => (
              <FormControlLabel key={e.name} value={e.name} control={<Radio />} label={e.name} />
            ))}
          </RadioGroup>
        </div>

        <div className={classes.row}>
          <FormControl className={classes.day} variant="outlined">
            <FormLabel className={classes.dateLineMargin} required component="legend">
              Kompetensdag
            </FormLabel>
            <Select
              value={values.eventID}
              onChange={(e) => handleChange(e)}
              inputProps={{ name: 'eventID' }}
            >
              {events.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {formatEventTime(e)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            <FormLabel className={classes.dateLineMargin} required component="legend">
              Längd på passet
            </FormLabel>
            <div className={classes.subContainer}>
              <TextField
                {...validate.hours}
                className={classes.hours}
                onChange={handleChange}
                label="Timmar"
                name="hours"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                variant="outlined"
              />
              <TextField
                {...validate.minutes}
                className={classes.minutes}
                onChange={checkNumberLimit}
                value={values.minutes}
                label="Minuter"
                name="minutes"
                type="number"
                InputProps={{ inputProps: { min: 0, max: 59 } }}
                variant="outlined"
              />
            </div>
          </div>
        </div>
        <TextField
          fullWidth
          onChange={handleChange}
          required
          value={values.title}
          name="title"
          label="Titel"
          variant="outlined"
          {...validate.title}
        />
        <div>
          <FormLabel className={classes.radioButtons} required component="legend">
            Kategori
          </FormLabel>
          <RadioGroup name="category" onChange={handleChange} value={values.category}>
            {categories.map((e) => (
              <FormControlLabel key={e.id} value={e.name} control={<Radio />} label={e.name} />
            ))}
          </RadioGroup>
        </div>

        <TextField
          fullWidth
          onChange={handleChange}
          required
          value={values.lecturer}
          name="lecturer"
          label="Passhållare"
          variant="outlined"
        />

        <TextField
          {...validate.description}
          fullWidth
          multiline
          minRows={10}
          maxRows={20}
          onChange={handleChange}
          required
          value={values.description}
          name="description"
          label="Innehåll"
          variant="outlined"
        />

        <TextField
          {...validate.maxParticipants}
          fullWidth
          onChange={handleChange}
          name="maxParticipants"
          label="Max antal deltagare"
          variant="outlined"
        />

        <TextField
          {...validate.requirements}
          fullWidth
          onChange={handleChange}
          name="requirements"
          label="Förkunskapskrav"
          variant="outlined"
        />

        <TextField
          {...validate.preparations}
          fullWidth
          onChange={handleChange}
          name="preparations"
          label="Förberedelser"
          variant="outlined"
        />

        <TextField
          {...validate.tags}
          fullWidth
          onChange={handleChange}
          name="tags"
          label="Taggar"
          variant="outlined"
          value={values.tags}
        />

        <TextField
          {...validate.message}
          fullWidth
          onChange={handleChange}
          name="message"
          label="Meddelande till planerare"
          multiline
          minRows={13}
          maxRows={5}
          variant="outlined"
        />
        <div className={classes.buttonRow}>
          <IconButton className={classes.cancel} color="primary">
            <Typography>Avbryt</Typography>
          </IconButton>
          <div className={classes.buttons}>
            {!data?.published && (
              <Button
                variant="contained"
                disabled={invalid}
                color="primary"
                onClick={(e) => handleSubmit(e, false)}
              >
                Spara utkast
              </Button>
            )}

            <Button
              variant="contained"
              disabled={invalid}
              color="primary"
              onClick={(e) => handleSubmit(e, true)}
            >
              Anmäl pass
            </Button>
          </div>
        </div>
      </Paper>
    </form>
  );
};
export default LectureForm;
