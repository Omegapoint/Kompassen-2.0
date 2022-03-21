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
  email: string;
  office: string;
  firstTime: string;
  takeAway: string;
  category: string;
  typeOfLecture: string;
  targetGroup: string;
  levelOfRequirements: string;
  internal: string;
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
const OpKoKoForm = ({ data }: LectureFormProps): ReactElement => {
  const allCategories = useAppSelector((state) => state.categories);
  const allOrganisations = useAppSelector((state) => state.organisations);
  const categories = allCategories.filter((e) => e.name !== 'Information');
  const { azureUser } = useAppSelector((state) => state.session);
  const events = useAppSelector((state) => state.events);
  const createLectureRequest = useMutation(createLecture);
  const updateLectureRequest = useMutation(updateLecture);
  const navigate = useNavigate();
  const offices = [{ name: "Umeå", id: 1 }, { name: "Örebro", id: 2 }, { name: "Stockholm", id: 3 }, { name: "Malmö", id: 4 }, { name: "Göteborg", id: 5 }, { name: "Uppsala", id: 6 }];
  const typeOfLecture = [{ name: "Blixtföreläsning (15 min)", id: 1 }, { name: "Föreläsning / presentation (45 min)", id: 2 }, { name: "Gruppdiskussion", id: 3 }, { name: "Paneldiskussion (Även park-bänk, fishbowl, duell eller liknande)", id: 4 }, { name: "Workshop / labb ", id: 5 }, { name: "Co-creation - skapar något tillsammans under tiden", id: 6 }, { name: "Knäppt format jag själv kommit på och som inte har något namn än", id: 7 }, { name: "Annat", id: 8 }];
  const firstTime = [{ name: "Detta är min/vår första OPKoKo", id: 1 }, { name: "Nej", id: 2 }];

  const defaultFormValue = {
    remote: data?.remote || '',
    eventID: events.find((event) => event.id === data?.eventID)?.id || '',
    hours: data?.duration ? Math.floor(data.duration / 60 / 60).toString() : '0',
    minutes: data?.duration ? ((data.duration / 60) % 60).toString() : '0',
    title: data?.title || '',
    takeAway: '',
    email: '',
    office: offices[0].name,
    firstTime: firstTime[0].name,
    category: categories.find((cat) => cat.id === data?.categoryID)?.name || categories[0].name,
    typeOfLecture: '',
    targetGroup: '',
    levelOfRequirements: '',
    internal: '',
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
      videoLink: null,
      keyTakeaway: null,
    };
    if (data) {
      updateLectureRequest.mutate({ id: data.id, draft, ...formData });
    } else {
      createLectureRequest.mutate({ ...formData, draft });
    }
  };

  useEffect(() => {
    if (updateLectureRequest.isSuccess) {
      navigate(`/lecture/${updateLectureRequest.data?.id}/confirm`);
    }
  }, [navigate, updateLectureRequest.data?.id, updateLectureRequest.isSuccess]);

  useEffect(() => {
    if (createLectureRequest.isSuccess) {
      navigate(`/lecture/${createLectureRequest.data?.id}/confirm`);
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
          {data ? 'Redigera pass till OpKoKo VT-2022' : 'OpKoKo VT-2022 - Call for Proposals'}
        </Typography>
        <Typography sx={{ paddingBottom: padding.large }}>
          <p>Här kan du som ska med på höstens kompetenskonferens registrera dina bidrag.<br />
            Ämnen som har en tydlig koppling till Omegapoints verksamhet eller tidigare trendspaningar prioriteras.<br />
            <br />
            Accept av bidrag kan ske löpande, väntar du för länge med din anmälan kan platserna vara slut.<br />
            <br />
            Programutskottet förbehåller sig rätten att redigera och korta ner beskrivningar och texter för att passa in i programmet. <br />
            Vår ambition är att kunna acceptera alla bidrag men hänsyn tas till plats i schema, ämnesval samt hur bra beskrivet, genomtänkt och förberett det inskickade förslaget är.<br />
            <br />
            Tips från coachen:<br />
            - Prata hellre om något du vill prata om än något du tror andra vill höra om.<br />
            - Ni behöver inte ha en helt färdig presentation för att skicka in CFP, använd det som motivation till att sluta prokrastinera.<br />
            - Beskrivning och titel kan vara helt avgörande. Sälj in dig och ditt ämne.<br />
            - Ingen idé är för dum eller tokig, det värsta som kan hända är att du får feedback om hur det skulle kunna bli ännu bättre!<br />
            - Kör bara, det blir kul!<br />
            <br />
            <br />
            Deadline för registrering av bidrag är  kl. 23.59 den 23 oktober 2021!</p>
        </Typography>
        <TextField
          fullWidth
          onChange={handleChange}
          required
          value={values.email}
          name="email"
          label="E-Postadess"
          variant="outlined"
        // {...validate.title}
        />
        <Typography sx={{ paddingTop: padding.large }}>
          <p>Vem eller vilka kommer att hålla i passet. Det är du som anmäler bidraget som är vår kontaktperson. Det är ditt ansvar att förmedla information/frågor angående bidraget till den/de du skall hålla det med. Vänligen ange både för- och efternamn</p>
        </Typography>
        <TextField
          fullWidth
          onChange={handleChange}
          required
          value={values.lecturer}
          name="lecturer"
          label="Talare "
          variant="outlined"
        // helperText="Vem eller vilka kommer att hålla i passet. Det är du som anmäler bidraget som är vår kontaktperson. Det är ditt ansvar att förmedla information/frågor angående bidraget till den/de du skall hålla det med. Vänligen ange både för- och efternamn"
        />
        <div>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Kontor
          </FormLabel>
          <RadioGroup name="office" onChange={handleChange}>
            {offices.map((e) => (
              <FormControlLabel key={e.id} value={e.name} control={<Radio />} label={e.name} />
            ))}
          </RadioGroup>
        </div>
        <div>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Deltar du eller någon av talarna på OPKoKo för första gången?
          </FormLabel>
          <RadioGroup name="firsTime" onChange={handleChange}>
            {firstTime.map((e) => (
              <FormControlLabel key={e.id} value={e.name} control={<Radio />} label={e.name} />
            ))}
          </RadioGroup>
        </div>
        <Typography sx={{ paddingTop: padding.large }}>
          <p>Deltagarna ska kunna förstå ämnet utifrån titeln. Använd gärna en fyndig titel som väcker intresse men samtidigt förmedlar vad det handlar om</p>
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
          <p>Beskrivningen kommer publiceras i programmet och på Omegapoint Academy webb. En beskrivning som deltagarna läser för att veta om passet passar dem. Håll det kärnfullt, intressant, sälj in det till publiken. Gärna under 100 ord</p>
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
          value={values.takeAway}
          name="takeAway"
          label="Take Away"
          variant="outlined"
        />
        <div>
        <Typography sx={{ paddingTop: padding.large }}>
          <p>En blixt är en kortare föreläsning där man kan belysa ett problem, visa en snygg lösning eller bara presentera någonting som inte kräver en hel föreläsning. Du har 15 minuter på dig och tiden går väldigt fort så klocka dig själv innan, se till att ha en äggklocka under dragningen och ta frågor och diskussioner efter presentationen eller på lunch-/fikarasten). Anmäler du en Workshop/Gruppdiskussion ange längd på ditt bidrag under &quot;Övrig information&quot;</p>
        </Typography>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Typ av pass
          </FormLabel>
          <RadioGroup name="typeOfLecture" onChange={handleChange} value={values.typeOfLecture}>
            {typeOfLecture.map((e) => (
              <FormControlLabel key={e.id} value={e.name} control={<Radio />} label={e.name} />
            ))}
          </RadioGroup>
        </div>
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
        <div>
          <Typography sx={{ paddingTop: padding.large }}>
            <p>Kryssa i rutan nedan om ämnet är känsligt eller konfidentiellt och INTE får publiceras i programmet. Ange också under övrigt om endast Omegapoint-anställda får delta i presentationen</p>
          </Typography>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Intern presentation
          </FormLabel>
          <RadioGroup name="category" onChange={handleChange} value={values.category}>
            <FormControlLabel value="yes" control={<Radio />} label="Ja" />
            <FormControlLabel value="no" control={<Radio />} label="Nej" />
          </RadioGroup>
        </div>
        <Typography sx={{ paddingTop: padding.large }}>
          <p>Vem eller vilka tror du uppskattar ditt pass mest?</p>
        </Typography>
        <TextField
          {...validate.description}
          fullWidth
          onChange={handleChange}
          required
          value={values.targetGroup}
          name="targetGroup"
          label="Målgrupp"
          variant="outlined"
        />
        <Typography sx={{ paddingTop: padding.large }}>
          <p>Detta är viktigt! Kan en åhörare som är HELT nybörjare i ämnet ha utbyte av presentationen eller krävs det mer avancerade kunskaper? Tex, krävs grundläggande kunskaper i kod/matematiska formler? Ska man vara bekväm med docker eller kanske ha arbetat med Kanban?</p>
        </Typography>
        <TextField
          {...validate.requirements}
          fullWidth
          onChange={handleChange}
          name="levelOfRequirements"
          label="Nivå på presentationen"
          variant="outlined"
          value={values.levelOfRequirements}
        />
        <Typography sx={{ paddingTop: padding.large }}>
          <p>Ange om du har några restriktioner för storlek på grupp, t.ex. max 12 personer eller minst 6 personer. Lämnas tomt för vanliga föreläsningar och blixtar</p>
        </Typography>
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
        {/* <TextField
          {...validate.preparations}
          fullWidth
          onChange={handleChange}
          name="preparations"
          label="Förberedelser"
          variant="outlined"
          value={values.preparations}
        /> */}
        <Typography sx={{ paddingTop: padding.large }}>
          <p>Taggar som passar ditt pass </p>
        </Typography>
        <TextField
          {...validate.tags}
          fullWidth
          onChange={handleChange}
          name="tags"
          label="Taggar"
          variant="outlined"
          value={values.tags}
        />
        <Typography sx={{ paddingTop: padding.large }}>
          <p>OBS. Detta kommer inte att skrivas ut i programmet utan är enbart info till programutskottet. Sådant som är relevant för oss att känna till, ett sätt för dig att fråga oss något, be om extra stöd, förklara något av dina svar, beskriva upplägget eller kanske bara sälja in ditt bidrag lite extra</p>
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
