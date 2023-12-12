import { Database } from "@paralect/node-mongo";
import { match, P } from "ts-pattern";

type GetConnectionStringOptions = {
  withDB?: boolean
}

export function getConnectionString(options: GetConnectionStringOptions = {}) {
  const connectionPrintString = getConnectionStringForPrint(options);
  return connectionPrintString.replace(/:\*+@/, `:${process.env.MONGODB_PASSWORD}@`);
}

/**
 * Returns the connection string with password replaced with asterisks.
 */
export function getConnectionStringForPrint({ withDB = false }: GetConnectionStringOptions = {}) {
  // If neither user nor password is set, we assume access control is disabled, so we don't include the ':' and '@'
  const userAuthPrintString =
    process.env.MONGODB_USER || process.env.MONGODB_PASSWORD
      ? `${process.env.MONGODB_USER}:********@`
      : "";
  userAuthPrintString.replace(/:\*+@/, `:${process.env.MONGODB_PASSWORD}@`);
  const dbString = withDB ? `/${process.env.MONGODB_DATABASE}` : "";
  const options = process.env.MONGODB_OPTIONS ? process.env.MONGODB_OPTIONS.split("&") : [];
  const optionsString =
    match([options, withDB])
      .with([[], false], () => '')
      .with([[], true], () => '?authSource=admin')
      .with([P.array(),  false], ([options]) => `?${options.join('&')}`)
      .with([P.array(), true], ([options]) =>
        options.some(option => option.includes('authSource='))
        ? `?${options.join('&')}`
        : `?${options.join('&')}&authSource=admin`
      )
      .otherwise(() => null)
  return `mongodb://${userAuthPrintString}${process.env.MONGODB_HOST}${dbString}${optionsString}`;
}

export async function createIndexIfNotExists(
  db: Database,
  collectionName: string,
  indexSpec: string | string[],
  unique = false
) {
  const service = db.createService(collectionName);
  const indexName = Array.isArray(indexSpec) ? indexSpec.join("_1_") + "_1" : indexSpec + "_1";
  if (await service.indexExists(indexName)) {
    return;
  }
  if (Array.isArray(indexSpec)) {
    console.log(
      `Creating unique index on fields '${indexSpec.join(", ")}' in collection ${collectionName}`
    );
  } else {
    console.log(`Creating unique index on field '${indexSpec}' in collection ${collectionName}`);
  }
  return service.createIndex(indexSpec, { unique });
}
