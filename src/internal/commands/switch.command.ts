import {
  getCurrentBranchAsync,
  switchBranchAsync,
} from "@/modules/virtual/metadata.repository";
import { loadContext } from "../context-loader";
import { loadDriver } from "../driver-loader";
import { VENA_MIGRATIONS_DIR, VENA_MIGRATIONS_FOLDER } from "@/const";

import { readdir } from "node:fs/promises";
import path from "node:path";
import { getBranchMigrations } from "@/modules/virtual/migrations.repository";
import { evaluateIfBranchExistsAsync } from "@/modules/virtual/branchs.repository";

export const switchBranchCommandAsync = async (branch: string) => {
  try {
    const currentBranch = await getCurrentBranchAsync();
    if (currentBranch === branch) {
      console.log(`Branch ${branch} is already active`);
      return;
    }

    const isBranchExists = await evaluateIfBranchExistsAsync(branch);
    if (!isBranchExists.rows.length) {
      console.error(`The branch ${branch} does not exist, create it first`);
      return;
    }

    const isBranchSwitched = await switchBranchAsync(branch);
    if (!isBranchSwitched) {
      console.error(`Error switching branch ${branch}`);
      return;
    }

    // Remove all migrations files from the migrations folder
    const migrationsDir = VENA_MIGRATIONS_DIR;
    const migrationsFiles = await readdir(migrationsDir);
    await Promise.all(
      migrationsFiles.map((file) => {
        const filePath = path.join(VENA_MIGRATIONS_DIR, file);
        return Bun.file(filePath).delete();
      }),
    );

    // Retrieve all migrations files from the target branch
    const targetBranchMigrations = await getBranchMigrations(branch);
    await Promise.all(
      targetBranchMigrations.rows.map((migration) => {
        const filePath = path.join(
          VENA_MIGRATIONS_DIR,
          `${migration.name}.sql`,
        );
        return Bun.file(filePath).write(migration.content!.toString());
      }),
    );

    console.log(`Branch ${branch} switched successfully`);
  } catch (error) {
    console.error(`Error switching branch ${branch}`);
    console.error(error);
  }
};
