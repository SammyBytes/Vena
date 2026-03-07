import { loadContext } from "../context-loader";
import { loadDriver } from "../driver-loader";

export const createBranchCommandAsync = async (newBranch: string) => {
  const ctx = await loadContext();
  const driver = loadDriver(ctx);

  const source = ctx.config.database.default_name;
  const projectName = ctx.config.project.name;
  const target = `${projectName}_${newBranch}`;

  try {
    await driver.createBranch(target);
    await driver.cloneStructure(target);

    console.log(`Branch ${newBranch} created successfully`);
  } catch (error) {
    console.error(`Error creating branch ${newBranch}`);
    console.error(error);
  }
};
