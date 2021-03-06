import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, ReactElement, useEffect } from 'react';
import { useMutation } from 'react-query';
import { NavLink, useNavigate } from 'react-router-dom';
import { createLecture, updateLecture } from '../../api/Api';
import useForm from '../../hooks/UseForm';
import { formIsInvalid, FormValidation, useFormValidation } from '../../hooks/UseFormValidation';
import { LARGE_STRING_LEN, SHORT_STRING_LEN } from '../../lib/Constants';
import { useAppSelector } from '../../lib/Lib';
import { Category, Event, Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';
import { formatEventTime } from '../competenceDays/DayPicker';

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
  if (!str) return false;
  const val = parseInt(str, 10);
  if (Number.isNaN(val)) return true;
  return val < 0 || val > 100000;
};

const invalidShortString = (str: string) => str.length < 1 || str.length > SHORT_STRING_LEN;
const invalidLongString = (str: string) => str.length < 1 || str.length > LARGE_STRING_LEN;
const invalidNullableLongString = (str: string) => str.length > LARGE_STRING_LEN;
const invalidTags = (str: string) => !!str.split(' ').find((e) => e.length > 50);

interface FormValues {
  remote: string;
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
    minutes: useFormValidation(values.minutes, minutesText, invalidMinutes),
    title: useFormValidation(values.title, titleText, invalidShortString),
    description: useFormValidation(values.description, descriptionText, invalidLongString),
    maxParticipants: useFormValidation(
      values.maxParticipants,
      maxParticipantsText,
      invalidParticipants
    ),
    requirements: useFormValidation(
      values.requirements,
      requirementsText,
      invalidNullableLongString
    ),
    preparations: useFormValidation(
      values.preparations,
      preparationsText,
      invalidNullableLongString
    ),
    tags: useFormValidation(values.tags, tagsText, invalidTags),
    message: useFormValidation(values.message, messageText, invalidNullableLongString),
  };

  return {
    validate,
    invalid: formIsInvalid(validate),
  };
};
// The more complex form to create a new lecture
const LectureForm = ({ data }: LectureFormProps): ReactElement => {
  const allCategories = useAppSelector((state) => state.categories);
  const allOrganisations = useAppSelector((state) => state.organisations);
  const categories = allCategories.filter((e) => e.name !== 'Information');
  const { azureUser } = useAppSelector((state) => state.session);
  const events = useAppSelector((state) =>
    state.events.filter(
      (event) =>
        event.organisationID !==
        allOrganisations.find((organisation) => organisation?.name === 'OPKoKo')?.id
    )
  );
  const createLectureRequest = useMutation(createLecture);
  const updateLectureRequest = useMutation(updateLecture);
  const navigate = useNavigate();

  const defaultFormValue = {
    remote: data?.remote || '',
    eventID: events.find((event) => event.id === data?.eventID)?.id || '',
    hours: data?.duration ? Math.floor(data.duration / 60 / 60).toString() : '0',
    minutes: data?.duration ? ((data.duration / 60) % 60).toString() : '0',
    title: data?.title || '',
    category: categories.find((cat) => cat.id === data?.categoryID)?.name || categories[0].name,
    lecturer: data?.lecturer || azureUser.displayName,
    description: data?.description || '',
    maxParticipants: data?.maxParticipants?.toString() || '',
    requirements: data?.requirements || '',
    preparations: data?.preparations || '',
    tags: data?.tags.reduce((s, e) => `${s} ${e}`, '') || '',
    message: data?.message || '',
  };

  const { values, handleChange } = useForm(defaultFormValue);
  const { validate, invalid } = useValidate(values);

  const handleSubmit = (evt: FormEvent, draft: boolean) => {
    evt.preventDefault();
    const category = categories.find((e) => e.name === values.category) as Category;
    const formData = {
      title: values.title,
      description: values.description,
      lecturer: values.lecturer,
      lecturerID: azureUser.id,
      tags: [
        ...new Set(
          values.tags
            .split(' ')
            .map((e) => e.trim())
            .filter((e) => e)
        ),
      ],
      remote: values.remote,
      eventID: values.eventID,
      duration: (parseInt(values.hours, 10) * 60 + parseInt(values.minutes, 10)) * 60,
      categoryID: category.id,
      maxParticipants: values.maxParticipants ? parseInt(values.maxParticipants, 10) : null,
      requirements: values.requirements || null,
      preparations: values.preparations || null,
      message: values.message || null,
      // Not applicable for Kompetensdag lectures
      videoLink: null,
      keyTakeaway: null,
      internalPresentation: false,
      targetAudience: null,
      formatID: null,
      lectureStatusID: null,
      lecturers: null,
    };
    if (data) {
      updateLectureRequest.mutate({ id: data.id, draft, ...formData });
    } else {
      createLectureRequest.mutate({ ...formData, draft });
    }
  };

  useEffect(() => {
    if (updateLectureRequest.isSuccess) {
      navigate(`/lecture/competenceday/${updateLectureRequest.data?.id}/confirm`);
    }
  }, [navigate, updateLectureRequest.data?.id, updateLectureRequest.isSuccess]);

  useEffect(() => {
    if (createLectureRequest.isSuccess) {
      navigate(`/lecture/competenceday/${createLectureRequest.data?.id}/confirm`);
    }
  }, [navigate, createLectureRequest.data?.id, createLectureRequest.isSuccess]);

  // User can not register lecture to an event that has already started/happened
  const findEvent = (id: string, cond: (d: Date) => boolean) => {
    const event = events.find((e1) => id === e1.id);
    return event ? cond(event.startAt) : undefined;
  };
  const futureEvents = events.filter((e) => findEvent(e.id, (d) => d > new Date()));

  const getEventName = (e: Event) => {
    const orgName = allOrganisations.find((e1) => e1.id === e.organisationID)?.name;
    const time = formatEventTime(e);
    return `${orgName} - ${time}`;
  };

  return (
    <form>
      <Paper
        sx={{
          display: 'grid',
          padding: padding.large,
          justifyItems: 'start',
          rowGap: padding.medium,
        }}
      >
        <Typography
          sx={{ display: 'grid', justifySelf: 'center', color: colors.orange }}
          variant="h1"
        >
          {data ? 'Redigera pass till kompetensdag' : 'Anmäl pass till kompetensdag'}
        </Typography>
        <div>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            På vilket sätt kan man delta?
          </FormLabel>
          <RadioGroup name="remote" onChange={handleChange} value={values.remote}>
            <FormControlLabel value="local" control={<Radio />} label="Endast på plats" />
            <FormControlLabel value="distance" control={<Radio />} label="Endast på distans" />
            <FormControlLabel
              value="hybrid"
              control={<Radio />}
              label="Både på plats och distans"
            />
          </RadioGroup>
        </div>
        <Box
          sx={{
            display: 'grid',
            gridGap: padding.medium,
            gridTemplateAreas: `"day hours minutes"`,
          }}
        >
          <FormControl sx={{ gridArea: 'day' }} variant="outlined">
            <FormLabel sx={{ marginBottom: padding.minimal }} required component="legend">
              Kompetensdag
            </FormLabel>
            <Select
              value={values.eventID}
              onChange={(e) => handleChange(e)}
              inputProps={{ name: 'eventID' }}
            >
              {futureEvents.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {getEventName(e)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            <FormLabel sx={{ marginBottom: padding.minimal }} required component="legend">
              Längd på passet
            </FormLabel>
            <Box sx={{ display: 'flex', gridGap: padding.standard }}>
              <TextField
                {...validate.hours}
                sx={{ gridArea: 'hours' }}
                onChange={handleChange}
                value={values.hours}
                label="Timmar"
                name="hours"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                variant="outlined"
              />
              <TextField
                {...validate.minutes}
                sx={{ gridArea: 'minutes' }}
                onChange={handleChange}
                value={values.minutes}
                label="Minuter"
                name="minutes"
                type="number"
                InputProps={{ inputProps: { min: 0, max: 59 } }}
                variant="outlined"
              />
            </Box>
          </div>
        </Box>
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
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
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
          type="number"
          label="Max antal deltagare"
          variant="outlined"
          value={values.maxParticipants}
        />
        <TextField
          {...validate.requirements}
          fullWidth
          onChange={handleChange}
          name="requirements"
          label="Förkunskapskrav"
          variant="outlined"
          value={values.requirements}
        />
        <TextField
          {...validate.preparations}
          fullWidth
          onChange={handleChange}
          name="preparations"
          label="Förberedelser"
          variant="outlined"
          value={values.preparations}
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
          value={values.message}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr max-content',
            gridTemplateAreas: `"cancel . buttons"`,
            width: '100%',
          }}
        >
          <Link sx={{ gridArea: 'cancel' }} component={NavLink} to="/" variant="subtitle1">
            Avbryt
          </Link>
          <Box sx={{ gridArea: 'buttons', display: 'flex', gridGap: padding.standard }}>
            {!data?.draft && (
              <Button
                variant="contained"
                disabled={invalid}
                color="primary"
                onClick={(e) => handleSubmit(e, true)}
              >
                Spara utkast
              </Button>
            )}
            <Button
              variant="contained"
              disabled={invalid}
              color="primary"
              onClick={(e) => handleSubmit(e, false)}
            >
              Anmäl pass
            </Button>
          </Box>
        </Box>
      </Paper>
    </form>
  );
};

export default LectureForm;
