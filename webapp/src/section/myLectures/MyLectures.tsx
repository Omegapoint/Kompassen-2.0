import { makeStyles } from '@material-ui/core';
import { ReactElement, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { deleteLecture, listLectures } from '../../api/Api';
import LectureView from '../../components/lectureView/LectureView';
import BigLoader from '../../components/loader/BigLoader';
import PageNav, { ILectureItems, INavItem } from '../../components/pageNav/PageNav';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridGap: padding.medium,
  },
}));

export type INavItemKind = 'future' | 'draft' | 'past';

const useMyLectures = (data?: Lecture[]) => {
  const [items, setItems] = useState<ILectureItems<INavItemKind> | null>(null);
  const events = useAppSelector((state) => state.events);

  useEffect(() => {
    const findEvent = (id: string, cond: (d: Date) => boolean) => {
      const r = events.find((e1) => id === e1.id);
      return r ? cond(r.endAt) : undefined;
    };

    if (data) {
      setItems({
        draft: data.filter((e) => e.draft),
        future: data.filter((e) => !e.draft && findEvent(e.eventID!, (d) => d > new Date())),
        past: data.filter((e) => findEvent(e.eventID!, (d) => d < new Date())),
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

  const navItems: INavItem<INavItemKind>[] = [
    { name: 'future', title: `Kommande (${items.future.length})` },
    { name: 'draft', title: `Utkast (${items.draft.length})` },
    { name: 'past', title: `Genomförda (${items.past.length})` },
  ];

  return (
    <div className={classes.container}>
      <PageNav active={active} setActive={setActive} navItems={navItems} />
      {currentItems.map((e: Lecture) => (
        <LectureView
          key={e.id}
          lecture={e}
          editIcon={active !== 'past'}
          deleteIcon
          handleDelete={() => handleDelete(e.id)}
        />
      ))}
    </div>
  );
};

export default MyLectures;
