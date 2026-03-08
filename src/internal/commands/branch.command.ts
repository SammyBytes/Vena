import { createBranchAsync, evaluateIfBranchExistsAsync } from "@/modules/virtual/branchs.repository";
import { loadContext } from "../context-loader";
import { loadDriver } from "../driver-loader";

export const createBranchCommandAsync = async (newBranch: string) => {
  const ctx = await loadContext();
  const driver = loadDriver(ctx);

  const projectName = ctx.config.project.name;
  const target = `${projectName}_${newBranch}`;

  try {
    const result = await evaluateIfBranchExistsAsync(newBranch);
    if (result.rows.length > 0) {
      console.log(
        `Branch ${newBranch} already exists, physical database: ${result.rows[0]!.physical_db}`,
      );
      return;
    }

    await driver.createBranch(target);
    await driver.cloneStructure(target);

    await createBranchAsync(newBranch, target);
    console.log(`Branch ${newBranch} created successfully`);
  } catch (error) {
    console.error(`Error creating branch ${newBranch}`);
    console.error(error);
  }
};
