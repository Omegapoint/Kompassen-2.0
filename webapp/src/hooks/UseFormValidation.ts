import { useCallback, useState } from 'react';

export type FormValidate<T> = {
  [key in keyof Partial<T>]: Valid;
};

export type FormValidation<T> = {
  validate: FormValidate<T>;
  invalid: boolean;
};

export interface Valid {
  error: boolean;
  helperText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBlur: (isLocal?: any) => boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formIsInvalid(validate: FormValidate<any>): boolean {
  return Object.values(validate).reduce<boolean>((s, e) => s || e.onBlur(true), false);
}

export function useFormValidation<T>(
  value: T,
  helperText: string,
  fn: (value: T) => boolean
): Valid {
  const [error, setError] = useState(false);

  const onBlur = useCallback(
    (isLocal = false): boolean => {
      const valid = fn(value);
      if (!(typeof isLocal === 'boolean' && isLocal)) setError(valid);
      return valid;
    },
    [fn, value]
  );

  return { error, helperText: error ? helperText : '', onBlur };
}
