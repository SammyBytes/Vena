import {
  GIT_IGNORE_PATH,
  VENA_BASE_DIR,
  VENA_CONFIG_FILE,
  VENA_CONFIG_PATH,
  VENA_STATE_FILE,
} from "@/const";
import type { VenaConfig } from "@/internal/interfaces/config.interface";
import { getLibsql } from "@/internal/libsql.client";
import { file } from "bun";
import { mkdir } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export const initProjectCommandAsync = async (
  projectName: string,
  engine: "mariadb" | "mysql",
) => {
  const venaDir = path.join(process.cwd(), VENA_BASE_DIR);

  if (await isFileExists(VENA_CONFIG_PATH)) {
    console.log("Vena config file already exists");
    return;
  }

  await mkdir(venaDir, { recursive: true });

  const defaultConfig: VenaConfig = {
    project: {
      name: projectName,
      engine: engine,
    },
    database: {
      default_name: `${projectName}_main`,
      user: "root",
      port: 3306,
    },
  };

  await writeFile(VENA_CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));

  const db = getLibsql();

  const metadataSchema = `CREATE TABLE IF NOT EXISTS v_metadata (key TEXT PRIMARY KEY, value TEXT)`;
  const branchesSchema = `CREATE TABLE IF NOT EXISTS v_branches (git_branch TEXT PRIMARY KEY, physical_db TEXT NOT NULL)`;

  await db.batch(
    [
      metadataSchema,
      branchesSchema,
      {
        sql: "INSERT OR IGNORE INTO v_metadata (key, value) VALUES (?, ?)",
        args: ["current_branch", "main"],
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

  // Only add if it doesn't exist already
  if (!lines.includes(entry)) {
    console.log(`Adding ${entry} to .gitignore...`);
    const newContent = content.endsWith("\n")
      ? `${content}${entry}\n`
      : `${content}\n${entry}\n`;
    await writeFile(GIT_IGNORE_PATH, newContent);
  }
};
