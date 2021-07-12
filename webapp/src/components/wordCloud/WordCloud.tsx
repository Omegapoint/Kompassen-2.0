import { createStyles, makeStyles } from '@material-ui/core';
import { ReactElement, useEffect } from 'react';
import Word from './Word';
import { padding } from '../../theme/Theme';
import { useListTags } from '../../lib/Hooks';
import { TagStats } from '../../lib/Types';
import SmallLoader from '../loader/SmallLoader';

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
  const [listTags, listTagsRequest] = useListTags();
  useEffect(() => {
    listTagsRequest();
  }, [listTagsRequest]);

  if (!listTags.data) return <SmallLoader />;

  const getTags = (tags: TagStats[]) => {
    const largest = tags[tags.length - 1].count;
    const smallest = tags[0].count;

    return tags.map((e) => ({
      ...e,
      size: 0.8 + (e.count - smallest) / (largest - smallest),
    }));
  };

  return (
    <div className={classes.container}>
      {getTags(listTags.data || []).map((e) => (
        <Word key={e.tag} name={e.tag} size={e.count} />
      ))}
    </div>
  );
};

export default WordCloud;
