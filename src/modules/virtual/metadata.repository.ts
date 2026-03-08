import { getLibsql } from "@/internal/libsql.client";

export const switchBranchAsync = async (branch: string): Promise<boolean> => {
  const db = getLibsql();
  const result = await db.execute(
    `UPDATE v_metadata SET value = ? WHERE key = ?`,
    [branch, "current_branch"],
  );
  return result.rowsAffected > 0;
};



export const getCurrentBranchAsync = async (): Promise<string> => {
  const db = getLibsql();
  const result = await db.execute(
    `SELECT value FROM v_metadata WHERE key = ?`,
    ["current_branch"],
  );
  return result.rows[0]?.value?.toString() ?? "main";
};
