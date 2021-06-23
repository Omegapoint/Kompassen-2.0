import { createStyles, makeStyles } from '@material-ui/core';
import { ReactElement } from 'react';
import Word from './Word';
import { padding } from '../../theme/Theme';

const values = [
  { name: 'Azure', count: 10 },
  { name: 'UX', count: 10 },
  { name: 'SSL', count: 10 },
  { name: 'AML', count: 2 },
  { name: 'Kubernetes', count: 20 },
  { name: 'BDD', count: 3 },
  { name: 'React', count: 12 },
  { name: 'OSINT', count: 6 },
  { name: 'AWL', count: 14 },
  { name: 'Vue', count: 3 },
  { name: 'Koko', count: 9 },
  { name: 'OAuth', count: 2 },
  { name: 'Node.js', count: 8 },
];

const sortedValues = [...values].sort((x, y) => (x.count > y.count ? 1 : -1));

const largest = sortedValues[values.length - 1].count;
const smallest = sortedValues[0].count;

const sizedValues = values.map((e) => ({
  ...e,
  size: 0.8 + (e.count - smallest) / (largest - smallest),
}));

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      gridGap: padding.tiny,
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: padding.small,
    },
  })
);

const WordCloud = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {sizedValues.map((e) => (
        <Word key={e.name} name={e.name} size={e.size} />
      ))}
    </div>
  );
};

export default WordCloud;
