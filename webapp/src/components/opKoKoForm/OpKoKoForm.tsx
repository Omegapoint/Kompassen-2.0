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
import { Category, Format, Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';
import MultipleSelectBox from '../multipleSelectBox/MultipleSelectBox';
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
  const categories = allCategories.filter((e) => e.name !== 'Information');
  const { azureUser } = useAppSelector((state) => state.session);
  const formats = useAppSelector((state) => state.formats);
  const createLectureRequest = useMutation(createLecture);
  const updateLectureRequest = useMutation(updateLecture);
  const navigate = useNavigate();

  console.log(data?.firstTimePresenting?.toString());
  const defaultFormValue = {
    eventID: '334de9fb-058d-4eaa-a698-ca58aa2d2ab0',
    title: data?.title || '',
    lecturer: azureUser.displayName,
    firstTimePresenting: data?.firstTimePresenting?.toString() || 'false',
    keyTakeAway: data?.keyTakeaway || '',
    categoryID: categories.find((cat) => cat.id === data?.categoryID)?.id || categories[0].id,
    formatID: formats.find((format) => format.id === data?.formatID)?.id || formats[0].id,
    targetAudience: data?.targetAudience || '',
    internal: data?.internalPresentation?.toString() || 'false',
    tags: data?.tags?.toString() || '',
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
      keyTakeaway: values.keyTakeAway || null,
      requirements: values.requirements || null,
      message: values.message || null,
      internalPresentation: !values.internal,
      firstTimePresenting: !values.firstTimePresenting,
      targetAudience: values.targetAudience || null,
      formatID: format.id,
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
          <Typography
            sx={{ display: 'grid', justifySelf: 'center', color: colors.orange }}
            variant="h6"
          >
            Anmälan stänger kl 23.59 17 april 2022
          </Typography>
        </Typography>
        <InfoText />

        <MultipleSelectBox />

        <div>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Deltar någon av talarna på OPKoKo för första gången?
          </FormLabel>

          <RadioGroup
            name="firstTimePresenting"
            onChange={handleChange}
            value={values.firstTimePresenting}
          >
            <FormControlLabel key="true" value="true" control={<Radio />} label="Ja" />
            <FormControlLabel key="false" value="false" control={<Radio />} label="Nej" />
          </RadioGroup>
        </div>
        <TextField
          fullWidth
          onChange={handleChange}
          required
          value={values.title}
          name="title"
          label="Titel: koncist och fyndigt - intressera oss för bidraget!"
          variant="outlined"
          {...validate.title}
        />

        <TextField
          {...validate.description}
          fullWidth
          multiline
          minRows={8}
          maxRows={12}
          onChange={handleChange}
          required
          value={values.description}
          name="description"
          label="Beskrivning: publiceras i programmet och på Omegapoint Academy webb. Håll det kärnfullt,
          intressant, sälj in det till publiken! Gärna under 100 ord"
          variant="outlined"
        />

        <TextField
          {...validate.description}
          fullWidth
          multiline
          minRows={1}
          maxRows={2}
          onChange={handleChange}
          required
          value={values.keyTakeAway}
          name="keyTakeAway"
          label="Key Take Away: om deltagarna bara minns en sak - vad är det då de kommer att minnas?"
          variant="outlined"
        />
        <div>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Format (för speciellt önskemål om längd på formatet, ange i sista rutan i formuläret)
          </FormLabel>
          <RadioGroup name="formatID" onChange={handleChange} value={values.formatID}>
            {formats.map((e) =>
              e.name === 'Blixtföreläsning ' ? (
                <FormControlLabel
                  key={e.id}
                  value={e.id}
                  control={<Radio />}
                  // eslint-disable-next-line
                  label={e.name + ' (15min)'}
                />
              ) : (
                <FormControlLabel key={e.id} value={e.id} control={<Radio />} label={e.name} />
              )
            )}
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
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Intern presentation (ämnet känsligt/konfidentiellt)
          </FormLabel>
          <RadioGroup name="internal" onChange={handleChange} value={values.internal}>
            <FormControlLabel key="true" value="true" control={<Radio />} label="Ja" />
            <FormControlLabel key="false" value="false" control={<Radio />} label="Nej" />
          </RadioGroup>
        </div>
        <TextField
          {...validate.targetAudience}
          fullWidth
          onChange={handleChange}
          required
          value={values.targetAudience}
          name="targetAudience"
          label="Målgrupp: vem eller vilka tror du uppskattar ditt pass mest?"
          variant="outlined"
        />

        <TextField
          {...validate.requirements}
          fullWidth
          onChange={handleChange}
          name="requirements"
          label="Nivå på presentationen: kan en åhörare som är HELT nybörjare i ämnet ha utbyte av
          presentationen eller krävs det mer avancerade kunskaper?"
          variant="outlined"
          value={values.requirements}
        />

        <TextField
          {...validate.message}
          fullWidth
          onChange={handleChange}
          name="message"
          label="Meddelande till planerare: publiceras ej med bidraget, detta är enbart info till
          programutskottet. Be om extra stöd, förklara något av dina svar, beskriv upplägget mer eller
          kanske bara sälja in bidraget lite extra."
          multiline
          minRows={3}
          maxRows={6}
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
