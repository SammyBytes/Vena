import {
  GIT_IGNORE_PATH,
  VENA_AUTH_FILE,
  VENA_AUTH_PATH,
  VENA_BASE_DIR,
  VENA_CONFIG_FILE,
  VENA_CONFIG_PATH,
  VENA_STATE_FILE,
} from "@/const";
import type { VenaConfig } from "@/internal/interfaces/vena/config.interface";
import { getLibsql } from "@/internal/libsql.client";
import { file } from "bun";
import { mkdir } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { VenaAuth } from "../interfaces/vena/auth.interfaces";

export const initProjectCommandAsync = async (
  projectName: string,
  engine: "mariadb" | "mysql",
  host?: string | undefined,
  port?: number | undefined,
  username?: string | undefined,
  password?: string | undefined,
) => {
  const venaDir = path.join(process.cwd(), VENA_BASE_DIR);

  if (await isFileExists(VENA_CONFIG_PATH)) {
    console.log("Vena config file already exists");
    return;
  }

  await mkdir(venaDir, { recursive: true });

  await setupVenaConfigFiles(
    projectName,
    engine,
    host,
    port,
    username,
    password,
  );

  const db = getLibsql();

  const metadataSchema = `CREATE TABLE IF NOT EXISTS v_metadata (key TEXT PRIMARY KEY, value TEXT)`;
  const branchesSchema = `
  CREATE TABLE IF NOT EXISTS v_branches (
    name TEXT PRIMARY KEY, 
    physical_db TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`;

  await db.batch(
    [
      metadataSchema,
      branchesSchema,
      {
        sql: "INSERT OR IGNORE INTO v_metadata (key, value) VALUES (?, ?)",
        args: ["current_branch", "main"],
      },
      {
        sql: "INSERT OR IGNORE INTO v_branches (name, physical_db) VALUES (?, ?)",
        args: ["main", `${projectName}_main`],
      },
    ],
    "write",
  );

  await updateGitIgnoreForVena();

  console.log("Project initialized successfully in", venaDir);
};

/**
 * Check if a file exists in the given path
 * @param filePath
 * @private
 * @return {Promise<boolean>} true if the file exists, false otherwise
 */
const isFileExists = async (filePath: string): Promise<boolean> => {
  try {
    await file(filePath).stat();
    return true;
  } catch (error) {
    return false;
  }
};

const updateGitIgnoreForVena = async () => {
  let content = "";

  try {
    content = await readFile(GIT_IGNORE_PATH, "utf8");
  } catch {
    content = "# GitIgnore\n";
  }

  const lines = content.split("\n").map((l) => l.trim());
  const entry = `${VENA_BASE_DIR}/${VENA_STATE_FILE}`; // ".vana/state.db"
  const authEntry = `${VENA_BASE_DIR}/${VENA_AUTH_FILE}`; // ".vana/auth.json"

  // Only add if it doesn't exist already
  if (!lines.includes(entry)) {
    console.log(`Adding ${entry} to .gitignore...`);
    const newContent = content.endsWith("\n")
      ? `${content}${entry}\n`
      : `${content}\n${entry}\n`;

    await writeFile(GIT_IGNORE_PATH, newContent);
  }

  if (!lines.includes(authEntry)) {
    console.log(`Adding ${authEntry} to .gitignore...`);
    const newAuthContent = content.endsWith("\n")
      ? `${content}${authEntry}\n`
      : `${content}\n${authEntry}\n`;
    await writeFile(GIT_IGNORE_PATH, newAuthContent);
  }
};

/**
 * Initialize Vena config files (config.json, auth.json)
 * @param projectName
 * @param engine
 * @param host
 * @param port
 * @param username
 * @param password
 */
const setupVenaConfigFiles = async (
  projectName: string,
  engine: "mariadb" | "mysql",
  host?: string | undefined,
  port?: number | undefined,
  username?: string | undefined,
  password?: string | undefined,
) => {
  const defaultConfig: VenaConfig = {
    project: {
      name: projectName,
      engine: engine,
    },
    database: {
      default_name: `${projectName}_main`,
      host: host || "localhost",
      port: port || 3306,
    },
  };

  const authConfig: VenaAuth = {
    username: username || "root",
    password: password || "12345",
  };

  const venaConfigPromise = writeFile(
    VENA_CONFIG_PATH,
    JSON.stringify(defaultConfig, null, 2),
  );

  const venaAuthPromise = writeFile(
    VENA_AUTH_PATH,
    JSON.stringify(authConfig, null, 2),
  );

  await Promise.all([venaConfigPromise, venaAuthPromise]);
};
