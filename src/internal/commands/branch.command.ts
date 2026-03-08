import {
  createBranchAsync,
  evaluateIfBranchExistsAsync,
} from "@/modules/virtual/branchs.repository";
import { loadContext } from "../context-loader";
import { loadDriver } from "../driver-loader";
import { switchBranchAsync } from "@/modules/virtual/metadata.repository";

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

    const isBranchCreated = await createBranchAsync(newBranch, target);
    if (!isBranchCreated) {
      console.error(`Error creating branch ${newBranch}`);
      return;
    }

    var isBranchSwitched = await switchBranchAsync(newBranch);
    if (!isBranchSwitched) {
      console.error(`Error switching branch ${newBranch}`);
      return;
    }

    console.log(`Branch ${newBranch} created successfully... switching to it`);
  } catch (error) {
    console.error(`Error creating branch ${newBranch}`);
    console.error(error);
  }
};
