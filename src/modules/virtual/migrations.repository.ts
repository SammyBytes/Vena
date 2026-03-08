import { getLibsql } from "@/internal/libsql.client";
import type { ResultSet } from "@libsql/client";

export const createCommitAsync = async (
  hash: string,
  name: string,
  branch: string,
  description: string,
  content: string,
): Promise<ResultSet> => {
  const db = getLibsql();
  const result = await db.execute(
    `INSERT INTO v_migrations (
    hash, 
    name,
    description,
    branch_name,
    content) 
    VALUES (?, ?, ?, ?, ?)`,
    [hash, name, description, branch, content],
  );
  return result;
};

export const getBranchMigrations = async (
  branch: string,
): Promise<ResultSet> => {
  const db = getLibsql();
  const result = await db.execute(
    `SELECT name, hash, content FROM v_migrations WHERE branch_name = ?`,
    [branch],
  );
  return result;
};

export const evaluateIfDiffExistsAsync = async (
  hash: string,
): Promise<ResultSet> => {
  const db = getLibsql();
  const result = await db.execute(
    `SELECT * FROM v_migrations WHERE hash = ?`,
    [hash],
  );
  return result;
};