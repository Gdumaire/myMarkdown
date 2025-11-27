import { MigrationInterface, QueryRunner } from "typeorm";

export class Plop1764026664951 implements MigrationInterface {
    name = 'Plop1764026664951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "note" ("uuid" character varying NOT NULL, "title" character varying(100) NOT NULL, "content" character varying NOT NULL, "userUuid" character varying, CONSTRAINT "PK_37c326351d4d4c33ca3667552ac" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "user" ("uuid" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_9077d22300d4ae32c3474fa6070" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_9077d22300d4ae32c3474fa6070"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "note"`);
    }

}
