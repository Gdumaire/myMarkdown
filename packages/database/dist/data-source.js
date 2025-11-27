import "reflect-metadata";
import 'dotenv/config';
import { DataSource } from "typeorm";
console.log({ type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: false,
    logging: true,
    entities: ["./entity/*.js"],
    migrations: ['./migration/**/*{.js,.ts}'],
    subscribers: [], });
export default new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: false,
    logging: true,
    entities: ["./entity/*.js"],
    migrations: ['./migration/**/*{.js,.ts}'],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map