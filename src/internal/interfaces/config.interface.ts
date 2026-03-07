export interface VenaConfig {
  project: {
    name: string;
    engine: "mariadb" | "mysql";
  };
  database: {
    default_name: string;
    user: string;
    port: number;
  };
}
