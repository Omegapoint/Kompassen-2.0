import { getGraphUser, getUserByID, listOffices } from '../../api/Api';
import { AzureUserBasic, Lecture, User } from '../Types';

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

const exportLecturers = async (
  lectures: Lecture[]
): Promise<(string | boolean | string[] | null)[][]> => {
  const offices = await listOffices();
  const filteredLecturers = filterLecturers(lectures);

  const csvData = await Promise.all(
    filteredLecturers.map(async (lecturer) => {
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

      const lecturerLectures = lectures.filter(
        (l) =>
          l.lecturerID === lecturer?.userID ||
          l.lecturers?.filter((i) => i.userID === lecturer?.userID).length
      );
      const lecturerLecturesNames = lecturerLectures.map((k) => k.title);

      let office;
      if (kompassenUser !== null && kompassenUser.officeID !== null) {
        const { officeID } = kompassenUser;
        const officeResult = offices.find((o) => o.id === officeID)?.name;
        office = officeResult || 'Office not set';
      } else {
        office = 'Office not set';
      }
      return [
        azureUser && azureUser.name ? azureUser.name : 'Azure user not found',
        azureUser && azureUser.email ? azureUser.email : 'Azure user not found',
        lecturer && lecturer.firstTimePresenting ? 'Yes' : 'No',
        kompassenUser && kompassenUser.speakerBio ? kompassenUser.speakerBio : 'No speaker bio',
        office,
        lecturerLecturesNames,
        'image-file',
      ];
    })
  );

  return [csvHeader, ...csvData];
};

export default exportLecturers;
