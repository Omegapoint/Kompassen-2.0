import { Box, Typography } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { deleteLecture, listLectures } from '../../api/Api';
import LectureView from '../../components/lectureView/LectureView';
import BigLoader from '../../components/loader/BigLoader';
import PageNav, { ILectureItems, INavItem } from '../../components/pageNav/PageNav';
import useCacheUpdater from '../../hooks/useCacheUpdater';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';

export type INavItemKind = 'ideas' | 'future' | 'draft' | 'past';

const useMyLectures = (data?: Lecture[]) => {
  const [items, setItems] = useState<ILectureItems<INavItemKind> | null>(null);
  const events = useAppSelector((state) => state.events);

  useEffect(() => {
    const findEvent = (id: string, cond: (d: Date) => boolean) => {
      const event = events.find((e1) => id === e1.id);
      return event ? cond(event.endAt) : undefined;
    };

    if (data) {
      setItems({
        ideas: data.filter((e) => e.idea && !e.eventID),
        draft: data.filter((e) => e.draft && !e.idea),
        future: data.filter((e) => !e.draft && findEvent(e.eventID!, (d) => d > new Date())),
        past: data.filter((e) => findEvent(e.eventID!, (d) => d < new Date())),
      });
    }
  }, [data, events]);
  return items;
};

const MyLectures = (): ReactElement => {
  const user = useAppSelector((state) => state.user);
  const [active, setActive] = useState<INavItemKind>('future');
  const [cacheKey, updateCache] = useCacheUpdater();
  const { data, isLoading } = useQuery(`listMyLectures-${cacheKey}`, () => listLectures());
  const [myData, setMyData] = useState<Lecture[]>();
  const statuses = useAppSelector((state) => state.statuses);

  useEffect(() => {
    if (data) {
      const contributions = data.filter((lecture) =>
        lecture.lecturers?.some((lecturer) => lecturer.userID === user.id)
      );
      const contributionsWithoutADConnectionOnLecturers = data.filter(
        (lecture) => lecture.lecturerID === user.id
      );
      const allMyContributions = new Set(contributions);
      contributionsWithoutADConnectionOnLecturers.map((e) => allMyContributions.add(e));
      setMyData([...allMyContributions]);
    }
  }, [data, user.id]);

  const deleteLectureRequest = useMutation(deleteLecture);
  const items = useMyLectures(myData);

  const handleDelete = async (cardID: string) => {
    await deleteLectureRequest.mutateAsync({ id: cardID });
    updateCache();
  };

  if (isLoading || !items) return <BigLoader />;
  const currentItems = items[active];

  const navItems: INavItem<INavItemKind>[] = [
    { name: 'ideas', title: `Idéer (${items.ideas.length})` },
    { name: 'future', title: `Kommande (${items.future.length})` },
    { name: 'draft', title: `Utkast (${items.draft.length})` },
    { name: 'past', title: `Genomförda (${items.past.length})` },
  ];

  return (
    <Box sx={{ display: 'grid', gridGap: padding.medium }}>
      <Box
        sx={{
          display: 'flex',
          background: colors.primary,
          width: '100%',
          padding: padding.small,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" color={colors.white}>
          Kom ihåg att fylla i din talarbio! Det gör du i menyn under din profil. Skicka också gärna
          in en pitch (video) för ditt bidrag här nedan!
        </Typography>
      </Box>
      <PageNav active={active} setActive={setActive} navItems={navItems} />
      {currentItems.map((lecture: Lecture) => {
        const immutable =
          statuses.some(
            (status) =>
              status.id === lecture.status?.statusID &&
              (status?.name === 'Accepterad' || status?.name === 'Feedback')
          ) || active === 'past';
        return (
          <LectureView
            key={lecture.id}
            lecture={lecture}
            editIcon={!immutable}
            deleteIcon={!immutable}
            onSuccess={updateCache}
            handleDelete={() => handleDelete(lecture.id)}
          />
        );
      })}
    </Box>
  );
};
export default MyLectures;
