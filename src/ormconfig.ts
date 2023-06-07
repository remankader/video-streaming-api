import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const ormconfig = new DataSource({
  type: process.env.ORMCONFIG_TYPE as any,
  host: process.env.ORMCONFIG_HOST,
  port: Number(process.env.ORMCONFIG_PORT),
  username: process.env.ORMCONFIG_USER,
  password: process.env.ORMCONFIG_PASSWORD,
  database: process.env.ORMCONFIG_DATABASE,
  entities: [__dirname + process.env.ORMCONFIG_ENTITIES],
  synchronize:
    String(process.env.ORMCONFIG_SYNCHRONIZE).toLowerCase() === "true",
  migrationsRun:
    String(process.env.ORMCONFIG_MIGRATIONS_RUN).toLowerCase() === "true",
  logging: String(process.env.ORMCONFIG_LOGGING).toLowerCase() === "true",
  logger: process.env.ORMCONFIG_LOGGER as any,
  migrations: [__dirname + process.env.ORMCONFIG_MIGRATIONS],
  bigNumberStrings: false,
});

export default ormconfig;
