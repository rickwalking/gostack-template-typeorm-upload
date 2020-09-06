import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from 'typeorm';

export class AlterCategoryFieldToCategoryId1599359302304 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('transactions', 'category');
        await queryRunner.addColumn('transactions', new TableColumn({
            name: 'category_id',
            type: 'uuid',
            isNullable: true
        }));

        await queryRunner.createForeignKey('transactions', new TableForeignKey({
            name: 'TransactionProvider',
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'categories',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('transactions', 'TransactionProvider');
        await queryRunner.dropColumn('transactions', 'category_id');

        await queryRunner.addColumn('transactios', new TableColumn({
            name: 'category',
            type: 'varchar'
        }));
    }

}
