import { getCurrentBranchAsync } from "@/modules/virtual/metadata.repository";
import { loadContext } from "../context-loader";

export const statusCommandAsync = async () => {
  try {
    const currentBranch = await getCurrentBranchAsync();
    console.log(`Current branch: ${currentBranch}`);
  } catch (error) {
    console.error(`Error loading status`);
    console.error(error);
  }
};
