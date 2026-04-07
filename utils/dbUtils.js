// // utils/dbUtils.js
// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;
// const DatabaseMapping = require('../src/models/databaseMapping'); // adjust path if needed
// const { getDatabaseConnection } = require('./socketUtilities'); // adjust path

// /**
//  * Try to find a user document by id across:
//  *   1) main DB collections (common names)
//  *   2) tenant DBs listed in DatabaseMapping (using your getDatabaseConnection)
//  *
//  * Returns: { found: boolean, user: object|null, collection: string|null, sourceDb: 'main' | '<tenant_db_name>'|null }
//  */
// async function findUserByIdAcrossAll(id) {
//   if (!id) return { found: false };

//   let objId;
//   try { objId = ObjectId(id); } catch (err) { return { found: false }; }

//   // 1) Check main DB collections
//   const mainCollections = ['jobseeker_account', 'recruiter', 'Admin', 'super_admins'];
//   for (const coll of mainCollections) {
//     try {
//       const doc = await mongoose.connection.db.collection(coll).findOne({ _id: objId });
//       if (doc) return { found: true, user: doc, collection: coll, sourceDb: 'main' };
//     } catch (err) {
//       // collection might not exist; ignore
//     }
//   }

//   // 2) Check tenant DBs (DatabaseMapping)
//   const mappings = await DatabaseMapping.find({}).lean();
//   for (const mapping of mappings) {
//     const dbKey = mapping.database || mapping.email;
//     if (!dbKey) continue;
//     try {
//       const adminConn = await getDatabaseConnection(dbKey);
//       if (!adminConn || !adminConn.db) continue;
//       // tenant collection names to try - add any additional names your tenants use
//       const tenantCollections = ['jobseeker_account', 'recruiter', 'Admin', 'super_admins'];
//       for (const tcoll of tenantCollections) {
//         try {
//           const doc = await adminConn.db.collection(tcoll).findOne({ _id: objId });
//           if (doc) return { found: true, user: doc, collection: tcoll, sourceDb: mapping.database || dbKey };
//         } catch (err) { /* ignore */ }
//       }
//     } catch (err) {
//       // ignore tenant connection errors for now
//     }
//   }

//   return { found: false };
// }

// module.exports = { findUserByIdAcrossAll };
