// @flow
import { db } from 'shared/db';
import { parseRange } from './utils';

// prettier-ignore
// export const getTopMembersInCommunity = (communityId: string): Promise<Array<string>> => {
//   const { current } = parseRange('weekly');

//   return db
//     .table('reputationEvents')
//     .getAll(communityId, { index: 'communityId' })
//     .filter(db.row('timestamp').during(db.now().sub(current), db.now()))
//     .group('userId')
//     .run()
//     .then(results => {
//       if (!results) return [];
//       const sorted = results
//         .map(c => ({
//           userId: c.group,
//           reputation: c.reduction.reduce((a, b) => a.score + b.score),
//         }))
//         .sort((a, b) => {
//           const bc = parseInt(b.reputation, 10);
//           const ac = parseInt(a.reputation, 10);
//           return bc <= ac ? -1 : 1;
//         })
//         .slice(0, 20)
//         .map(c => c.userId);

//       return sorted;
//     });
// };
export const getTopMembersInCommunity = (communityId: string): Promise<Array<string>> => {
  const { current } = parseRange('weekly');

  return db
    .table('reputationEvents')
    .getAll(communityId, { index: 'communityId' })
    .filter(db.row('timestamp').during(db.now().sub(current), db.now()))
    .group('userId')
    .run()
    .then(results => {
      if (!results) return [];
      const sorted = results
        .map(c => ({
          userId: c.group,
          reputation: c.reduction.reduce((a, b) => a.score + b.score),
        }))
        .sort((a, b) => {
          const bc = parseInt(b.reputation, 10);
          const ac = parseInt(a.reputation, 10);
          return bc <= ac ? -1 : 1;
        })
        .slice(0, 20)
        .map(c => c.userId);

      return sorted;
    });
};
