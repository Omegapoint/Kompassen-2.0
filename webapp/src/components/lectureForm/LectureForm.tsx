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
import { ChangeEvent, FormEvent, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import { borderRadius, colors, padding } from '../../theme/Theme';
import { useAppSelector } from '../../lib/Lib';
import { formatEventTime } from '../competenceDays/DayPicker';
import useForm from '../../hooks/UseForm';
import { useCreateLecture } from '../../lib/Hooks';

const useStyles = makeStyles(() =>
  createStyles({
    formContainer: {
      display: 'grid',
      width: '100%',
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
    },
  })
);

interface LectureFormProps {
  pageTitle: string;
}

const LectureForm = ({ pageTitle }: LectureFormProps): ReactElement => {
  const classes = useStyles();
  const locations = useAppSelector((state) => state.locations);
  const categories = useAppSelector((state) => state.categories);
  const user = useAppSelector((state) => state.user);
  const events = useAppSelector((state) => state.events);
  const [, createLectureRequest] = useCreateLecture();
  const history = useHistory();

  const defaultFormValue = {
    location: locations[0].name,
    eventID: events[0].id,
    hours: '',
    minutes: '',
    title: '',
    category: categories[0].name,
    lecturer: user.name,
    description: '',
    maxParticipants: '',
    requirements: '',
    preparations: '',
    tags: '',
    message: '',
  };
  const { values, handleChange } = useForm(defaultFormValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createLectureRequest({
      body: {
        title: values.title,
        description: values.description,
        lecturer: values.lecturer,
        tags: values.tags.split(' '),

        location: values.location,
        eventID: values.eventID,
        duration: parseInt(values.hours, 10) * 60 + parseInt(values.minutes, 10),
        category: values.category,
        maxParticipants: parseInt(values.maxParticipants, 10),
        requirements: values.requirements,
        preparations: values.preparations,
        message: values.message,
      },
    });
    history.push('/');
  };

  const checkNumberLimit = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (parseInt(e.target.value, 10) < 60) {
      handleChange(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Paper className={classes.formContainer}>
        <Typography className={classes.header} variant="h1">
          {pageTitle}
        </Typography>

        <div>
          <FormLabel className={classes.radioButtons} required component="legend">
            Plats
          </FormLabel>
          <RadioGroup name="location" onChange={handleChange} value={values.location}>
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
                className={classes.hours}
                onChange={handleChange}
                label="Timmar"
                name="hours"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                variant="outlined"
              />
              <TextField
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
          name="title"
          label="Titel"
          variant="outlined"
        />
        <div>
          <FormLabel className={classes.radioButtons} required component="legend">
            Kategori
          </FormLabel>
          <RadioGroup name="category" onChange={handleChange} value={values.category}>
            {categories.map((e) => (
              <FormControlLabel value={e.name} control={<Radio />} label={e.name} />
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
          fullWidth
          multiline
          rows={10}
          rowsMax={20}
          onChange={handleChange}
          required
          name="description"
          label="Innehåll"
          variant="outlined"
        />

        <TextField
          fullWidth
          onChange={handleChange}
          name="maxParticipants"
          label="Max antal deltagare"
          variant="outlined"
        />

        <TextField
          fullWidth
          onChange={handleChange}
          name="requirements"
          label="Förkunskapskrav"
          variant="outlined"
        />

        <TextField
          fullWidth
          onChange={handleChange}
          name="preparations"
          label="Förberedelser"
          variant="outlined"
        />

        <TextField
          fullWidth
          onChange={handleChange}
          name="tags"
          label="Taggar"
          variant="outlined"
        />

        <TextField
          fullWidth
          onChange={handleChange}
          name="message"
          label="Meddelande till planerare"
          multiline
          rows={13}
          rowsMax={5}
          variant="outlined"
        />
        <div className={classes.buttonRow}>
          <div>
            <IconButton className={classes.cancel} color="primary">
              <Typography>Avbryt</Typography>
            </IconButton>
          </div>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              disabled={
                !values.location ||
                !values.eventID ||
                !values.hours ||
                !values.minutes ||
                !values.title ||
                !values.category ||
                !values.lecturer ||
                !values.description
              }
              color="primary"
              onClick={handleSubmit}
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
