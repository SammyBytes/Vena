import { VENA_COMMANDS } from "./const";
import { initProjectCommandAsync } from "./internal/commands/init.command";

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

  default:
    console.log("Unknown command");
}
