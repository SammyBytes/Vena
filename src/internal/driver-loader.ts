import type { IDriver } from "@/modules/drivers/driver.interface";
import type { VenaContext } from "./interfaces/vena/context.interface";
import { MariaDBDriver } from "@/modules/drivers/mariadb/mariadb.driver";

export const loadDriver = (ctx: VenaContext) => {
  let driver: IDriver;
  switch (ctx.config.project.engine) {
    case "mariadb":
      driver = new MariaDBDriver(ctx);
      break;
    default:
      throw new Error("Unknown driver");
  }
  return driver;
};
