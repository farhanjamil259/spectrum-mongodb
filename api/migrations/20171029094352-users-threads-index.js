// exports.up = function(r, conn) {
//   return r
//     .table('usersThreads')
//     .indexCreate('userIdAndThreadId', [r.row('userId'), r.row('threadId')])
//     .run(conn);
// };
exports.up = function(r, conn) {
  return Promise.resolve();
};

// exports.down = function(r, conn) {
//   return r
//     .table('usersThreads')
//     .indexDrop('userIdAndThreadId')
//     .run(conn);
// };
exports.down = function(r, conn) {
  return Promise.resolve();
};
