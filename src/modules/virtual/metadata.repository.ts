import { getLibsql } from "@/internal/libsql.client";

export const switchBranchAsync = async (branch: string): Promise<boolean> => {
  const db = getLibsql();
  const result = await db.execute(
    `UPDATE v_metadata SET value = ? WHERE key = ?`,
    [branch, "current_branch"],
  );
  return result.rowsAffected > 0;
};
