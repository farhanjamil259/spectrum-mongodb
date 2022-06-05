// @flow
import { createReadQuery, db } from 'shared/db';
import type { DBThread } from 'shared/types';
import dbUtil from 'shared/dbUtil';

// export const getThreadById = createReadQuery((id: string) => ({
//   query: db.table('threads').get(id),
//   tags: (thread: ?DBThread) => (thread ? [thread.id] : []),
// }));
export const getThreadById = createReadQuery((id: string) => ({
  query: db.collection('threads').findOne({ id: id }),
  tags: (thread: ?DBThread) => (thread ? [thread.id] : []),
}));
