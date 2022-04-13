import { getUserByID } from '../../api/Api';
import { getAzureUser } from '../../api/GraphApi';
import { Lecture } from '../Types';

const csvHeader = [
  'Name',
  'Email',
  'RookieStatus',
  'TalarBio',
  'Office',
  'Name of lecture(s)',
  'Link to image',
];

const filterLecturers = (lectures: Lecture[]) => {
  const lecturerIDs = lectures
    .map((lecture) => {
      if (lecture.lecturers !== null) {
        return lecture.lecturers.map((lecturer) => lecturer);
      }
      return null;
    })
    .flat()
    .filter((n) => n);

  lecturerIDs.sort((a, b) => Number(b?.firstTimePresenting) - Number(a?.firstTimePresenting));

  const seen = new Set();

  const filteredArr = lecturerIDs.filter((user) => {
    const duplicate = seen.has(user!.userID);
    seen.add(user!.userID);
    return !duplicate;
  });

  return filteredArr;
};

const exportLectures = async (
  lectures: Lecture[]
): Promise<(string | boolean | string[] | null)[][]> => {
  const filteredLecturers = filterLecturers(lectures);

  const csvData = await Promise.all(
    filteredLecturers.map(async (lecturer) => {
      const azureUser = await getAzureUser(lecturer!.userID);
      let kompassenUser = null;
      try {
        kompassenUser = await getUserByID({ id: lecturer!.userID });
      } catch (ex) {
        // eslint-disable-next-line
        console.error(ex);
      }

      const lecturerLectures = lectures.filter(
        (l) =>
          l.lecturerID === lecturer?.userID ||
          l.lecturers?.filter((i) => i.userID === lecturer?.userID).length
      );
      const lecturerLecturesNames = lecturerLectures.map((k) => k.title);

      const speakerBio = kompassenUser !== null ? kompassenUser!.speakerBio : '';

      return [
        azureUser.displayName,
        azureUser.mail,
        lecturer!.firstTimePresenting,
        speakerBio,
        azureUser.officeLocation,
        lecturerLecturesNames,
        'image-file',
      ];
    })
  );

  return [csvHeader, ...csvData];
};

export default exportLectures;
