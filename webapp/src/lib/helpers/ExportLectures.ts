import { listCategories, listFormats } from '../../api/Api';
import { Lecture } from '../Types';

const csvHeader = [
  'Title',
  'Description',
  'Key Take Away',
  'Format',
  'Category',
  'Internal Presentation',
  'Target Audience',
  'Requirements',
  'Message',
];

// const filterLecturers = (lectures: Lecture[]) => {
//   const lecturerIDs = lectures
//     .map((lecture) => {
//       if (lecture.lecturers !== null) {
//         return lecture.lecturers.map((lecturer) => lecturer);
//       }
//       return null;
//     })
//     .flat()
//     .filter((n) => n);

//   lecturerIDs.sort((a, b) => Number(b?.firstTimePresenting) - Number(a?.firstTimePresenting));

//   const seen = new Set();

//   const filteredArr = lecturerIDs.filter((user) => {
//     const duplicate = seen.has(user!.userID);
//     seen.add(user!.userID);
//     return !duplicate;
//   });

//   return filteredArr;
// };

const exportLectures = async (
  lectures: Lecture[]
): Promise<(string | boolean | string[] | null)[][]> => {
  // const offices = await listOffices();
  const formats = await listFormats();
  const categories = await listCategories();

  const csvData = await Promise.all(
    lectures.map(async (lecture) => {
      const format = formats.find((form) => form.id === lecture.formatID)?.name;
      const category = categories.find((cat) => cat.id === lecture.categoryID)?.name;
      console.log(format);
      console.log(category);
      return [
        lecture.title,
        lecture.description,
        lecture.keyTakeaway,
        format || '',
        category || '',
        lecture.internalPresentation ? 'Yes' : 'No',
        lecture.targetAudience,
        lecture.requirements,
        lecture.message,
      ];
    })
  );
  console.log(csvHeader);
  console.log(csvData);
  return [csvHeader, ...csvData];
};

export default exportLectures;
