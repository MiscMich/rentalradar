import "server-only";

import { parseServerEnv } from "./env";

export function getServerConfig() {
  return parseServerEnv(process.env);
}
