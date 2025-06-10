import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAll1749539111544 implements MigrationInterface {
    name = 'InitAll1749539111544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin', 'superadmin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."problems_type_enum" AS ENUM('安全', '环境', '电器损坏', '食堂', '办公', '其他')`);
        await queryRunner.query(`CREATE TYPE "public"."problems_severity_enum" AS ENUM('低', '中', '高')`);
        await queryRunner.query(`CREATE TABLE "problems" ("id" SERIAL NOT NULL, "type" "public"."problems_type_enum" NOT NULL, "description" character varying NOT NULL, "severity" "public"."problems_severity_enum" NOT NULL, "status" character varying NOT NULL DEFAULT '待处理', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "images" text array, "reporterId" integer, CONSTRAINT "PK_b3994afba6ab64a42cda1ccaeff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "problems" ADD CONSTRAINT "FK_bbf6f0e212df5fe0fbb0f095bfd" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems" DROP CONSTRAINT "FK_bbf6f0e212df5fe0fbb0f095bfd"`);
        await queryRunner.query(`DROP TABLE "problems"`);
        await queryRunner.query(`DROP TYPE "public"."problems_severity_enum"`);
        await queryRunner.query(`DROP TYPE "public"."problems_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
