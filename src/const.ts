import path from "node:path";

export const VENA_CONFIG_FILE = "config.json";
export const VENA_AUTH_FILE = "auth.json";
export const VENA_STATE_FILE = "state.db";
export const VENA_BASE_DIR = ".vana";

export const VENA_CONFIG_PATH = path.join(
  process.cwd(),
  VENA_BASE_DIR,
  VENA_CONFIG_FILE,
);

export const VENA_AUTH_PATH = path.join(
  process.cwd(),
  VENA_BASE_DIR,
  VENA_AUTH_FILE,
);

export const VENA_STATE_PATH = path.join(
  process.cwd(),
  VENA_BASE_DIR,
  VENA_STATE_FILE,
);

export const VENA_COMMANDS = {
  init: "init",
  branch: "branch",
};

export const GIT_IGNORE_FILE = ".gitignore";

export const GIT_IGNORE_PATH = path.join(process.cwd(), GIT_IGNORE_FILE);
