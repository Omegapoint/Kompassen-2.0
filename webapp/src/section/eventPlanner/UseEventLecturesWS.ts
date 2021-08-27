import { useEffect, useState } from 'react';
import useUnmount from '../../hooks/UseUnmount';
import { formatDates, useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';

const useEventLecturesWS = (id: string): Lecture[] => {
  const socket = useAppSelector((state) => state.session.socket);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const mounted = useUnmount();

  useEffect(() => {
    if (socket) {
      socket.on(`event/${id}/lecture`, (li) => {
        if (mounted.current) {
          setLectures(formatDates(li));
        }
      });

      socket.on(`event/${id}/lecture/update`, (lecture: Lecture) => {
        if (mounted.current) {
          setLectures((ideas) =>
            ideas.map((e) => (e.id === lecture.id ? formatDates(lecture) : e))
          );
        }
      });

      socket.on(`event/${id}/lecture/create`, (lecture: Lecture) => {
        if (mounted.current) {
          setLectures((ideas) => [formatDates(lecture), ...ideas]);
        }
      });

      socket.on(`event/${id}/lecture/delete`, (lecture: Lecture) => {
        if (mounted.current) {
          setLectures((ideas) => ideas.filter((e) => e.id !== lecture.id));
        }
      });
      socket.emit('event/lecture/join', id);

      return () => {
        socket.emit('event/lecture/leave', id);
      };
    }
    return () => {};
  }, [id, mounted, socket]);

  return lectures;
};

export default useEventLecturesWS;
