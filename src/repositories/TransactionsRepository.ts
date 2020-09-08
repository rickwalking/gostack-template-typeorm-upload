import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

import { getSumTransactions } from '../utils/GetSumTransactions';

interface Balance {
    income: number;
    outcome: number;
    total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
    public async getBalance(): Promise<Balance> {
        const transactions = await this.find();

        const income = getSumTransactions(transactions, 'income');
        const outcome = getSumTransactions(transactions, 'outcome');

        return {
            income,
            outcome,
            total: income - outcome
        } || null;
    }
}

export default TransactionsRepository;
