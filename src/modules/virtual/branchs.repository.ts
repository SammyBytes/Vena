import { getLibsql } from "@/internal/libsql.client";
import type { ResultSet } from "@libsql/client";

export const createBranchAsync = async (
  name: string,
  physicalDB: string,
): Promise<ResultSet> => {
  const db = getLibsql();

  const result = await db.execute(
    `INSERT OR IGNORE INTO v_branches (name, physical_db) VALUES (?, ?)`,
    [name, physicalDB],
  );
  return result;
};

export const evaluateIfBranchExistsAsync = async (
  name: string,
): Promise<ResultSet> => {
  const db = getLibsql();
  const result = await db.execute(
    `SELECT physical_db FROM v_branches WHERE name = ?`,
    [name],
  );
  return result;
};
