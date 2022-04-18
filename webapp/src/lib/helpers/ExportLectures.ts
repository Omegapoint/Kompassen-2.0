import { getGraphUser, getUserByID, listCategories, listFormats, listOffices } from '../../api/Api';
import { AzureUserBasic, Lecture, User } from '../Types';

const csvHeader = [
  'Title',
  'Speakers',
  'Office(s)',
  'Rookie',
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
  const offices = await listOffices();
  const formats = await listFormats();
  const categories = await listCategories();

  const csvData = await Promise.all(
    lectures.map(async (lecture) => {
      // eslint-disable-next-line
      const lecturers = await Promise.all(
        lecture.lecturers!.map(async (lecturer) => {
          let azureUser: AzureUserBasic | null;
          try {
            azureUser = await getGraphUser({ id: lecturer!.userID });
          } catch (error) {
            // eslint-disable-next-line
            console.error(error);
            azureUser = null;
          }

          let kompassenUser: User | null;
          try {
            kompassenUser = await getUserByID({ id: lecturer!.userID });
          } catch (error) {
            // eslint-disable-next-line
            console.error(error);
            kompassenUser = null;
          }
          return { azureUser, kompassenUser };
        })
      );
      const format = formats.find((form) => form.id === lecture.formatID)?.name;
      const category = categories.find((cat) => cat.id === lecture.categoryID)?.name;
      const lecturersOffices = offices.filter((office) =>
        lecturers.some((l) => l.kompassenUser!.officeID === office.id)
      );
      return [
        lecture.title.trim(),
        lecturers.map((lecturer) => (lecturer.azureUser ? lecturer.azureUser.name : '')),
        lecturersOffices.map((o) => o.name),
        // eslint-disable-next-line
        lecture.lecturers!.some((lecturer) => lecturer.firstTimePresenting) ? 'Rookie' : '',
        lecture.description.trim(),
        lecture.keyTakeaway ? lecture.keyTakeaway.trim() : '',
        format || '',
        category || '',
        lecture.internalPresentation ? 'Yes' : 'No',
        lecture.targetAudience ? lecture.targetAudience.trim() : '',
        lecture.requirements ? lecture.requirements.trim() : '',
        lecture.message ? lecture.message.trim() : '',
      ];
    })
  );
  return [csvHeader, ...csvData];
};

export default exportLectures;
