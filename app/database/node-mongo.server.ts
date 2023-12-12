import { Database } from '@paralect/node-mongo'
import { createIndexIfNotExists, getConnectionString, getConnectionStringForPrint } from "./database-utils";
import { requireEnvVar } from '~/utils.server'

let db: Database

declare global {
  var __node_mongo_db__: Database
}

requireEnvVar('MONGODB_HOST')
requireEnvVar('MONGODB_DATABASE')

if (!global.__node_mongo_db__) {
  const connectionPrintString = getConnectionStringForPrint()
  const connectionString = getConnectionString()
  console.log(
    `Connecting to MongoDB with ${connectionPrintString} to database ${process.env.MONGODB_DATABASE}`
  )

  db = new Database(connectionString, process.env.MONGODB_DATABASE)
  void db.connect()

  void createIndexIfNotExists(db, 'users', 'email', true)
  void createIndexIfNotExists(db, 'passwords', 'userId', true)

  global.__node_mongo_db__ = db
} else {
  db = global.__node_mongo_db__
}

export { db }
