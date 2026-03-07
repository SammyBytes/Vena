import { VENA_STATE_PATH } from "@/const";
import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export const getLibsql = () => {
  if (!client) {
    client = createClient({
      url: `file:${VENA_STATE_PATH}`,
    });
  }
  return client;
};
