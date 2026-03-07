import { VENA_COMMANDS } from "./const";
import { initProjectCommandAsync } from "./internal/commands/init.command";

const [command, ...args] = Bun.argv.slice(2);

switch (command) {
  case VENA_COMMANDS.init:
    const name = args[0] || "my-project";
    const engine = (args[1] as any) || "mariadb";
    await initProjectCommandAsync(name, engine);
    break;

  default:
    console.log("Unknown command");
}
