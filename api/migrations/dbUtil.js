const { v4: uuidv4 } = require('uuid');

const insertOne = (db, collectionName, document) => {
  if (!db) {
    throw new Error('db must be specified');
  }
  const id = uuidv4();
  const iddDocument = {
    ...document,
    _id: id,
    id: id,
  };
  return db
    .collection(collectionName)
    .insertOne(iddDocument)
    .then(() => {
      return iddDocument;
    });
};

const createCollections = (db, ...collectionNames) => {
  if (!db) {
    throw new Error('db must be specified');
  }
  return Promise.all(
    collectionNames.map(collectionName => {
      return db.createCollection(collectionName).catch(error => {
        throw new Error(
          `Failed to create collection '${collectionName}', because: ${error.message}`
        );
      });
    })
  );
};

const dropCollections = (...collectionNames) => {
  if (!db) {
    throw new Error('db must be specified');
  }
  return Promise.all(
    collectionNames.map(collectionName => {
      return db
        .collection(collectionName)
        .drop()
        .catch(error => {
          throw new Error(
            `Failed to drop collection '${collectionName}', because: ${error.message}`
          );
        });
    })
  );
};

module.exports = { insertOne, createCollections, dropCollections };
