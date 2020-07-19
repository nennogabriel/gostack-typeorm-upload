import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const incomes = transactions.map(transaction =>
      transaction.type === 'income' ? transaction.value : 0,
    );
    incomes.push(0);
    const income = incomes.reduce((acc, value) => acc + value);
    const outcomes = transactions.map(transaction =>
      transaction.type === 'outcome' ? transaction.value : 0,
    );
    outcomes.push(0);
    const outcome = outcomes.reduce((acc, value) => acc + value);
    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
