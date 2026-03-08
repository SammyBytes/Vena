import { VENA_COMMANDS } from "./const";
import { createBranchCommandAsync } from "./internal/commands/branch.command";
import { commitCommandAsync } from "./internal/commands/commit.command";
import { initProjectCommandAsync } from "./internal/commands/init.command";
import { statusCommandAsync } from "./internal/commands/status.command";

const [command, ...args] = Bun.argv.slice(2);

switch (command) {
  case VENA_COMMANDS.init:
    const name = args[0] || "my-project";
    const engine = (args[1] as any) || "mariadb";
    const host = args[2];
    const port = Number(args[3]);
    const username = args[4];
    const password = args[5];
    await initProjectCommandAsync(name, engine, host, port, username, password);
    break;
  case VENA_COMMANDS.branch:
    const newBranch = args[0];
    if (!newBranch) {
      console.log("Please provide a branch name");
      process.exit(1);
    }
    await createBranchCommandAsync(newBranch);
    break;
  case VENA_COMMANDS.status:
    await statusCommandAsync();
    break;

  case VENA_COMMANDS.commit:
    const migrationName = args[0] || "my-commit";
    const description = args[1];
    await commitCommandAsync(migrationName, description);
    break;

  default:
    console.log("Unknown command");
}
