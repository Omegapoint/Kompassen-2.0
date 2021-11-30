import { css } from '@emotion/css';
import { ReactElement } from 'react';
import { LabelRenderProps } from 'react-minimal-pie-chart/types/Label';
import { colors } from '../../theme/Theme';
import DynamicSvg from '../dynamicSVG/DynamicSVG';

const container = css`
  & path {
    fill: ${colors.white};
  }
`;

const SIZE = 18;

interface ChartIconProps extends LabelRenderProps {
  onMouseOver: () => void;
  one: boolean;
}

const ChartIcon = ({ one, dx, dy, x, y, dataEntry, onMouseOver }: ChartIconProps): ReactElement => {
  const xPos = x - SIZE / 2 + dx * 1.3;
  const yPos = y - SIZE / 2 + (one ? 0 : dy * 1.3);
  return (
    <DynamicSvg
      onMouseOver={onMouseOver}
      key={dataEntry.title}
      className={container}
      svg={dataEntry.title as string}
      x={xPos}
      y={yPos}
      dominantBaseline="central"
      width={SIZE}
      height={SIZE}
    />
  );
};
export default ChartIcon;
