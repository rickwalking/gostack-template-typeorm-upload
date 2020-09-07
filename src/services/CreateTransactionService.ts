// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository'

import Transaction from '../models/Transactions';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface  Request {
    title: string;
    value: number;
    type: 'income' | 'outcome';
    category: string;
}

class CreateTransactionService {
    public async execute({ title, value, type, category }: Request): Promise<Transaction> {
        const transactionsRepository = getCustomRepository(TransactionsRepository);
        const balance = await transactionsRepository.getBalance();

        if (
            type === 'outcome' &&
            (balance.total === 0 || balance.total - value < 0)
        ) {
            throw new AppError(
                'Cannot create outcome transaction with higher value than current total',
                400
            );
        }

        const categoryRepository = getRepository(Category);
        let transaction: Transaction;
        let savedCategory: Category | undefined;

        savedCategory = await categoryRepository.findOne({
            title: category
        });

        if (savedCategory === undefined) {
            const newCategory = categoryRepository.create({
                title: category
            });

            savedCategory = await categoryRepository.save(newCategory);
        }

        transaction = transactionsRepository.create({
            title,
            type,
            value,
            category_id: savedCategory.id
        });

        await transactionsRepository.save(transaction);

        return transaction;
    }
}

export default CreateTransactionService;
