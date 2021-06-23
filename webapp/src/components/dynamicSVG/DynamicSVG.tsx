import React, { ReactElement, SVGProps, useEffect, useState } from 'react';

interface DynamicSvgProps extends SVGProps<SVGSVGElement> {
  url: string;
}

const DynamicSvg = ({ url, onMouseOver, ...svgProps }: DynamicSvgProps): ReactElement => {
  const [state, setState] = useState<string>('');
  useEffect(() => {
    (async () => {
      const resp = await fetch(url);
      const text = await resp.text();
      setState(text);
    })();
  }, [url]);

  return (
    <svg
      style={{ cursor: 'pointer' }}
      onMouseOver={onMouseOver}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...svgProps}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: state }}
    />
  );
};

export default DynamicSvg;
