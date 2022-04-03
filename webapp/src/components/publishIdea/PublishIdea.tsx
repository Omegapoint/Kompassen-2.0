import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { IEmojiData } from 'emoji-picker-react';
import { FormEvent, MouseEvent, ReactElement } from 'react';
import { useMutation } from 'react-query';
import { createLectureIdea } from '../../api/Api';
import useForm from '../../hooks/UseForm';
import { formIsInvalid, FormValidation, useFormValidation } from '../../hooks/UseFormValidation';
import { LARGE_STRING_LEN, SHORT_STRING_LEN } from '../../lib/Constants';
import { borderRadius, colors, padding } from '../../theme/Theme';
import TextPanel from '../textPanel/TextPanel';

interface PublishIdeaProps {
  cancel: () => void;
  opkoko: boolean;
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
// The simple lecture form on the homepage
const PublishIdea = ({ cancel, opkoko }: PublishIdeaProps): ReactElement => {
  const { values, handleChange, appendChange } = useForm(defaultFormValue);
  const { validate, invalid } = useValidate(values);
  const { mutateAsync } = useMutation(createLectureIdea);

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    await mutateAsync({
      title: values.title,
      description: values.description,
      tags: [
        ...new Set(
          values.tags
            .split(' ')
            .map((e) => e.trim())
            .filter((e) => e)
        ),
      ],
      lecturer: null,
    });
    cancel();
  };

  const handleSmiley = (_: MouseEvent, data: IEmojiData) => {
    appendChange('description', data.emoji);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'grid', gridAutoFlow: 'column', gridTemplateColumns: 'min-content 1fr' }}>
        <Box
          sx={{
            width: '6px',
            background: colors.primary,
            borderRadius: `${borderRadius.small} 0 0 ${borderRadius.small}`,
          }}
        />
        <Paper
          sx={{
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
          }}
        >
          <Typography sx={{ gridArea: 'header', justifySelf: 'center' }} variant="h2">
            Ny idé
          </Typography>
          <TextField
            {...validate.title}
            sx={{ gridArea: 'title' }}
            fullWidth
            onChange={handleChange}
            required
            name="title"
            label="Ämne"
            variant="outlined"
          />
          <Box sx={{ gridArea: 'content', width: '100%' }}>
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
              label={
                opkoko
                  ? 'Vad är det du vill höra mer om? Beskriv så tydligt du kan för att underlätta för dina kollegor att plocka idén!'
                  : 'Innehåll'
              }
              variant="outlined"
            />
            <TextPanel handleEmojiClick={handleSmiley} />
          </Box>

          <TextField
            {...validate.tags}
            sx={{ gridArea: 'tags' }}
            fullWidth
            onChange={handleChange}
            name="tags"
            label="Taggar (minst 1)"
            variant="outlined"
          />
          {!opkoko && (
            <FormControl sx={{ gridArea: 'status' }} component="fieldset">
              <FormLabel sx={{ paddingTop: padding.minimal }} component="legend">
                Typ
              </FormLabel>
              <RadioGroup name="status" onChange={handleChange} value={values.status}>
                <FormControlLabel value="lecturer_wanted" control={<Radio />} label="Öppen idé" />
                <FormControlLabel
                  value="feedback_wanted"
                  control={<Radio />}
                  label="Jag vill hålla passet, söker feedback"
                />
              </RadioGroup>
            </FormControl>
          )}
          <IconButton
            sx={{ gridArea: 'cancel', padding: 0 }}
            onClick={cancel}
            color="primary"
            size="large"
          >
            <Typography>Avbryt</Typography>
          </IconButton>
          <Button
            sx={{ gridArea: 'submit' }}
            onClick={handleSubmit}
            disabled={invalid}
            variant="contained"
            color="primary"
          >
            Publicera idé
          </Button>
        </Paper>
      </Box>
    </form>
  );
};

export default PublishIdea;
