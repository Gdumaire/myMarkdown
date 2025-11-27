import "reflect-metadata";
import 'dotenv/config';
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Note } from "./entity/Note";
export default new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: false,
    logging: true,
    entities: [User, Note],
    migrations: [__dirname + '/migration/**/*{.js,.ts}'],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map