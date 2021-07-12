import { ReactElement, SVGProps, useEffect, useState } from 'react';

interface DynamicSvgProps extends SVGProps<SVGSVGElement> {
  url?: string;
  svg?: string;
}

const DynamicSvg = ({ url, svg, onMouseOver, ...svgProps }: DynamicSvgProps): ReactElement => {
  const [state, setState] = useState<string>('');

  useEffect(() => {}, []);

  useEffect(() => {
    if (url) {
      (async () => {
        const resp = await fetch(url);
        const text = await resp.text();
        setState(text);
      })();
    }
  }, [url]);

  return (
    <svg
      style={{ cursor: 'pointer' }}
      onMouseOver={onMouseOver}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...svgProps}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: state || svg || '' }}
    />
  );
};

export default DynamicSvg;
