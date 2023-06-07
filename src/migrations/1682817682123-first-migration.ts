import { MigrationInterface, QueryRunner } from "typeorm";

export class firstMigration1682817682123 implements MigrationInterface {
    name = 'firstMigration1682817682123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "video" ("id" SERIAL NOT NULL, "name" character varying(200) NOT NULL, "format" character varying(100) NOT NULL, "duration" double precision NOT NULL, "frame_rate" double precision NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "title" character varying(200) NOT NULL, "category" character varying, "about" character varying(1000), "process_status" double precision, "status_id" integer NOT NULL DEFAULT '2', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_49ae346c26ec88976bfddaafc01" UNIQUE ("name"), CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4f527cd4725f00ad3fcfa5b941" ON "video" ("status_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4f527cd4725f00ad3fcfa5b941"`);
        await queryRunner.query(`DROP TABLE "video"`);
    }

}
