import { DataSource } from "typeorm";
import config from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.db.host,
  port: Number(config.db.port),
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: false,
  logging: false,
  entities: ["./src/entities/**/*.ts"],
});
