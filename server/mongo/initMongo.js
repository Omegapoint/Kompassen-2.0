const mockUsers = [
  // {
  //   _id: '4a612d67-31e3-4ad3-b503-93543ec54c27',
  //   notifications: {
  //     newLecture: true,
  //     newComment: true,
  //     adminRead: true,
  //     lectureTaken: true,
  //   },
  //   createdAt: ISODate('2021-06-30T14:57:50.778Z'),
  //   lastLogin: ISODate('2021-06-30T14:57:50.778Z'),
  //   updatedAt: ISODate('2021-06-30T14:57:50.778Z'),
  //   updatedBy: null,
  // },
];

conn = new Mongo();
db = conn.getDB('kompassen2');

db.createCollection('users');

db.users.insertMany(mockUsers);
