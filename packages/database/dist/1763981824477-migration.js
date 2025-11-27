export class Migration1763981824477 {
    constructor() {
        this.name = 'Migration1763981824477';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "note" ("uuid" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "content" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_37c326351d4d4c33ca3667552ac" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "note"`);
    }
}
//# sourceMappingURL=1763981824477-migration.js.map