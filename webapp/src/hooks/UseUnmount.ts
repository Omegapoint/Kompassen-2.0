import { MutableRefObject, useEffect, useRef } from 'react';

const UseUnmount = (): MutableRefObject<boolean> => {
  const mounted = useRef(true);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );
  return mounted;
};

export default UseUnmount;
