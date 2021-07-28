import { makeStyles } from '@material-ui/core';
import { ReactElement, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { listLectures } from '../../api/Api';
import LectureCard from '../../components/lectureCard/LectureCard';
import BigLoader from '../../components/loader/BigLoader';
import MyLecturesNav, {
  ILectureItems,
  INavItemKind,
} from '../../components/myLecturesNav/MyLecturesNav';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridGap: padding.medium,
  },
}));

const useMyLectures = (data?: Lecture[]) => {
  const [items, setItems] = useState<ILectureItems | null>(null);
  const events = useAppSelector((state) => state.events);

  useEffect(() => {
    const findEvent = (id: string, cond: (d: Date) => boolean) => {
      const r = events.find((e1) => id === e1.id);
      return r ? cond(r.endAt) : undefined;
    };

    if (data) {
      setItems({
        notPublished: data.filter((e) => !e.published),
        future: data.filter((e) => findEvent(e.id, (d) => d > new Date())),
        past: data.filter((e) => findEvent(e.id, (d) => d < new Date())),
      });
    }
  }, [data, events]);
  return items;
};

const MyLectures = (): ReactElement => {
  const classes = useStyles();
  const [active, setActive] = useState<INavItemKind>('future');
  const { data, isLoading } = useQuery('listMyLectures', () => listLectures({ mine: 'true' }));

  const items = useMyLectures(data);

  if (isLoading || !items) return <BigLoader />;

  const currentItems = items[active];

  return (
    <div className={classes.container}>
      <MyLecturesNav active={active} setActive={setActive} items={items} />
      {currentItems.map((e) => (
        <LectureCard key={e.id} lecture={e} />
      ))}
    </div>
  );
};

export default MyLectures;
