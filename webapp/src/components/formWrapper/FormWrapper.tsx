import { cloneElement, ReactElement, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IDParam } from '../../lib/Types';
import { UseFetchResult } from '../../lib/Hooks';
import BigLoader from '../loader/BigLoader';

interface FormWrapperProps {
  children: ReactElement;
  useHook: () => UseFetchResult<unknown>;
}

const FormWrapper = ({ children, useHook }: FormWrapperProps): ReactElement => {
  const { id } = useParams<Partial<IDParam>>();
  const [resp, request] = useHook();

  useEffect(() => {
    if (id) {
      request({
        urlParams: { id },
      });
    }
  }, [request, id]);

  if (resp.loading && id) return <BigLoader />;

  return cloneElement(children, resp.data ? { data: resp.data } : {});
};

export default FormWrapper;
