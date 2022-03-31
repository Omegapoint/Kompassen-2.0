import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { searchAzureUsers } from '../../api/GraphApi';
import { useAppSelector } from '../../lib/Lib';
import { AzureUser } from '../../reducers/session/actions';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface SearchableAzureUser {
  displayName: string;
  id: string;
}

const MultipleSelectBox = () => {
  const { azureUser } = useAppSelector((state) => state.session);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<readonly AzureUser[]>([]);
  const [value, setValue] = useState<AzureUser[]>([]);

  const fixedOptions = [azureUser];

  const onKeyDown = async (e: any) => {
    console.log(value);

    const term = e.target.value;
    setSearchTerm(term);
    if (term.length >= 3) {
      setOptions(await searchAzureUsers(searchTerm));
    }
  };

  return (
    <Autocomplete
      multiple
      filterOptions={(x) => x}
      className="multiSelectBox"
      fullWidth
      options={options}
      onChange={(event, newValue) => {
        setValue([
          ...fixedOptions,
          ...newValue.filter((option) => fixedOptions.indexOf(option) === -1),
        ]);
      }}
      onKeyUp={onKeyDown}
      disableCloseOnSelect
      getOptionLabel={(option) => option.displayName}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            value
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.displayName}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label="Talare" placeholder="" />}
    />
  );
};

export default MultipleSelectBox;
