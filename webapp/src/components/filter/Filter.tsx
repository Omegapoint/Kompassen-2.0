import { Search } from '@mui/icons-material';
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
  TextField,
} from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { useAppSelector } from '../../lib/Lib';
import { Event, Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import LectureIdea from '../lecture/Lecture';

const formControlStyle: SxProps = {
  marginBottom: padding.standard,
  minWidth: 120,
};

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

// Show cards that is scheduled for the future.
const findFutureEvent = (events: Event[]) => events.find((e) => e.startAt > new Date())?.id;

// filter the "Filtrera" - dropdown
const handleFilters = (value: string, sorted: Lecture[], events: Event[]): Lecture[] => {
  switch (value) {
    case 'lecturer':
      return sorted.filter((lecture) => lecture.lecturer !== null);
    case 'null':
      return sorted.filter((lecture) => lecture.lecturer === null);
    default:
      return sorted.filter((lecture) => lecture.eventID === findFutureEvent(events));
  }
};

// searchbar filtering based on title and description
const handleSearch = (value: string, filtered: Lecture[]): Lecture[] => {
  if (!value) return filtered;
  return filtered.filter((lecture) => {
    const title = lecture.title.toLowerCase();
    const description = lecture.description.toLowerCase();
    return title.includes(value.toLowerCase()) || description.includes(value.toLowerCase());
  });
};

const Filter = ({ lectures }: FilterProps): ReactElement => {
  const [filteredLectures, setLectures] = useState(lectures);
  const events = useAppSelector((state) => state.events);

  const [options, setOptions] = useState({
    sort: '',
    filter: '',
    search: '',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOptions = (event: any) => {
    setOptions({ ...options, [event.target.name as string]: event.target.value });
  };

  useEffect(() => {
    const sorted = handleSort(options.sort, lectures);
    const filtered = handleFilters(options.filter, sorted, events);
    const finished = handleSearch(options.search, filtered);
    setLectures(finished);
  }, [lectures, events, options]);

  return (
    <div>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          alignItems: 'top',
          gridTemplateColumns: 'initial initial auto',
          columnGap: padding.standard,
        }}
      >
        <FormControl variant="filled" sx={formControlStyle}>
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
        <FormControl variant="filled" sx={formControlStyle}>
          <InputLabel shrink>Filter</InputLabel>
          <Select
            value={options.filter}
            name="filter"
            onChange={(e) => handleOptions(e)}
            autoWidth
            displayEmpty
          >
            <MenuItem value="">&nbsp;</MenuItem>
            <MenuItem value="null">Öppen idé</MenuItem>
            <MenuItem value="lecturer">Söker feedback</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={formControlStyle}
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
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridGap: padding.standard,
          alignContent: 'start',
        }}
      >
        {filteredLectures.map((lecture) => (
          <LectureIdea key={lecture.id} lecture={lecture} />
        ))}
      </Box>
    </div>
  );
};

export default Filter;
