export interface DefaultTime {
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface ListEventParams {
  filter: 'new';
}

export interface ListLecturesParams {
  mine: 'true';
}

export interface IDParam {
  id: string;
}

export interface BaseEvent {
  organisationID: string;
  startAt: Date;
  endAt: Date;
  comment: string;
  registrationStart: Date;
  registrationEnd: Date;
}

export interface NewEvent extends BaseEvent {
  rooms: string[];
}

export interface UpdatedEvent extends NewEvent {
  id: string;
  published: boolean;
}

export interface DBEvent extends BaseEvent, DefaultTime {
  id: string;
  published: boolean;
}

export interface Event extends BaseEvent, DefaultTime {
  id: string;
  published: boolean;
  rooms: Room[];
}

export interface UpdatedRoom {
  id: string;
  name: string;
}

export interface Room extends UpdatedRoom {
  eventID: string;
}

export interface Notifications {
  newLecture: boolean;
  newComment: boolean;
  adminRead: boolean;
  lectureTaken: boolean;
}
// Azure User
export interface AzureUserBasic {
  name: string;
  email: string;
}

// User
interface BaseUser {
  speakerBio: string | null;
  officeID: string | null;
  notifications: Notifications;
}

export type NewUser = BaseUser;

export interface UpdatedUser extends BaseUser {
  id: string;
}

export interface User extends BaseUser {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
}

// Office
interface BaseOffice {
  name: string;
}

export type NewOffice = BaseOffice;

export interface UpdatedOffice extends BaseOffice {
  id: string;
}

export interface Office extends BaseOffice, DefaultTime {
  id: string;
}

// Format
interface BaseFormat {
  name: string;
  info: string | null;
}

export type NewFormat = BaseFormat;

export interface UpdatedFormat extends BaseFormat {
  id: string;
}

export interface Format extends BaseFormat, DefaultTime {
  id: string;
}

// Status
interface BaseStatus {
  name: string;
}

export type NewStatus = BaseStatus;

export interface UpdatedStatus extends BaseStatus {
  id: string;
}

export interface Status extends BaseStatus, DefaultTime {
  id: string;
}

// LectureStatus
interface BaseLectureStatus {
  lectureID: string;
  statusID: string;
}

export type NewLectureStatus = BaseLectureStatus;

export interface UpdatedLectureStatus extends BaseLectureStatus {
  id: string;
}

export interface LectureStatus extends BaseLectureStatus, DefaultTime {
  id: string;
}

// Organisation
interface BaseOrganisation {
  name: string;
}

export type NewOrganisation = BaseOrganisation;

export interface UpdatedOrganisation extends BaseOrganisation {
  id: string;
}

export interface Organisation extends BaseOrganisation, DefaultTime {
  id: string;
}

// Category
interface BaseCategory {
  name: string;
  icon: string;
  color: string;
}

export type NewCategory = BaseCategory;

export interface UpdatedCategory extends BaseCategory {
  id: string;
}

export interface Category extends BaseCategory, DefaultTime {
  id: string;
}

// Lectures
interface BaseLectureIdea {
  title: string;
  description: string;
  lecturer: string | null;
  tags: string[];
}

export type NewLectureIdea = BaseLectureIdea;

export interface UpdatedLectureIdea {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface BaseNewLecture extends BaseLectureIdea {
  remote: string | null;
  eventID: string | null;
  duration: number | null;
  maxParticipants: number | null;
  requirements: string | null;
  preparations: string | null;
  message: string | null;
  categoryID: string | null;
  draft: boolean;
  videoLink: string | null;
  keyTakeaway: string | null;
  internalPresentation: boolean | null;
  targetAudience: string | null;
  formatID: string | null;
  lectureStatusID: string | null;
}

export interface NewLecture extends BaseNewLecture {
  lecturers: BaseLectureLecturer[] | null;
}

export interface DLecture extends NewLecture {
  idea: boolean;
  lecturerID: string | null;
  approved: boolean;
}

export interface UpdatedLecture extends NewLecture {
  id: string;
}

export interface UpdatedDBLecture extends UpdatedLecture {
  lecturerID: string | null;
}

export interface DBLecture extends BaseNewLecture, DefaultTime {
  id: string;
  idea: boolean;
  lecturerID: string | null;
  approved: boolean;
}

export interface Lecture extends DLecture, DefaultTime {
  lecture: Promise<LectureLecturer[] | null>;
  id: string;
  categoryID: string | null;
  likes: string[];
  status: LectureStatus | null;
}

// LectureLike
interface BaseLectureLike {
  lectureID: string;
}

export type NewLectureLike = BaseLectureLike;

export interface NewDBLectureLike extends BaseLectureLike {
  userID: string;
}

export interface LectureLike extends NewDBLectureLike, IDParam {
  createdAt: Date;
}

// LectureLecturer
interface BaseLectureLecturer {
  lectureID: string | null;
  userID: string;
  firstTimePresenting: boolean;
}

export type NewLectureLecturer = BaseLectureLecturer;

export interface LectureLecturer extends BaseLectureLecturer, DefaultTime {
  id: string;
}

export interface NewLectureMessage {
  message: string;
}

export interface NewDBLectureMessage extends NewLectureMessage {
  lectureID: string;
}

export interface UpdatedLectureMessage extends NewLectureMessage {
  id: string;
  lectureID: string;
  userID: string;
}

export interface DBLectureMessage extends UpdatedLectureMessage {
  updatedAt: Date;
  createdAt: Date;
}

export interface LectureMessage extends DBLectureMessage {
  user: string | null;
}

export interface BaseLectureRoom {
  lectureID: string;
  roomID: string;
  startAt: Date;
}

export interface NewLectureRoom extends BaseLectureRoom {
  eventID: string;
}

export interface UpdatedLectureRoom extends NewLectureRoom {
  id: string;
}

export interface LectureRoom extends BaseLectureRoom {
  id: string;
}

export interface BaseAttendant {
  eventID: string;
  lectures: string[];
  message: string;
  remote: boolean;
}

export type NewAttendant = BaseAttendant;

export interface UpdatedAttendant extends NewAttendant {
  id: string;
}

export interface Attendant extends UpdatedAttendant, DefaultTime {
  userID: string;
}

export interface TagStats {
  tag: string;
  count: number;
}

export interface CategoryStats {
  categoryID: string;
  count: number;
}

export interface IOK {
  ok: boolean;
}

export interface Approved {
  approved: boolean;
  id: string;
}

export interface SetStatus {
  statusID: string;
  lectureID: string;
}

export interface SetVideoLink {
  lectureLink: string;
  lectureID: string;
}

export interface LectureFeedback {
  lectureId: string;
  userID: string;
  message: string;
}

export const reviver = (key: string, value: unknown): unknown => {
  const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}\.\d*)(?:Z|([+-])([\d|:]*))?$/;
  if (typeof value === 'string') {
    const a = reISO.exec(value);
    if (a) {
      return new Date(value);
    }
  }
  return value;
};
