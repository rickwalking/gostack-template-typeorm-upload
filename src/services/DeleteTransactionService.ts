import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

interface Request {
    id: string;
}
class DeleteTransactionService {
    public async execute({ id }: Request): Promise<Transaction> {
        const transactionRepository = getCustomRepository(TransactionsRepository);

        const transaction = await transactionRepository.findOne({
            where: { id }
        });

        if (transaction === undefined) {
            throw new AppError('Cant find transation with specified ID', 400);
        }

        return await transactionRepository.remove(transaction);
    }
}

export default DeleteTransactionService;
