/**
 * Hostinger MySQL settings for FTI (isolated from Agricart ERP).
 * Values come only from server env — never expose to the client.
 */
export type DbConfig = {
  connection: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
};

export function getDbConfig(): DbConfig {
  return {
    connection: process.env.DB_CONNECTION || "mysql",
    host: process.env.DB_HOST || "",
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_DATABASE || "u262659235_fti",
    username: process.env.DB_USERNAME || "u262659235_fti_user",
    password: process.env.DB_PASSWORD || "",
  };
}

export function isDbConfigured(): boolean {
  const cfg = getDbConfig();
  return Boolean(cfg.host && cfg.database && cfg.username && cfg.password);
}
