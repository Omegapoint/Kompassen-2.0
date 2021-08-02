import { ChangeEvent, useCallback, useState } from 'react';

interface FormReturn<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (e: ChangeEvent | any) => void;
  values: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateValues: (e: Record<string, any>) => void;
  deleteValue: (key: string) => void;
  appendChange: (name: string, value: string) => void;
  resetValues: (obj: T) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useForm<T extends Record<string, any>>(initialState: T): FormReturn<T> {
  const [values, setValues] = useState(initialState || {});

  const updateValues = useCallback((newVal) => {
    setValues((v) => ({ ...v, ...newVal }));
  }, []);

  const deleteValue = useCallback((key) => {
    setValues((v) => {
      const temp = { ...v };
      delete temp[key];
      return { ...v };
    });
  }, []);

  const handleChange = useCallback((e) => {
    if (e.persist) e.persist();
    const { value, type, checked, name } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setValues((v) => ({ ...v, [name]: val }));
  }, []);

  const appendChange = useCallback((name, value) => {
    setValues((v) => ({ ...v, [name]: v[name] + value }));
  }, []);

  const resetValues = useCallback((obj = {}) => {
    setValues(obj);
  }, []);

  return {
    handleChange,
    values,
    updateValues,
    deleteValue,
    appendChange,
    resetValues,
  };
}

export default useForm;
