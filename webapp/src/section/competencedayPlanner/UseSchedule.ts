import { add, differenceInMinutes } from 'date-fns';
import { useEffect, useState } from 'react';
import { createLectureRoom, deleteLectureRoom, updateLectureRoom } from '../../api/Api';
import { Event, Lecture } from '../../lib/Types';
import { cellHeight } from './LectureCard';
import { Position } from './ScheduledLecture';
import useEventLectureRoomsWS from './UseEventLectureRoomsWS';

export type DragStopFn = (
  lecture: Lecture,
  startPos: Position,
  pos: Position,
  offsetX: number,
  offsetY: number,
  isDraggedFromSchedule: boolean
) => void;

export const heightByMin = (min: number): number => (min / 60) * cellHeight;

export const NUM_COLUMNS = 4;
export const MINUTES = 5;
export const COL_HEIGHT = heightByMin(MINUTES);

const genScheduledCol = (numRows: number) => new Array(numRows).fill(null);

const genScheduled = (event: Event, numRows: number) =>
  [...new Array(event.rooms.length)].map(() => genScheduledCol(numRows));

function splitIntoChunks([...array]: Lecture[]) {
  const result = [];
  for (let i = NUM_COLUMNS; i > 0; i -= 1) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}

export const toYCol = (y: number): number => Math.round(y / COL_HEIGHT);

interface UseScheduleRet {
  handleDragStop: DragStopFn;
  numRows: number;
  sideline: Lecture[][];
  scheduled: (Lecture | null)[][];
}

const useSchedule = (event: Event, lectures: Lecture[], colWidth: number): UseScheduleRet => {
  const lectureRooms = useEventLectureRoomsWS(event.id);
  const interval = differenceInMinutes(event.endAt, event.startAt);
  const numRows = Math.ceil(interval / MINUTES);

  const [scheduled, setScheduled] = useState<(Lecture | null)[][]>(genScheduled(event, numRows));
  const [sideline, setSideline] = useState<Lecture[][]>(splitIntoChunks(lectures));
  const [scheduleMapping, setScheduleMapping] = useState<{ ind: number; id: string }[]>([]);

  useEffect(() => {
    const roomIds = event.rooms.reduce<Record<string, number>>(
      (s, room, i) => ({ ...s, [room.id]: i }),
      {}
    );
    setScheduled((oldScheduled) =>
      lectureRooms.reduce((s, lectureRoom) => {
        const ind = roomIds[lectureRoom.roomID];
        const row = differenceInMinutes(lectureRoom.startAt, event.startAt) / MINUTES;
        const cp = [...s];
        const cp2 = [...s[ind]];
        cp2[row] = lectures.find((e) => e.id === lectureRoom.lectureID) || null;
        cp[ind] = cp2;
        return cp;
      }, oldScheduled)
    );
  }, [event.rooms, event.startAt, lectureRooms, lectures]);

  useEffect(() => {
    if (event.rooms.length > scheduled.length) {
      setScheduled((oldScheduled) => [...oldScheduled, genScheduledCol(numRows)]);
    } else if (event.rooms.length < scheduled.length) {
      const found = scheduleMapping.find((e) => !event.rooms.find((room) => e.id === room.id));
      setScheduled((oldScheduled) => oldScheduled.filter((_, i) => i !== found?.ind));
    }
  }, [event.rooms, event.rooms.length, numRows, scheduleMapping, scheduled.length]);

  useEffect(() => {
    setScheduleMapping(event.rooms.map((e, ind) => ({ ind, id: e.id })));
  }, [event.rooms]);

  useEffect(() => {
    setSideline(
      splitIntoChunks(lectures.filter((e) => !lectureRooms.find((e1) => e1.lectureID === e.id)))
    );
  }, [lectureRooms, lectures]);

  const move = (array: (Lecture | null)[], ind: number, lecture: Lecture | null) => {
    const arr = [...array];
    arr[ind] = lecture;
    return arr;
  };

  const toXCol = (x: number) => Math.round(x / colWidth);

  const handleDragStop = (
    lecture: Lecture,
    startPos: Position,
    pos: Position,
    offsetX: number,
    offsetY: number,
    isDraggedFromSideline: boolean
  ) => {
    const newY = startPos.y + pos.y;
    const newX = startPos.x + pos.x;
    const yCol = toYCol(newY);
    const desiredXCol = toXCol(newX);
    const futureXCol = desiredXCol >= event.rooms.length ? event.rooms.length - 1 : desiredXCol;
    const xCol = event.rooms.length === 1 ? 0 : futureXCol;

    setScheduled((oldScheduled) => {
      const scheduledCopy = [...oldScheduled];

      const isDroppedOnSchedule =
        newY + heightByMin((lecture.duration || 0) / 60) <= COL_HEIGHT * numRows + 10;

      if (isDraggedFromSideline) {
        if (isDroppedOnSchedule) {
          if (oldScheduled[xCol][yCol] !== null) return oldScheduled;
          scheduledCopy[xCol] = move(scheduledCopy[xCol], yCol, lecture);
          setSideline((e) => e.map((e1) => e1.filter((e2) => e2.id !== lecture.id)));
          createLectureRoom({
            eventID: event.id,
            lectureID: lecture.id,
            roomID: event.rooms[xCol].id,
            startAt: add(event.startAt, { minutes: yCol * MINUTES }),
          });
          return scheduledCopy;
        }
        return oldScheduled;
      }

      const { id } = lectureRooms.find((e) => e.lectureID === lecture.id)!;
      if (isDroppedOnSchedule) {
        if (oldScheduled[xCol][yCol] !== null) return oldScheduled;
        scheduledCopy[offsetX] = move(scheduledCopy[offsetX], offsetY, null);
        scheduledCopy[xCol] = move(scheduledCopy[xCol], yCol, lecture);
        updateLectureRoom({
          id,
          eventID: event.id,
          lectureID: lecture.id,
          roomID: event.rooms[xCol].id,
          startAt: add(event.startAt, { minutes: yCol * MINUTES }),
        });
        return scheduledCopy;
      }

      scheduledCopy[offsetX] = move(scheduledCopy[offsetX], offsetY, null);

      setSideline((oldSideline) => {
        const ind = oldSideline
          .map((li, i) => ({ i, totDuration: li.reduce((tot, l) => tot + (l.duration || 0), 0) }))
          .sort((e1, e2) => (e1.totDuration < e2.totDuration ? -1 : 1))[0].i;

        const cp = [...oldSideline];
        cp[ind] = [lecture, ...cp[ind]];
        return cp;
      });

      deleteLectureRoom({ id });

      return scheduledCopy;
    });
  };
  return { handleDragStop, numRows, sideline, scheduled };
};

export default useSchedule;
