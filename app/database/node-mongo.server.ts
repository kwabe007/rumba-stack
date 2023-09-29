import { Database } from "@paralect/node-mongo";
import { createIndexIfNotExists } from "./database-utils";
import { requireEnvVar } from "~/utils.server";

let db: Database;

declare global {
  var __node_mongo_db__: Database;
}

requireEnvVar("MONGODB_HOST");
requireEnvVar("MONGODB_DATABASE");

if (!global.__node_mongo_db__) {
  // If neither user nor password is set, we assume access control is disabled, so we don't include the ':' and '@'
  const userAuthPrintString = process.env.MONGODB_USER || process.env.MONGODB_PASSWORD ? `${process.env.MONGODB_USER}:********@` : "";
  const userAuthString = userAuthPrintString.replace(/:\*+@/, `:${process.env.MONGODB_PASSWORD}@`);
  const optionsString = process.env.MONGODB_OPTIONS ? `/?${process.env.MONGODB_OPTIONS}` : "";
  const connectionPrintString = `mongodb://${userAuthPrintString}${process.env.MONGODB_HOST}${optionsString}`;
  const connectionString = `mongodb://${userAuthString}${process.env.MONGODB_HOST}${optionsString}`;
  console.log(`Connecting to MongoDB with ${connectionPrintString} to database ${process.env.MONGODB_DATABASE}`);

  db = new Database(connectionString, process.env.MONGODB_DATABASE);
  void db.connect();

  void createIndexIfNotExists(db, "users", "email", true);
  void createIndexIfNotExists(db, "passwords", "userId", true);

  global.__node_mongo_db__ = db;
} else {
  db = global.__node_mongo_db__;
}

export {
  db
};