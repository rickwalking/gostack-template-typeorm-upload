// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository'

import Transaction from '../models/Transactions';
import Category from '../models/Category';

interface  Request {
    title: string;
    value: number;
    type: 'income' | 'outcome';
    category: string;
}

class CreateTransactionService {
    public async execute({ title, value, type, category }: Request): Promise<Transaction> {
        const transactionsRepository = getCustomRepository(TransactionsRepository);

        const categoryRepository = getRepository(Category);

        const findCategory = await categoryRepository.findOne({
            where: { category }
        });

        if (!findCategory) {
            const newCategory = categoryRepository.create({
                title
            });

            await categoryRepository.save(newCategory);
        }

        const transaction = transactionsRepository.create({
            title,
            type,
            value,
        });

        await transactionsRepository.save(transaction);

        return transaction;
    }
}

export default CreateTransactionService;
