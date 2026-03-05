let _ = require("lodash");
const path = require("path");
let rootPath = path.join(__dirname, "../../");

require("dotenv").config({ path: rootPath + "/.env" });

let MongoClient = require("mongodb").MongoClient;

let mongoUrl = process.env.MONGODB_URL;
let dbName = mongoUrl.split("/").pop();
let url = mongoUrl.split(dbName)[0];

const BATCH_SIZE = 20;

(async () => {
  let connection = await MongoClient.connect(url, { useNewUrlParser: true });
  let db = connection.db(dbName);

  try {

    console.log("Connected to DB:", dbName);

    let roles = await db.collection("userRoles").find({}).toArray();

    let batches = _.chunk(roles, BATCH_SIZE);

    console.log("Total roles:", roles.length);
    console.log("Total batches:", batches.length);

    for (let batch of batches) {

      for (let role of batch) {

        let originalCode = role.code;
        let lowerCode = originalCode.toLowerCase();

        // skip if already lowercase
        if (originalCode === lowerCode) {
          console.log(`Skipping ${originalCode} (already lowercase)`);
          continue;
        }

        // check if lowercase already exists
        let exists = await db.collection("userRoles").findOne({
          code: lowerCode
        });

        if (exists) {
          console.log(
            `Skipping ${originalCode} → ${lowerCode} (already exists)`
          );
          continue;
        }

        // update code
        await db.collection("userRoles").updateOne(
          { _id: role._id },
          { $set: { code: lowerCode } }
        );

        console.log(`Updated ${originalCode} → ${lowerCode}`);
      }
    }

    console.log("Script completed successfully");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    connection.close();
  }
})();