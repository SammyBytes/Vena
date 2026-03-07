import { initProjectCommandAsync } from "./commands/init.command";

const [command, ...args] = Bun.argv.slice(2);

switch (command) {
  case "init":
    const name = args[0] || "my-project";
    const engine = (args[1] as any) || "mariadb";
    await initProjectCommandAsync(name, engine);
    break;

  default:
    console.log("Unknown command");
}
