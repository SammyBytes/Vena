export interface IDriver {
  createBranch(name: string): Promise<void>;
  deleteBranch(name: string): Promise<void>;
  listDatabases(): Promise<string[]>;
}
