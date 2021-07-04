export interface DefaultTime {
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface ListEventParams {
  filter: string;
}

export interface IDParam {
  id: string;
}

export interface NewEvent {
  startAt: Date;
  endAt: Date;
  location: string;
}

export interface UpdatedEvent extends NewEvent {
  id: string;
}

export interface Event extends UpdatedEvent, DefaultTime {}

export interface Notifications {
  newLecture: boolean;
  newComment: boolean;
  adminRead: boolean;
  lectureTaken: boolean;
}

export interface NewUser {
  notifications: Notifications;
}

export interface UpdatedUser extends NewUser {
  id: string;
}

export interface User extends UpdatedUser {
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface NewLocation {
  name: string;
}

export interface UpdatedLocation extends NewLocation {
  id: string;
}

export interface Location extends UpdatedLocation, DefaultTime {}

export interface NewCategory {
  name: string;
  icon: string;
}

export interface UpdatedCategory extends NewCategory {
  id: string;
}

export interface Category extends UpdatedCategory, DefaultTime {}

export interface NewLectureIdea {
  title: string;
  description: string;
  lecturer: string | null;
  tags: string[];
}

export interface NewLecture extends NewLectureIdea {
  location: string | null;
  eventID: string | null;
  duration: number | null;
  category: string | null;
  maxParticipants: number | null;
  requirements: string | null;
  preparations: string | null;
  message: string | null;
}

export interface DLecture extends NewLecture {
  idea: boolean;
}

export interface UpdatedLecture extends NewLecture {
  id: string;
}

export interface DBLecture extends UpdatedLecture, DLecture, DefaultTime {}

export interface Lecture extends DBLecture {
  likes: string[];
}

export interface NewLectureLike {
  lectureId: string;
}

export interface NewDBLectureLike extends NewLectureLike {
  userId: string;
}

export interface LectureLike extends NewDBLectureLike, IDParam {
  createdAt: Date;
}

export interface NewLectureMessage {
  message: string;
}

export interface NewDBLectureMessage extends NewLectureMessage {
  lectureId: string;
}

export interface UpdatedLectureMessage extends NewLectureMessage {
  id: string;
  lectureId: string;
  userId: string;
}

export interface DBLectureMessage extends UpdatedLectureMessage {
  updatedAt: Date;
  createdAt: Date;
}

export interface LectureMessage extends DBLectureMessage {
  user: string | null;
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

export interface Count {
  count: number;
}

export interface TagStats {
  tag: string;
  count: number;
}

export interface CategoryStats {
  category: string;
  count: number;
}
