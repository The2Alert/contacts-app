import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1661180056425 implements MigrationInterface {
    name = "migration1661180056425";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`contacts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` int NOT NULL, \`photo\` varchar(255) NOT NULL DEFAULT '', \`name\` varchar(255) NOT NULL, \`surname\` varchar(255) NOT NULL, \`contact\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`login\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `ALTER TABLE \`contacts\` ADD CONSTRAINT \`FK_30ef77942fc8c05fcb829dcc61d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contacts\` DROP FOREIGN KEY \`FK_30ef77942fc8c05fcb829dcc61d\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`contacts\``);
    }
}
