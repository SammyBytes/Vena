import type { VenaAuth } from "./auth.interfaces";
import type { VenaConfig } from "./config.interface";
import type { VenaOS } from "./os.interfaces";

export interface VenaContext {
  cwd: string;
  config: VenaConfig;
  auth: VenaAuth;
  os: VenaOS;
}
