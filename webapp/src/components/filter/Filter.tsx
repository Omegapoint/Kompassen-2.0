import {
  FormControl,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import LectureIdea from '../lecture/Lecture';

const useStyles = makeStyles(() => ({
  formControl: {
    marginBottom: padding.standard,
    minWidth: 120,
  },
  leftPanel: {
    display: 'grid',
    gridGap: padding.standard,
    alignContent: 'start',
  },
  oneRow: {
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'top',
    gridTemplateColumns: 'initial initial auto',
    columnGap: padding.standard,
  },
}));

interface FilterProps {
  lectures: Lecture[];
}

// Sort the "Sortera" - dropdown
const handleSort = (value: string, lectures: Lecture[]): Lecture[] => {
  const sorted = [...lectures];
  if (value === 'old') {
    sorted.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  } else if (value === 'new') {
    sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  return sorted;
};

// filter the "Filtrera" - dropdown
const handleFilters = (value: string, sorted: Lecture[]): Lecture[] => {
  const filtered = [...sorted];
  switch (value) {
    case 'lecturer':
      return sorted.filter((lecture) => lecture.lecturer !== null);
    case 'null':
      return sorted.filter((lecture) => lecture.lecturer === null);
    default:
      return filtered;
  }
};

// searchbar filtering based on title and description
const handleSearch = (value: string, filtered: Lecture[]): Lecture[] => {
  const search = [...filtered];
  if (!value) {
    return search;
  }
  return search.filter((lecture) => {
    const title = lecture.title.toLowerCase();
    const description = lecture.description.toLowerCase();
    if (title.includes(value.toLowerCase()) || description.includes(value.toLowerCase())) {
      return true;
    }
    return false;
  });
};

const Filter = ({ lectures }: FilterProps): ReactElement => {
  const classes = useStyles();
  const [filteredLectures, setLectures] = useState(lectures);

  const [options, setOptions] = useState({
    sort: '',
    filter: '',
    search: '',
  });

  const handleOptions = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    setOptions({ ...options, [event.target.name as string]: event.target.value });
  };

  useEffect(() => {
    const sorted = handleSort(options.sort, lectures);
    const filtered = handleFilters(options.filter, sorted);
    const finished = handleSearch(options.search, filtered);
    setLectures(finished);
  }, [lectures, options]);

  return (
    <div>
      <div className={classes.oneRow}>
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel shrink>Sortera</InputLabel>
          <Select
            value={options.sort}
            name="sort"
            onChange={(e) => handleOptions(e)}
            autoWidth
            displayEmpty
          >
            <MenuItem value="">&nbsp;</MenuItem>
            <MenuItem value="new">Nyast först</MenuItem>
            <MenuItem value="old">Äldst först</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel shrink>Filter</InputLabel>
          <Select
            value={options.filter}
            name="filter"
            onChange={(e) => handleOptions(e)}
            autoWidth
            displayEmpty
          >
            <MenuItem value="">&nbsp;</MenuItem>
            <MenuItem value="null">Söker passhållare</MenuItem>
            <MenuItem value="lecturer">Söker feedback</MenuItem>
          </Select>
        </FormControl>
        <TextField
          className={classes.formControl}
          value={options.search}
          onChange={(e) => handleOptions(e)}
          name="search"
          label="Sök titel eller beskrivning"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className={classes.leftPanel}>
        {filteredLectures.map((lecture) => (
          <LectureIdea key={lecture.id} lecture={lecture} />
        ))}
      </div>
    </div>
  );
};
export default Filter;
