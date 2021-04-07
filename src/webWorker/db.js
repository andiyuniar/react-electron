import Dexie from "dexie";

const DBNAME = "exportSample";
const SCHEMA = "++, id";

export const db = new Dexie(DBNAME);
db.version(1).stores({
  foos: SCHEMA,
  logs: "++, name",
});
