import { VENA_AUTH_PATH, VENA_CONFIG_PATH } from "@/const";
import type { VenaContext } from "./interfaces/vena/context.interface";

import os from "node:os";
import type { VenaOS } from "./interfaces/vena/os.interfaces";

export const loadContext = async (): Promise<VenaContext> => {
  const cwd = process.cwd();

  try {
    const config = await Bun.file(VENA_CONFIG_PATH).json();
    const auth = await Bun.file(VENA_AUTH_PATH).json();

    const osContext: VenaOS = {
      platform: os.platform(),
      arch: os.arch(),
      isWindows: os.platform() === "win32",
      isLinux: os.platform() === "linux",
    };

    return { cwd, config, auth, os: osContext };
  } catch (error) {
    console.error(
      "Error loading Vena context. Please run `bun run src/index.ts init` first.",
    );
    process.exit(1);
  }
};
