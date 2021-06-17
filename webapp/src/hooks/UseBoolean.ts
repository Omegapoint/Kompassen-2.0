import { useCallback, useState } from 'react';

interface UseBooleanFunctions {
  on: () => void;
  off: () => void;
  toggle: () => void;
}

const useBoolean = (defaultValue = false): [boolean, UseBooleanFunctions] => {
  const [mode, setMode] = useState(defaultValue);
  const on = useCallback(() => setMode(true), []);
  const off = useCallback(() => setMode(false), []);
  const toggle = useCallback(() => setMode((e) => !e), []);
  return [mode, { on, off, toggle }];
};

export default useBoolean;
