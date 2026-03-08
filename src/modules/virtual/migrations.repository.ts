import { getLibsql } from "@/internal/libsql.client";
import type { ResultSet } from "@libsql/client";

export const createCommitAsync = async (
  hash: string,
  name: string,
  branch: string,
  description: string,
): Promise<ResultSet> => {
  const db = getLibsql();
  const result = await db.execute(
    `INSERT INTO v_migrations (hash, name, description, branch_name) VALUES (?, ?, ?, ?)`,
    [hash, name, description, branch],
  );
  return result;
};
