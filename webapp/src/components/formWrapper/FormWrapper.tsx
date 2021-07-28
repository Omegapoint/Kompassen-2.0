import { cloneElement, ReactElement } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { APIFunction } from '../../api/Fetch';
import { IDParam } from '../../lib/Types';
import BigLoader from '../loader/BigLoader';

interface FormWrapperProps {
  children: ReactElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: APIFunction<unknown, any>;
  name: string;
}

const FormWrapper = ({ children, name, fn }: FormWrapperProps): ReactElement => {
  const { id } = useParams<Partial<IDParam>>();
  const { isLoading, data } = useQuery(`${name}-${id}`, () => fn({ id }), { enabled: !!id });
  if (isLoading && id) return <BigLoader />;

  return cloneElement(children, data ? { data } : {});
};

export default FormWrapper;
