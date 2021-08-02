import { createStyles, makeStyles } from '@material-ui/core';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { listTags } from '../../api/Api';
import { TagStats } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';
import Word from './Word';

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

const differentColors = [
  colors.lightGreen,
  colors.orange,
  colors.teal,
  colors.yellow,
  colors.purple,
];

const WordCloud = (): ReactElement => {
  const classes = useStyles();
  const { data } = useQuery('tags', () => listTags());

  const getTags = (tags: TagStats[]) => {
    if (!tags.length) return [];
    const largest = tags[tags.length - 1].count;
    const smallest = tags[0].count;

    return tags.map((e) => ({
      ...e,
      size: 0.8 + (e.count - smallest) / (largest - smallest),
    }));
  };

  return (
    <div className={classes.container}>
      {getTags(data || []).map((e, i) => (
        <Word
          key={e.tag}
          color={differentColors[i % differentColors.length]}
          name={e.tag}
          size={e.count}
        />
      ))}
    </div>
  );
};

export default WordCloud;
