import type { VenaContext } from "@/internal/interfaces/vena/context.interface";
import type { IDriver } from "../driver.interface";
import type { OSInfo } from "../osInfo.interface";
import type { VenaOS } from "@/internal/interfaces/vena/os.interfaces";
import { VENA_MIGRATIONS_DIR } from "@/const";

import path from "node:path";

export class MariaDBDriver implements IDriver, OSInfo {
  constructor(private context: VenaContext) {
    this.options = [
      `--host=${this.context.config.database.host}`,
      `--port=${this.context.config.database.port}`,
      `--user=${this.context.auth.username}`,
    ];
    if (this.context.auth.password) {
      this.options.push(`--password=${this.context.auth.password}`);
    }

    this.info = context.os;

    this.procAdminName = this.info.isWindows
      ? "mariadb-admin.exe"
      : "mariadb-admin";
    this.procDumpName = this.info.isWindows
      ? "mariadb-dump.exe"
      : "mariadb-dump";
  }
  info: VenaOS;

  private options: string[];
  private procAdminName: string;
  private procDumpName: string;

  async createBranch(name: string): Promise<void> {
    const options = this.options;
    const args = [...options, "create", name];
    const proc = Bun.spawn([this.procAdminName, ...args], {
      stderr: "inherit",
    });

    const result = await proc.exited;
    if (result !== 0) {
      throw new Error(`Could not create branch ${name}`, {
        cause: proc.stderr,
      });
    }
  }
  async snapshotStructure(
    targetDb: string,
    outputFilename: string,
  ): Promise<void> {
    const auth = this.options.join(" ");
    const outputPath = path.join(VENA_MIGRATIONS_DIR, outputFilename);

    const cleanFlags = "--no-data --skip-comments --skip-dump-date --compact";
    const command = `${this.procDumpName} ${auth} ${cleanFlags} ${targetDb} > "${outputPath}"`;
    const shell = this.info.isWindows
      ? ["powershell.exe", "-Command", command]
      : ["sh", "-c", command];

    const proc = Bun.spawn(shell, {
      stderr: "inherit",
    });

    const result = await proc.exited;

    if (result !== 0) {
      throw new Error(
        `Snapshot failed for ${targetDb} on ${this.info.platform}`,
        {
          cause: proc.stderr,
        },
      );
    }
  }

  async cloneStructure(targetDb: string): Promise<void> {
    const source = this.context.config.database.default_name;
    const target = targetDb;

    if (this.info.isWindows) {
      return this.cloneStructureWin(source, target);
    }
    return this.cloneStructureLinux(source, target);
  }

  private async cloneStructureLinux(
    source: string,
    target: string,
  ): Promise<void> {
    const auth = this.options.join(" ");
    const command = `${this.procDumpName} ${auth} --no-data ${source} | mariadb ${auth} ${target}`;

    const proc = Bun.spawn(["sh", "-c", command], { stderr: "inherit" });
    const result = await proc.exited;

    if (result !== 0)
      throw new Error(`Linux Clone failed from ${source} to ${target}`, {
        cause: proc.stderr,
      });
  }

  private async cloneStructureWin(
    source: string,
    target: string,
  ): Promise<void> {
    const auth = this.options.join(" ");
    const command = `${this.procDumpName} ${auth} --no-data ${source} | mariadb ${auth} ${target}`;

    const proc = Bun.spawn(["powershell.exe", "-Command", command], {
      stderr: "inherit",
    });
    const result = await proc.exited;

    if (result !== 0)
      throw new Error(`Windows Clone failed from ${source} to ${target}`, {
        cause: proc.stderr,
      });
  }

  applyMigrations(targetDb: string, migrations: string[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
