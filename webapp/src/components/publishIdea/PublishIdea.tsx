import { useState, ReactElement, useReducer, ChangeEvent, FormEvent } from 'react';
import Picker, { IEmojiData } from 'emoji-picker-react';
import { EmojiEmotions } from '@material-ui/icons';
import {
  Button,
  createStyles,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  makeStyles,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import { colors, padding } from '../../theme/Theme';

const useStyles = makeStyles(() =>
  createStyles({
    page: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridTemplateColumns: 'min-content 1fr',
    },
    formContainer: {
      display: 'grid',
      justifyItems: 'start',
      gridGap: padding.medium,
      gridTemplateColumns: 'max-content 1fr max-content',
      gridTemplateAreas: `". header ."
                          "title title title"
                          "content content content"
                          "tags tags tags"
                          "location desire ."
                          "cancel . submit"`,
      padding: padding.medium,
      '& > *': {
        gridColumn: '1 / 4',
      },
    },
    line: {
      width: '6px',
      background: colors.primary,
      borderRadius: '10px 0 0 10px',
    },
  })
);

interface PublishIdeaProps {
  cancel: () => void;
}

interface ReducerState {
  content: string;
  title: string;
  tags: string;
  city: string;
  desire: string;
}

type ReducerKeys = keyof ReducerState;

interface Action {
  type: 'SET' | 'APPEND';
  name: ReducerKeys;
  value: string;
}

const reducer = (state: ReducerState, action: Action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.name]: action.value };
    case 'APPEND':
      return { ...state, [action.name]: state[action.name] + action.value };
    default:
      throw new Error();
  }
};

const PublishIdea = ({ cancel }: PublishIdeaProps): ReactElement => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [state, dispatch] = useReducer(reducer, {
    content: '',
    title: '',
    tags: '',
    city: '',
    desire: '',
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInput = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    dispatch({ type: 'SET', name: name as ReducerKeys, value });
  };

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    // console.log(state);
  };

  const handleSmiley = (_: unknown, data: IEmojiData) => {
    dispatch({ type: 'APPEND', name: 'content', value: data.emoji });
  };

  const open = Boolean(anchorEl);

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.page}>
        <div className={classes.line} />
        <Paper className={classes.formContainer}>
          <Typography style={{ justifySelf: 'center' }} variant="h2">
            Ny idé
          </Typography>
          <TextField
            fullWidth
            onChange={handleInput}
            required
            name="title"
            label="Titel"
            variant="outlined"
          />
          <div style={{ width: '100%' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              rowsMax={5}
              value={state.content}
              onChange={handleInput}
              required
              name="content"
              label="Innehåll"
              variant="outlined"
            />
            <IconButton onClick={handleClick}>
              <EmojiEmotions />
            </IconButton>
          </div>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Picker onEmojiClick={handleSmiley} />
          </Popover>
          <TextField
            fullWidth
            onChange={handleInput}
            name="tags"
            label="Taggar"
            variant="outlined"
          />

          <FormControl style={{ gridArea: 'location' }} component="fieldset">
            <FormLabel required component="legend">
              Plats
            </FormLabel>
            <RadioGroup name="city" onChange={handleInput}>
              <FormControlLabel value="stockholm" control={<Radio />} label="Stockholm" />
              <FormControlLabel value="umeå" control={<Radio />} label="Umeå" />
              <FormControlLabel value="distans" control={<Radio />} label="Distans" />
            </RadioGroup>
          </FormControl>
          <FormControl style={{ gridArea: 'desire' }} component="fieldset">
            <FormLabel component="legend">Typ av idé</FormLabel>
            <RadioGroup name="desire" onChange={handleInput}>
              <FormControlLabel value="sökes" control={<Radio />} label="Passhållare sökes" />
              <FormControlLabel value="önskas" control={<Radio />} label="Endast feedback önskas" />
            </RadioGroup>
          </FormControl>

          <IconButton style={{ gridArea: 'cancel', padding: 0 }} onClick={cancel} color="primary">
            <Typography>Avbryt</Typography>
          </IconButton>
          <Button
            style={{ gridArea: 'submit' }}
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
