import { getCurrentBranchAsync } from "@/modules/virtual/metadata.repository";
import { loadContext } from "../context-loader";
import { loadDriver } from "../driver-loader";
import { createCommitAsync } from "@/modules/virtual/migrations.repository";

import path from "node:path";
import { VENA_MIGRATIONS_DIR } from "@/const";
import { evaluateIfBranchExistsAsync } from "@/modules/virtual/branchs.repository";

export const commitCommandAsync = async (
  name: string,
  description?: string,
) => {
  const ctx = await loadContext();
  const driver = loadDriver(ctx);

  try {
    const currentBranch = await getCurrentBranchAsync();
    const branchExists = await evaluateIfBranchExistsAsync(currentBranch);
    if (!branchExists.rows.length) {
      console.error(
        `Error commiting: current branch ${currentBranch} does not exist`,
      );
      return;
    }

    const physicalDB = branchExists.rows[0]?.physical_db;
    if (!physicalDB) {
      console.error(
        `Error commiting: physical database for branch ${currentBranch} does not exist`,
      );
      return;
    }

    const now = new Date().toISOString().replace(/[-:T]/g, "").split(".")[0];
    const outputFilename = `${now}_${name}.sql`;
    await driver.snapshotStructure(physicalDB.toString(), outputFilename);

    const filePath = path.join(VENA_MIGRATIONS_DIR, outputFilename);

    const fileContent = await Bun.file(filePath).text();
    const hash = Bun.hash(fileContent).toString(16);

    const result = await createCommitAsync(
      hash,
      name,
      currentBranch,
      description ?? "",
    );

    if (result.rowsAffected === 0) {
      console.error(`Error creating commit ${name}`);
      return;
    }
    console.log(`Commit ${name} created successfully`);
  } catch (error) {
    console.error(`Error creating commit ${name}`);
    console.error(error);
  }
};
