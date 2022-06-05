// @flow
import { createReadQuery, db } from 'shared/db';
import type { DBMessage } from 'shared/types';
import dbUtil from 'shared/dbUtil';

// export const getMessageById = createReadQuery((id: string) => ({
//   query: db.table('messages').get(id),
//   tags: (message: ?DBMessage) => (message ? [message.id] : []),
// }));
export const getMessageById = createReadQuery((id: string) => ({
  query: db.collection('messages').findOne({ id: id }),
  tags: (message: ?DBMessage) => (message ? [message.id] : []),
}));
