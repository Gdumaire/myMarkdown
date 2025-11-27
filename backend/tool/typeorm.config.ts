// typeorm.config.ts
import { DataSource } from 'typeorm';
import * as dotenv from "dotenv";

dotenv.config({ path: ".dev.env" });   // <-- Load your env file



export default new DataSource({
type: 'postgres',
host: process.env.DB_HOST,
port: Number(process.env.DB_PORT),
username: process.env.DB_USERNAME,
password: process.env.DB_PASS,
database: process.env.DB_NAME,
entities: ['dist/src/infra/database/entities/*.js'],
migrations: ['tool/migration/*.ts'],
migrationsTableName: "mf_migration_table"
});
