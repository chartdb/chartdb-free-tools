// Database logo paths mapping
// Uses basePath /tools for production

interface DbLogoPaths {
  light: string;
  dark: string;
}

const DB_LOGOS: Record<string, DbLogoPaths> = {
  // Primary databases with custom logos
  mysql: {
    light: "/tools/db-logos/mysql.png",
    dark: "/tools/db-logos/mysql-dark.png",
  },
  postgresql: {
    light: "/tools/db-logos/postgresql.png",
    dark: "/tools/db-logos/postgresql-dark.png",
  },
  postgres: {
    light: "/tools/db-logos/postgresql.png",
    dark: "/tools/db-logos/postgresql-dark.png",
  },
  sqlserver: {
    light: "/tools/db-logos/sqlserver.png",
    dark: "/tools/db-logos/sqlserver-dark.png",
  },
  transactsql: {
    light: "/tools/db-logos/sqlserver.png",
    dark: "/tools/db-logos/sqlserver-dark.png",
  },
  mssql: {
    light: "/tools/db-logos/sqlserver.png",
    dark: "/tools/db-logos/sqlserver-dark.png",
  },
  sqlite: {
    light: "/tools/db-logos/sqlite.png",
    dark: "/tools/db-logos/sqlite-dark.png",
  },
  mariadb: {
    light: "/tools/db-logos/mariadb.png",
    dark: "/tools/db-logos/mariadb-dark.png",
  },
  oracle: {
    light: "/tools/db-logos/oracle.png",
    dark: "/tools/db-logos/oracle-dark.png",
  },

  // Cloud databases
  bigquery: {
    light: "/tools/db-logos/bigquery.png",
    dark: "/tools/db-logos/bigquery-dark.png",
  },
  snowflake: {
    light: "/tools/db-logos/snowflake.png",
    dark: "/tools/db-logos/snowflake-dark.png",
  },

  // Databases using generic logo (no dark variant)
  redshift: {
    light: "/tools/db-logos/generic.png",
    dark: "/tools/db-logos/generic.png",
  },
  spark: {
    light: "/tools/db-logos/generic.png",
    dark: "/tools/db-logos/generic.png",
  },
  hive: {
    light: "/tools/db-logos/generic.png",
    dark: "/tools/db-logos/generic.png",
  },
};

const DEFAULT_LOGO: DbLogoPaths = {
  light: "/tools/db-logos/generic.png",
  dark: "/tools/db-logos/generic.png",
};

export function getDbLogo(dialect: string, isDark: boolean = false): string {
  const logos = DB_LOGOS[dialect.toLowerCase()] || DEFAULT_LOGO;
  return isDark ? logos.dark : logos.light;
}

export function getDbLogos(dialect: string): DbLogoPaths {
  return DB_LOGOS[dialect.toLowerCase()] || DEFAULT_LOGO;
}
