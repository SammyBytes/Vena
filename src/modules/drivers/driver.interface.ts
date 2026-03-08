export interface IDriver {
  createBranch(name: string): Promise<void>;
  cloneStructure(targetDb: string): Promise<void>;
  snapshotStructure(targetDb: string, outputFilename: string): Promise<void>;
  applyMigrations(targetDb: string, migrations: string[]): Promise<void>;
}
