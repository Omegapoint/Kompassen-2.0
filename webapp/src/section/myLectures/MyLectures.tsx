import { makeStyles } from '@material-ui/core';
import { ReactElement, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { deleteLecture, listLectures } from '../../api/Api';
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
        draft: data.filter((e) => !e.published),
        future: data.filter((e) => e.published && findEvent(e.eventID, (d) => d > new Date())),
        past: data.filter((e) => findEvent(e.eventID, (d) => d < new Date())),
      });
    }
  }, [data, events]);
  return items;
};

const MyLectures = (): ReactElement => {
  const classes = useStyles();
  const [forceUpdate, setForceUpdate] = useState('');
  const [active, setActive] = useState<INavItemKind>('future');
  const { data, isLoading, refetch } = useQuery(`listMyLectures-${forceUpdate}`, () =>
    listLectures({ mine: 'true' })
  );
  const deleteLectureRequest = useMutation(deleteLecture);

  const handleDelete = async (cardID: string) => {
    await deleteLectureRequest.mutateAsync({ id: cardID });
    setForceUpdate(cardID);
  };

  useEffect(() => {
    refetch();
  }, [forceUpdate, refetch]);

  const items = useMyLectures(data);

  if (isLoading || !items) return <BigLoader />;
  const currentItems = items[active];

  return (
    <div className={classes.container}>
      <MyLecturesNav active={active} setActive={setActive} items={items} />
      {currentItems.map((e) => (
        <LectureCard
          key={e.id}
          lecture={e}
          editIcon={active !== 'past'}
          deleteIcon
          handleDelete={async () => {
            handleDelete(e.id);
          }}
        />
      ))}
    </div>
  );
};

export default MyLectures;
