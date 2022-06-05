// @flow
import { createReadQuery, db } from 'shared/db';
import type { DBChannel } from 'shared/types';

// export const getChannelById = createReadQuery((id: string) => ({
//   query: db.table('channels').get(id),
//   tags: (channel: ?DBChannel) => (channel ? [channel.id] : []),
// }));
export const getChannelById = createReadQuery((id: string) => ({
  query: db.collection('channels').findOne({ id: id }),
  tags: (channel: ?DBChannel) => (channel ? [channel.id] : []),
}));

// export const getChannelsById = createReadQuery((ids: Array<string>) => ({
//   query: db.table('channels').getAll(...ids),
//   tags: (channels: ?Array<DBChannel>) =>
//     channels ? channels.map(({ id }) => id) : [],
// }));
export const getChannelsById = createReadQuery((ids: Array<string>) => ({
  query: db.collection('channels').find({ id: { $in: ids } }),
  tags: (channels: ?Array<DBChannel>) =>
    channels ? channels.map(({ id }) => id) : [],
}));
