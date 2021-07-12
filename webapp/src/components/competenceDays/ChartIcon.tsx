import { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core';
import { LabelRenderProps } from 'react-minimal-pie-chart/types/Label';
import { colors } from '../../theme/Theme';
import DynamicSvg from '../dynamicSVG/DynamicSVG';

const SIZE = 18;

const useStyles = makeStyles(() => ({
  container: {
    '& path': {
      fill: colors.white,
    },
  },
}));

interface ChartIconProps extends LabelRenderProps {
  onMouseOver: () => void;
}

const ChartIcon = ({ dx, dy, x, y, dataEntry, onMouseOver }: ChartIconProps): ReactElement => {
  const classes = useStyles();
  const xPos = x - SIZE / 2 + dx * 1.3;
  const yPos = y - SIZE / 2 + dy * 1.3;
  return (
    <DynamicSvg
      onMouseOver={onMouseOver}
      key={dataEntry.title}
      className={classes.container}
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
