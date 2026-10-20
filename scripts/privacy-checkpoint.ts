import { DatabaseSync } from "node:sqlite";
import {
  privatePath,
  secureConnection,
  checkpoint,
} from "../server/privacy/storage.ts";
const path = process.argv[2];
privatePath(path);
const db = new DatabaseSync(path);
try {
  secureConnection(db);
  checkpoint(db, path);
} finally {
  db.close();
}
