import csvParse from 'csv-parse';

import { getCustomRepository, getRepository, In } from 'typeorm';

import fs from 'fs';

import Transactions from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
    title: string;
    type: 'income' | 'outcome';
    value: number;
    category: string;
}

class ImportTransactionsService {
    async execute(filePath: string): Promise<Transactions[]> {
        const transactionRepository = getCustomRepository(TransactionsRepository);
        const categoriesRepository = getRepository(Category);

        const contactsReadStream = fs.createReadStream(filePath);

        const parses = csvParse({
            from_line: 2
        });

        const parseCSV = contactsReadStream.pipe(parses);

        const transactions: CSVTransaction[] = [];
        const categories: string[] = [];

        parseCSV.on('data', async (line) => {
            const [title, type, value, category] = line.map((cell: string) => {
                return cell.trim();
            });

            if (!title || !type || !value) {
                return;
            }

            categories.push(category);

            transactions.push({ title, type, value, category });
        });

        await new Promise((resolve) => parseCSV.on('end', resolve));

        const existentCategories = await categoriesRepository.find({
            where: {
                title: In(categories)
            }
        });

        const existentCategoriesTitle = existentCategories.map((category: Category) => {
            return category.title;
        });

        const addCategoryTitles = categories
            .filter((category) => !existentCategoriesTitle.includes(category))
            .filter((value, index, self) => self.indexOf(value) === index);

        const newCategories = categoriesRepository.create(
            addCategoryTitles.map((title) => ({
                title,
            })),
        );

        await categoriesRepository.save(newCategories);

        const finalCategories: Category[] = [...newCategories, ...existentCategories];

        const createdTransactions = transactionRepository.create(
            transactions.map((transaction) => ({
                title: transaction.title,
                type: transaction.type,
                value: transaction.value,
                category: finalCategories.find((cat) => cat.title === transaction.category)
            })),
        );

        await transactionRepository.save(createdTransactions);

        await fs.promises.unlink(filePath);

        return createdTransactions;
    }
}

export default ImportTransactionsService;
