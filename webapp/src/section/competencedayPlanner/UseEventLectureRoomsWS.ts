import { useEffect, useState } from 'react';
import useUnmount from '../../hooks/UseUnmount';
import { formatDates, useAppSelector } from '../../lib/Lib';
import { IDParam, LectureRoom } from '../../lib/Types';

const useEventLectureRoomsWS = (id: string): LectureRoom[] => {
  const socket = useAppSelector((state) => state.session.socket);
  const [lectureRooms, setLectureRooms] = useState<LectureRoom[]>([]);
  const mounted = useUnmount();

  useEffect(() => {
    if (socket) {
      socket.on(`event/${id}/room/lecture`, (li) => {
        if (mounted.current) {
          setLectureRooms(formatDates(li));
        }
      });

      socket.on(`event/${id}/lecture/room/update`, (lectureRoom: LectureRoom) => {
        if (mounted.current) {
          setLectureRooms((oldLectureRooms) =>
            oldLectureRooms.map((e) => (e.id === lectureRoom.id ? formatDates(lectureRoom) : e))
          );
        }
      });

      socket.on(`event/${id}/lecture/room/create`, (lectureRoom: LectureRoom) => {
        if (mounted.current) {
          setLectureRooms((oldLectureRooms) => [formatDates(lectureRoom), ...oldLectureRooms]);
        }
      });

      socket.on(`event/${id}/lecture/room/delete`, (idParam: IDParam) => {
        if (mounted.current) {
          setLectureRooms((oldLectureRooms) => oldLectureRooms.filter((e) => e.id !== idParam.id));
        }
      });

      socket.on(`event/${id}/room/delete`, (idParam: IDParam) => {
        if (mounted.current) {
          setLectureRooms((oldLectureRooms) =>
            oldLectureRooms.filter((e) => e.roomID !== idParam.id)
          );
        }
      });

      socket.emit('event/lecture/room/join', id);

      return () => {
        socket.emit('event/lecture/room/leave', id);
      };
    }
    return () => {};
  }, [id, mounted, socket]);

  return lectureRooms;
};

export default useEventLectureRoomsWS;
