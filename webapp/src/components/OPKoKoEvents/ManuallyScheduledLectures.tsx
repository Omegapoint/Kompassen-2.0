import { ReactElement } from 'react';
import { Lecture } from '../../lib/Types';
import ManualLectureRow from './ManualLectureRow';

interface ManuallyScheduledLecturesProps {
  lectures: Lecture[];
  admin?: boolean;
  opkoko?: boolean;
}

const ManuallyScheduledLectures = ({
  lectures,
  admin = false,
  opkoko = false,
}: ManuallyScheduledLecturesProps): ReactElement => {
  function chunkArrayInGroups(arr: Lecture[], size: number) {
    const myArray = [];
    for (let i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i + size));
    }
    return myArray;
  }
  const rows: Lecture[][] = chunkArrayInGroups(lectures, 6);
  return (
    <>
      {rows.map((e) => (
        <ManualLectureRow lectures={e} admin={admin} opkoko={opkoko} format="Blixt" />
      ))}
    </>
  );
};

export default ManuallyScheduledLectures;
