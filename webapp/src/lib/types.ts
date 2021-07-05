export interface ID {
  _id?: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface Event extends ID {
  start: Date;
  end: Date;
}

export interface NewUser {
  notifications: {
    newLecture: boolean;
    newComment: boolean;
    adminRead: boolean;
    lectureTaken: boolean;
  };
}

export type User = ID & NewUser;

export interface Location extends ID {
  name: string;
}

export interface Tag extends ID {
  name: string;
  icon: string;
}

export interface Lecture extends ID {
  lecturer_id: string;
  description: string;
  location: string;
  tags: string[];
  event_id: string;
  duration: number;
  title: string;
  category: string;
  maxParticipants: number;
  requirements: string;
  preparations: string;
  message: string;
  status: string;
  likes: string[];
  messages: {
    userId: string;
    date: Date;
    message: string;
    file: string;
  }[];
}
