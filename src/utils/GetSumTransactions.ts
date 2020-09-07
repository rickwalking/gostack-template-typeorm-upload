import Transaction from '../models/Transactions';

export function getSumTransactions(
    transations: Transaction[],
    type: 'income' | 'outcome'
): number {
    return transations
        .filter((transaction: Transaction) => transaction.type === type)
        .map((transaction: Transaction) => transaction.value)
        .reduce(
            (previous: number, current: number) => previous + current,
            0,
        );
}
