// ... tus imports actuales
import { VENA_COMMANDS } from "./const";
import { createBranchCommandAsync } from "./internal/commands/branch.command";
import { commitCommandAsync } from "./internal/commands/commit.command";
import { showHelp } from "./internal/commands/help.command";
import { initProjectCommandAsync } from "./internal/commands/init.command";
import { statusCommandAsync } from "./internal/commands/status.command";
import { switchBranchCommandAsync } from "./internal/commands/switch.command";

const [command, ...args] = Bun.argv.slice(2);

if (!command || command === "--help" || command === "-h") {
  showHelp();
  process.exit(0);
}

switch (command) {
  case VENA_COMMANDS.init:
    const [nameInit, engine, host, port, user, pass] = args;
    await initProjectCommandAsync(
      nameInit || "my-project",
      (engine as any) || "mariadb",
      host,
      port ? Number(port) : undefined,
      user,
      pass,
    );
    break;

  case VENA_COMMANDS.branch:
    const newBranch = args[0];
    if (!newBranch) {
      console.log("\x1b[31mError: Missing branch name.\x1b[0m");
      showHelp();
      process.exit(1);
    }
    await createBranchCommandAsync(newBranch);
    break;

  case VENA_COMMANDS.status:
    await statusCommandAsync();
    break;

  case VENA_COMMANDS.commit:
    const migrationName = args[0];
    if (!migrationName) {
      console.log("\x1b[31mError: Provide a name for the commit.\x1b[0m");
      process.exit(1);
    }
    await commitCommandAsync(migrationName, args[1]);
    break;

  case VENA_COMMANDS.switch:
    const branch = args[0];
    if (!branch) {
      console.log("\x1b[31mError: Missing branch name.\x1b[0m");
      showHelp();
      process.exit(1);
    }
    await switchBranchCommandAsync(branch);
    break;

  default:
    console.log(`\x1b[31mUnknown command: ${command}\x1b[0m`);
    showHelp();
    process.exit(1);
}
