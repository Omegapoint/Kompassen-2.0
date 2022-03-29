import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Link,
  Paper,
  Radio,
  RadioGroup,
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
import { Category, Event, Format, Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';
import { formatEventTime } from '../competenceDays/DayPicker';
import { InfoText } from './InfoText';

interface LectureFormProps {
  data?: Lecture;
}

const titleText = `Titeln måste vara mellan 1-${SHORT_STRING_LEN} tecken långt`;
const descriptionText = `Innehållet måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;
const requirementsText = `Förkunskapskrav måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;
const messageText = `Meddelandet måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;

const invalidShortString = (str: string) => str.length < 1 || str.length > SHORT_STRING_LEN;
const invalidLongString = (str: string) => str.length < 1 || str.length > LARGE_STRING_LEN;
const invalidNullableLongString = (str: string) => str.length > LARGE_STRING_LEN;
const invalidTags = (str: string) => !!str.split(' ').find((e) => e.length > 50);

interface FormValues {
  eventID: string;
  title: string;
  firstTimePresenting: string;
  keyTakeAway: string;
  categoryID: string;
  formatID: string;
  targetAudience: string;
  internal: string;
  description: string;
  requirements: string;
  tags: string;
  message: string;
}

const useValidate = (values: FormValues): FormValidation<FormValues> => {
  const validate = {
    title: useFormValidation(values.title, titleText, invalidShortString),
    description: useFormValidation(values.description, descriptionText, invalidLongString),
    requirements: useFormValidation(
      values.requirements,
      requirementsText,
      invalidNullableLongString
    ),
    message: useFormValidation(values.message, messageText, invalidNullableLongString),
  };

  return {
    validate,
    invalid: formIsInvalid(validate),
  };
};
// The more complex form to create a new lecture
const OpKoKoForm = ({ data }: LectureFormProps): ReactElement => {
  const allCategories = useAppSelector((state) => state.categories);
  const allOrganisations = useAppSelector((state) => state.organisations);
  const categories = allCategories.filter((e) => e.name !== 'Information');
  const { azureUser } = useAppSelector((state) => state.session);
  const events = useAppSelector((state) => state.events);
  const formats = useAppSelector((state) => state.formats);
  const createLectureRequest = useMutation(createLecture);
  const updateLectureRequest = useMutation(updateLecture);
  const navigate = useNavigate();

  const defaultFormValue = {
    eventID: '334de9fb-058d-4eaa-a698-ca58aa2d2ab0',
    title: data?.title || '',
    firstTimePresenting: 'no',
    keyTakeAway: '',
    categoryID: categories.find((cat) => cat.id === data?.categoryID)?.id || categories[0].id,
    formatID: '',
    targetAudience: '',
    internal: '',
    tags: '',
    description: data?.description || '',
    requirements: data?.requirements || '',
    message: data?.message || '',
  };

  const { values, handleChange } = useForm(defaultFormValue);
  const { validate, invalid } = useValidate(values);

  const handleSubmit = (evt: FormEvent, draft: boolean) => {
    evt.preventDefault();
    const category = categories.find((e) => e.id === values.categoryID) as Category;
    const format = formats.find((e) => e.id === values.formatID) as Format;
    const formData = {
      title: values.title,
      description: values.description,
      eventID: '334de9fb-058d-4eaa-a698-ca58aa2d2ab0',
      categoryID: category.id,
      keyTakeaway: values.keyTakeAway,
      requirements: values.requirements || null,
      message: values.message || null,
      internalPresentation: !values.internal,
      firstTimePresenting: !values.firstTimePresenting,
      targetAudience: values.targetAudience || null,
      formatID: format.id || null,
      lecturer: null,
      statusID: null,
      videoLink: null,
      // Not applicable for OPKoKo lectures
      remote: 'local',
      tags: [],
      duration: 0,
      maxParticipants: null,
      preparations: null,
    };
    if (data) {
      updateLectureRequest.mutate({ id: data.id, draft, ...formData });
    } else {
      createLectureRequest.mutate({ ...formData, draft });
    }
  };

  useEffect(() => {
    if (updateLectureRequest.isSuccess) {
      navigate(`/lecture/OpKoKo/${updateLectureRequest.data?.id}/confirm`);
    }
  }, [navigate, updateLectureRequest.data?.id, updateLectureRequest.isSuccess]);

  useEffect(() => {
    if (createLectureRequest.isSuccess) {
      navigate(`/lecture/OpKoKo/${createLectureRequest.data?.id}/confirm`);
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
          {data ? 'Redigera pass till OPKoKo' : 'OPKoKo Call for Proposals'}
        </Typography>
        <InfoText />
        <Typography sx={{ paddingTop: padding.large }}>
          <p>
            Vem eller vilka kommer att hålla i passet. Det är du som anmäler bidraget som är vår
            kontaktperson. Det är ditt ansvar att förmedla information/frågor angående bidraget till
            den/de du skall hålla det med. Vänligen ange både för- och efternamn
          </p>
        </Typography>
        {/* <TextField
          fullWidth
          onChange={handleChange}
          required
          value={values.lecturer}
          name="lecturer"
          label="Talare "
          variant="outlined"
          // helperText="Vem eller vilka kommer att hålla i passet. Det är du som anmäler bidraget som är vår kontaktperson. Det är ditt ansvar att förmedla information/frågor angående bidraget till den/de du skall hålla det med. Vänligen ange både för- och efternamn"
        /> */}
        <div>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Deltar du eller någon av talarna på OPKoKo för första gången?
          </FormLabel>
          <RadioGroup name="firsTime" onChange={handleChange}>
            <FormControlLabel key="yes" value="yes" control={<Radio />} label="Ja" />
            <FormControlLabel key="no" value="no" control={<Radio />} label="Nej" />
          </RadioGroup>
        </div>
        <Typography sx={{ paddingTop: padding.large }}>
          <p>
            Deltagarna ska kunna förstå ämnet utifrån titeln. Använd gärna en fyndig titel som
            väcker intresse men samtidigt förmedlar vad det handlar om
          </p>
        </Typography>
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
        <Typography sx={{ paddingTop: padding.large }}>
          <p>
            Beskrivningen kommer publiceras i programmet och på Omegapoint Academy webb. En
            beskrivning som deltagarna läser för att veta om passet passar dem. Håll det kärnfullt,
            intressant, sälj in det till publiken. Gärna under 100 ord
          </p>
        </Typography>
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
        <Typography sx={{ paddingTop: padding.large }}>
          <p>Om deltagarna bara minns en sak - vad är det då de ska komma ihåg i en mening</p>
        </Typography>
        <TextField
          {...validate.description}
          fullWidth
          multiline
          minRows={5}
          maxRows={10}
          onChange={handleChange}
          required
          value={values.keyTakeAway}
          name="keyTakeAway"
          label="Take Away"
          variant="outlined"
        />
        <div>
          <Typography sx={{ paddingTop: padding.large }}>
            <p>
              En blixt är en kortare föreläsning där man kan belysa ett problem, visa en snygg
              lösning eller bara presentera någonting som inte kräver en hel föreläsning. Du har 15
              minuter på dig och tiden går väldigt fort så klocka dig själv innan, se till att ha en
              äggklocka under dragningen och ta frågor och diskussioner efter presentationen eller
              på lunch-/fikarasten). Anmäler du en Workshop/Gruppdiskussion ange längd på ditt
              bidrag under &quot;Övrig information&quot;
            </p>
          </Typography>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Typ av pass
          </FormLabel>
          <RadioGroup name="formatID" onChange={handleChange} value={values.formatID}>
            {formats.map((e) => (
              <FormControlLabel key={e.id} value={e.id} control={<Radio />} label={e.name} />
            ))}
          </RadioGroup>
        </div>
        <div>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Kategori
          </FormLabel>
          <RadioGroup name="categoryID" onChange={handleChange} value={values.categoryID}>
            {categories.map((e) => (
              <FormControlLabel key={e.id} value={e.id} control={<Radio />} label={e.name} />
            ))}
          </RadioGroup>
        </div>
        <div>
          <Typography sx={{ paddingTop: padding.large }}>
            <p>
              Kryssa i rutan nedan om ämnet är känsligt eller konfidentiellt och INTE får publiceras
              i programmet. Ange också under övrigt om endast Omegapoint-anställda får delta i
              presentationen
            </p>
          </Typography>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Intern presentation
          </FormLabel>
          <RadioGroup name="internal" onChange={handleChange} value={values.internal}>
            <FormControlLabel value="yes" control={<Radio />} label="Ja" />
            <FormControlLabel value="no" control={<Radio />} label="Nej" />
          </RadioGroup>
        </div>
        <Typography sx={{ paddingTop: padding.large }}>
          <p>Vem eller vilka tror du uppskattar ditt pass mest?</p>
        </Typography>
        <TextField
          {...validate.targetAudience}
          fullWidth
          onChange={handleChange}
          required
          value={values.targetAudience}
          name="targetAudience"
          label="Målgrupp"
          variant="outlined"
        />
        <Typography sx={{ paddingTop: padding.large }}>
          <p>
            Detta är viktigt! Kan en åhörare som är HELT nybörjare i ämnet ha utbyte av
            presentationen eller krävs det mer avancerade kunskaper? Tex, krävs grundläggande
            kunskaper i kod/matematiska formler? Ska man vara bekväm med docker eller kanske ha
            arbetat med Kanban?
          </p>
        </Typography>
        <TextField
          {...validate.requirements}
          fullWidth
          onChange={handleChange}
          name="requirements"
          label="Nivå på presentationen"
          variant="outlined"
          value={values.requirements}
        />
        <Typography sx={{ paddingTop: padding.large }}>
          <p>
            OBS. Detta kommer inte att skrivas ut i programmet utan är enbart info till
            programutskottet. Sådant som är relevant för oss att känna till, ett sätt för dig att
            fråga oss något, be om extra stöd, förklara något av dina svar, beskriva upplägget eller
            kanske bara sälja in ditt bidrag lite extra
          </p>
        </Typography>
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

export default OpKoKoForm;
